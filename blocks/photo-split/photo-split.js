export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  const imageCol = cols.find((c) => c.querySelector('picture'));
  const textCol = cols.find((c) => !c.querySelector('picture')) || cols[1];

  const split = document.createElement('div');
  split.className = 'photo-split-layout';

  // Image side
  const imgDiv = document.createElement('div');
  imgDiv.className = 'photo-split-image';
  if (imageCol) {
    const pic = imageCol.querySelector('picture');
    if (pic) imgDiv.append(pic);
  }

  // Text side
  const textDiv = document.createElement('div');
  textDiv.className = 'photo-split-text';
  if (textCol) {
    // Move all children from text column
    while (textCol.firstChild) textDiv.append(textCol.firstChild);
  }

  // Detect <em> elements as technique labels and style them
  textDiv.querySelectorAll('em').forEach((em) => {
    if (em.closest('p') && em.parentElement.childNodes.length === 1) {
      em.parentElement.classList.add('technique-label');
    }
  });

  // Detect <strong> in paragraphs as guideline callouts
  textDiv.querySelectorAll('p').forEach((p) => {
    if (p.querySelector('strong') && p.childNodes.length > 1) {
      p.classList.add('guideline-callout');
    }
  });

  split.append(imgDiv);
  split.append(textDiv);
  block.replaceChildren(split);
}
