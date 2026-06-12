import { createOptimizedPicture } from '../../scripts/aem.js';

function openLightbox(src, alt, caption) {
  const overlay = document.createElement('div');
  overlay.className = 'gallery-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', caption || 'Image viewer');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'gallery-lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '\u00D7';

  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';

  overlay.append(closeBtn, img);

  if (caption) {
    const cap = document.createElement('p');
    cap.className = 'gallery-lightbox-caption';
    cap.textContent = caption;
    overlay.append(cap);
  }

  function close() {
    overlay.remove();
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) close();
  });

  function onKey(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onKey);
    }
  }
  document.addEventListener('keydown', onKey);

  document.body.style.overflow = 'hidden';
  document.body.append(overlay);
  closeBtn.focus();
}

export default function decorate(block) {
  const items = [...block.children];
  const gallery = document.createElement('div');
  gallery.className = 'gallery-grid';

  items.forEach((row, idx) => {
    const cols = [...row.children];
    const imgCell = cols[0];
    const captionCell = cols[1];
    const captionText = captionCell?.textContent.trim() || '';

    const item = document.createElement('button');
    item.className = 'gallery-item';
    item.setAttribute('aria-label', captionText || `View image ${idx + 1}`);

    const img = imgCell?.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt || captionText, false, [{ width: '600' }]);
      item.append(optimized);
    }

    if (captionText) {
      const caption = document.createElement('span');
      caption.className = 'gallery-caption';
      caption.textContent = captionText;
      item.append(caption);
    }

    item.addEventListener('click', () => {
      const fullSrc = img?.src || '';
      openLightbox(fullSrc, img?.alt, captionText);
    });

    gallery.append(item);
  });

  block.replaceChildren(gallery);
}
