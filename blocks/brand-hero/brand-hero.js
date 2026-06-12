export default function decorate(block) {
  // Note: dark-page class is applied globally to body for full-page dark theme.
  // EDS does full page loads, so this is safe. If SPA navigation is ever added,
  // cleanup logic would be needed.
  document.body.classList.add('dark-page');

  const rows = [...block.children];
  const content = document.createElement('div');
  content.className = 'brand-hero-content';

  rows.forEach((row) => {
    while (row.firstElementChild) content.append(row.firstElementChild);
  });

  block.replaceChildren(content);
}
