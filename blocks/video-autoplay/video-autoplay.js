export default function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const src = link.href;
  link.closest('div').remove();

  // Build video element
  const video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('loop', '');
  video.classList.add('video-autoplay-player');

  const source = document.createElement('source');
  source.setAttribute('src', src);
  source.setAttribute('type', `video/${src.split('.').pop()}`);
  video.append(source);

  // Unmute button
  const controls = document.createElement('div');
  controls.classList.add('video-autoplay-controls');

  const unmuteBtn = document.createElement('button');
  unmuteBtn.classList.add('video-autoplay-unmute');
  unmuteBtn.setAttribute('aria-label', 'Unmute video');
  unmuteBtn.innerHTML = `
    <svg xmlns="[w3.org](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" width="24" height="24">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 2 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
  `;

  const soundOnIcon = `
    <svg xmlns="[w3.org](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" width="24" height="24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  `;

  unmuteBtn.addEventListener('click', () => {
    if (video.muted) {
      video.muted = false;
      unmuteBtn.innerHTML = soundOnIcon;
      unmuteBtn.setAttribute('aria-label', 'Mute video');
    } else {
      video.muted = true;
      unmuteBtn.innerHTML = `
        <svg xmlns="[w3.org](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" width="24" height="24">
          <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 2 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
      `;
      unmuteBtn.setAttribute('aria-label', 'Unmute video');
    }
  });

  controls.append(unmuteBtn);
  block.append(video);
  block.append(controls);

  // Autoplay fallback — some browsers block autoplay
  video.play().catch(() => {
    video.muted = true;
    video.play();
  });
}

