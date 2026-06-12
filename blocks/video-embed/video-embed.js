function extractYouTubeId(url) {
  const match = url.match(/(?:v=|\/embed\/|\.be\/)([\w-]{11})/);
  return match ? match[1] : '';
}

export default function decorate(block) {
  const rows = [...block.children];
  const urlCell = rows[0];
  const captionCell = rows[1];

  const link = urlCell?.querySelector('a');
  const url = link?.href || urlCell?.textContent.trim();
  const captionText = captionCell?.textContent.trim() || '';

  const wrapper = document.createElement('div');
  wrapper.className = 'video-embed-wrapper';

  if (url.match(/youtube\.com|youtu\.be/)) {
    // YouTube facade pattern: show thumbnail, load iframe on click
    const videoId = extractYouTubeId(url);
    if (videoId) {
      const facade = document.createElement('button');
      facade.className = 'video-embed-facade';
      facade.setAttribute('aria-label', captionText || 'Play video');

      const thumb = document.createElement('img');
      thumb.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      thumb.alt = captionText || 'Video thumbnail';
      thumb.loading = 'lazy';

      const play = document.createElement('span');
      play.className = 'video-embed-play';
      play.setAttribute('aria-hidden', 'true');

      facade.append(thumb, play);

      facade.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');
        iframe.title = captionText || 'YouTube video';
        facade.replaceWith(iframe);
      });

      wrapper.append(facade);
    }
  } else if (url.match(/\.mp4$/i)) {
    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.setAttribute('playsinline', '');

    const source = document.createElement('source');
    source.src = url;
    source.type = 'video/mp4';
    video.append(source);

    wrapper.append(video);
  }

  if (captionText) {
    const caption = document.createElement('p');
    caption.className = 'video-embed-caption';
    caption.textContent = captionText;
    wrapper.append(caption);
  }

  block.replaceChildren(wrapper);
}
