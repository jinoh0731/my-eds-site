export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    // First col = optional image + title, second col = link
    const picture = cols[0]?.querySelector('picture');
    const title = cols[0]?.textContent.trim() || '';
    const link = cols[1]?.querySelector('a');

    const card = document.createElement('a');
    card.className = 'asset-card';
    if (picture) card.classList.add('has-image');

    if (link) {
      card.href = link.href;
    } else {
      card.href = '#';
    }

    // Add image preview if present
    if (picture) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'asset-card-image';
      imgWrap.append(picture);
      card.append(imgWrap);
    }

    const textWrap = document.createElement('div');
    textWrap.className = 'asset-card-text';

    const h3 = document.createElement('h3');
    h3.textContent = title;
    textWrap.append(h3);

    // subtitle <p> removed

    card.append(textWrap);
    li.append(card);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
