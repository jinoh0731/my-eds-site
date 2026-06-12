export default function decorate(block) {
  const tracks = [...block.children];
  const playlist = document.createElement('div');
  playlist.className = 'audio-playlist';

  tracks.forEach((row) => {
    const cols = [...row.children];
    const srcCell = cols[0];
    const labelCell = cols[1];

    const link = srcCell?.querySelector('a');
    const src = link?.href || srcCell?.textContent.trim();
    const label = labelCell?.textContent.trim() || 'Audio Track';

    const track = document.createElement('div');
    track.className = 'audio-track';

    const playBtn = document.createElement('button');
    playBtn.className = 'audio-play-btn';
    playBtn.setAttribute('aria-label', `Play ${label}`);

    const playIcon = document.createElement('span');
    playIcon.className = 'audio-icon-play';
    playBtn.append(playIcon);

    const info = document.createElement('div');
    info.className = 'audio-info';

    const title = document.createElement('span');
    title.className = 'audio-title';
    title.textContent = label;

    const duration = document.createElement('span');
    duration.className = 'audio-duration';
    info.append(title, duration);

    const progress = document.createElement('div');
    progress.className = 'audio-progress';

    const progressBar = document.createElement('div');
    progressBar.className = 'audio-progress-bar';
    progress.append(progressBar);

    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.src = src;

    audio.addEventListener('loadedmetadata', () => {
      const dur = Math.round(audio.duration);
      const min = Math.floor(dur / 60);
      const sec = String(dur % 60).padStart(2, '0');
      duration.textContent = `${min}:${sec}`;
    });

    audio.addEventListener('timeupdate', () => {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${pct}%`;
    });

    audio.addEventListener('ended', () => {
      playIcon.className = 'audio-icon-play';
      track.classList.remove('playing');
    });

    playBtn.addEventListener('click', () => {
      // Pause all other tracks in this block
      block.querySelectorAll('audio').forEach((a) => {
        if (a !== audio) {
          a.pause();
          // eslint-disable-next-line no-param-reassign
          a.currentTime = 0;
        }
      });
      block.querySelectorAll('.audio-track').forEach((t) => t.classList.remove('playing'));
      block.querySelectorAll('.audio-icon-pause').forEach((icon) => {
        // eslint-disable-next-line no-param-reassign
        icon.className = 'audio-icon-play';
      });

      if (audio.paused) {
        audio.play();
        playIcon.className = 'audio-icon-pause';
        track.classList.add('playing');
      } else {
        audio.pause();
        playIcon.className = 'audio-icon-play';
        track.classList.remove('playing');
      }
    });

    track.append(playBtn, info, progress, audio);
    playlist.append(track);
  });

  block.replaceChildren(playlist);
}
