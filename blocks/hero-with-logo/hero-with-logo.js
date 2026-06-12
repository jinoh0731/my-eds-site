export default function decorate(block) {
  document.body.classList.add('dark-page');

  // One row, two cells: cell 0 = headline, cell 1 = image
  const firstRow = block.children[0];
  const cells = firstRow ? [...firstRow.children] : [];

  const inner = document.createElement('div');
  inner.className = 'hero-with-logo-inner';

  // --- Cell 1: image (NOW LEFT) ---
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'hero-with-logo-image';
  const picture = cells[1]?.querySelector('picture');
  if (picture) imageWrapper.appendChild(picture);
  inner.appendChild(imageWrapper); // ← appended first

  // --- Cell 0: headline (NOW RIGHT) ---
  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'hero-with-logo-title';
  const rawText = cells[0]?.textContent.trim() ?? '';
  const words = rawText.split(/\s+/).filter(Boolean);
  const h1 = document.createElement('h1');
  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.className = 'hero-with-logo-word';
    if (index === 0) span.classList.add('hero-with-logo-word--first');
    if (index === words.length - 1) span.classList.add('hero-with-logo-word--last');
    span.textContent = word;
    h1.appendChild(span);
  });
  titleWrapper.appendChild(h1);
  inner.appendChild(titleWrapper); // ← appended second

  block.replaceChildren(inner);
}
