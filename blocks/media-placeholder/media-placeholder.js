import { loadScript } from '../../scripts/aem.js';

const THREE_VERSION = '0.147.0';
const CDN = `https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}`;

function buildPlaceholderCard(rows) {
  const card = document.createElement('div');
  card.className = 'media-placeholder-card';

  rows.forEach((row) => {
    [...row.children].forEach((col) => {
      const text = col.textContent.trim();
      if (!text) return;
      const p = document.createElement('p');
      p.textContent = text;
      card.append(p);
    });
  });

  return card;
}

async function build3DViewer(src, block) {
  await loadScript(`${CDN}/build/three.min.js`);
  await loadScript(`${CDN}/examples/js/loaders/GLTFLoader.js`);

  const { THREE } = window;

  const wrapper = document.createElement('div');
  wrapper.className = 'media-placeholder-3d';
  block.replaceChildren(wrapper);

  // Renderer — transparent background, high quality
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping;
  wrapper.append(renderer.domElement);

  const scene = new THREE.Scene();

  // Orthographic-like perspective for a clean, straight-on look
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);

  // Clean, even lighting — lower intensity to prevent color washout
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
  keyLight.position.set(0, 2, 15);
  scene.add(keyLight);

  const fillLeft = new THREE.DirectionalLight(0xffffff, 0.2);
  fillLeft.position.set(-10, 0, 8);
  scene.add(fillLeft);

  const fillRight = new THREE.DirectionalLight(0xffffff, 0.2);
  fillRight.position.set(10, 0, 8);
  scene.add(fillRight);

  // Rim light for depth — subtle blue accent from behind
  const rimLight = new THREE.DirectionalLight(0x3399cc, 0.3);
  rimLight.position.set(0, 3, -10);
  scene.add(rimLight);

  function resize() {
    const w = wrapper.clientWidth || block.clientWidth || 700;
    const h = wrapper.clientHeight || 500;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(wrapper);
  resize();
  window.addEventListener('resize', resize);

  // Load model
  const loader = new THREE.GLTFLoader();
  loader.load(
    src,
    (gltf) => {
      const model = gltf.scene;

      // Correct material colors to official NFL brand specs
      const colorFixes = {
        b20019: '#D50A0A', // NFL Red
        '7f0000': '#D50A0A', // NFL Red (was too dark)
        '003366': '#003369', // NFL Blue
        e5e5e5: '#FFFFFF', // NFL White
      };
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            if (m.color) {
              const hex = m.color.getHexString();
              if (colorFixes[hex]) m.color.set(colorFixes[hex]);
            }
          });
        }
      });

      // The model contains two shield copies side-by-side:
      // Left group (cx≈-4) = flat 2D version, Right group (cx≈33) = 3D version
      // Hide the left (flat) group, keep only the 3D shield
      model.traverse((child) => {
        if (child.isMesh) {
          const meshBox = new THREE.Box3().setFromObject(child);
          const cx = meshBox.getCenter(new THREE.Vector3()).x;
          if (cx < 15) child.visible = false;
        }
      });

      // Use a pivot group to cleanly center + rotate
      const pivot = new THREE.Group();

      // Recalculate bounds with only visible meshes
      const box = new THREE.Box3();
      model.traverse((child) => {
        if (child.isMesh && child.visible) {
          const childBox = new THREE.Box3().setFromObject(child);
          box.union(childBox);
        }
      });
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Offset the model so the visible shield is at origin
      model.position.set(-center.x, -center.y, -center.z);

      // Scale to fill the viewport — large and bold
      const maxDim = Math.max(size.x, size.y);
      const pivotScale = 14 / maxDim;
      pivot.scale.setScalar(pivotScale);

      pivot.add(model);
      scene.add(pivot);

      // Camera straight on — the shield faces -Z in model space
      // so we look from +Z direction
      camera.position.set(0, 0, 50);
      camera.lookAt(0, 0, 0);

      // Drag-to-rotate interaction
      let isDragging = false;
      let prevX = 0;
      let userRotation = 0;

      wrapper.style.cursor = 'grab';
      wrapper.addEventListener('pointerdown', (e) => {
        isDragging = true;
        prevX = e.clientX;
        wrapper.style.cursor = 'grabbing';
        wrapper.setPointerCapture(e.pointerId);
      });
      wrapper.addEventListener('pointerup', (e) => {
        isDragging = false;
        wrapper.style.cursor = 'grab';
        wrapper.releasePointerCapture(e.pointerId);
      });
      wrapper.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        userRotation += (e.clientX - prevX) * 0.005;
        prevX = e.clientX;
      });

      // Gentle breathing animation — very subtle, keeps front-facing
      let animId;
      let time = 0;
      function animate() {
        animId = requestAnimationFrame(animate);
        time += 0.008;

        // Combine breathing with user drag rotation
        pivot.rotation.y = Math.sin(time) * 0.09 + userRotation;
        // Gentle floating
        pivot.position.y = Math.sin(time * 0.6) * 0.15;

        renderer.render(scene, camera);
      }

      // Render first frame immediately
      renderer.render(scene, camera);
      animate();

      // Pause when off-screen
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!animId) animate();
          } else {
            cancelAnimationFrame(animId);
            animId = null;
          }
        });
      });
      observer.observe(wrapper);
    },
    undefined,
    (error) => {
      /* eslint-disable-next-line no-console */
      console.error('Failed to load 3D model:', error);
      wrapper.innerHTML = '<div class="media-placeholder-card"><p>3D Shield</p></div>';
    },
  );
}

export default async function decorate(block) {
  const rows = [...block.children];
  const link = block.querySelector('a[href$=".glb"]');

  if (link) {
    await build3DViewer(link.href, block);
  } else {
    block.replaceChildren(buildPlaceholderCard(rows));
  }
}
