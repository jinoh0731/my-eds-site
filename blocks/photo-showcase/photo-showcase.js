export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  const imageCol = cols.find((c) => c.querySelector('picture'));
  const textCol = cols.find((c) => !c.querySelector('picture'));

  const showcase = document.createElement('div');
  showcase.className = 'photo-showcase-inner';

  if (imageCol) {
    const pic = imageCol.querySelector('picture');
    if (pic) showcase.append(pic);
  }

  if (textCol) {
    const overlay = document.createElement('div');
    overlay.className = 'photo-showcase-overlay';
    const inner = document.createElement('div');
    inner.className = 'photo-showcase-overlay-inner';
    while (textCol.firstChild) inner.append(textCol.firstChild);
    overlay.append(inner);
    showcase.append(overlay);
  }

  block.replaceChildren(showcase);
}
