export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'photo-mosaic-grid';

  rows.forEach((row, i) => {
    const cols = [...row.children];
    const item = document.createElement('div');
    item.className = 'photo-mosaic-item';
    if (i === 0 && block.classList.contains('hero')) {
      item.classList.add('span-rows');
    }

    // First col: image
    const pic = cols[0]?.querySelector('picture');
    if (pic) item.append(pic);

    // Second col (optional): label text + optional color class
    if (cols[1]) {
      const labelText = cols[1].textContent.trim();
      if (labelText) {
        const label = document.createElement('div');
        label.className = 'photo-mosaic-label';
        // Check for color hints: "Dramatic Cropping|navy" or just "Dramatic Cropping"
        const parts = labelText.split('|');
        label.textContent = parts[0].trim();
        if (parts[1]) {
          label.classList.add(parts[1].trim());
        }
        item.append(label);
      }
    }

    grid.append(item);
  });

  block.replaceChildren(grid);
}
