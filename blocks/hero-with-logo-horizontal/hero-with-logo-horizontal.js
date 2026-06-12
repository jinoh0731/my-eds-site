export default function decorate(block) {
  // Handle both table layout (two cells) and default-content (two paragraphs)
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const paragraphs = [...block.querySelectorAll(':scope > p')];

  let logoSource, titleSource;

  if (cells.length >= 2) {
    // Table layout: two cells
    logoSource = cells[0];
    titleSource = cells[1];
  } else if (paragraphs.length >= 2) {
    // Default content layout: two paragraphs
    logoSource = paragraphs[0];
    titleSource = paragraphs[1];
  } else {
    return;
  }

  // Create structure
  const hero = document.createElement('div');
  hero.className = 'hero-with-logo-horizontal';

  const inner = document.createElement('div');
  inner.className = 'hero-with-logo-horizontal-inner';

  // ---- Logo (left) --------------------------------------------------------
  const logoWrap = document.createElement('div');
  logoWrap.className = 'hero-with-logo-horizontal-logo';
  while (logoSource.firstChild) {
    logoWrap.appendChild(logoSource.firstChild);
  }
  inner.appendChild(logoWrap);

  // ---- Title (right) — single line in blue --------------------------------
  const titleWrap = document.createElement('div');
  titleWrap.className = 'hero-with-logo-horizontal-title';

  const heading = document.createElement('h1');
  heading.textContent = (titleSource.textContent || '').trim();

  titleWrap.appendChild(heading);
  inner.appendChild(titleWrap);

  hero.appendChild(inner);

  // Replace block contents
  block.textContent = '';
  block.appendChild(hero);
}
