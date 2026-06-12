/**
 * Loads and decorates the stats block.
 * Each row = one stat: [value, label, optional description]
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const dl = document.createElement('dl');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'stats-item';

    const value = document.createElement('dt');
    value.className = 'stats-value';
    value.textContent = cells[0]?.textContent.trim() || '';

    const label = document.createElement('dd');
    label.className = 'stats-label';
    label.textContent = cells[1]?.textContent.trim() || '';

    item.append(value, label);

    if (cells[2]) {
      const desc = document.createElement('p');
      desc.className = 'stats-desc';
      desc.textContent = cells[2].textContent.trim();
      item.append(desc);
    }

    dl.append(item);
  });

  block.replaceChildren(dl);
}
