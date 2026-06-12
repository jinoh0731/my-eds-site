import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Loads and decorates the article-list block.
 * Each row: [optional image, article body content]
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        cell.className = 'article-list-image';
        const img = cell.querySelector('picture > img');
        if (img) {
          img.closest('picture').replaceWith(
            createOptimizedPicture(img.src, img.alt, false, [{ width: '800' }]),
          );
        }
      } else {
        cell.className = 'article-list-body';
      }
      li.append(cell);
    });

    ul.append(li);
  });

  block.replaceChildren(ul);
}
