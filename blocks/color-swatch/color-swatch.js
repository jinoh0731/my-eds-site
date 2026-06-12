function luminance(hex) {
  const rgb = hex.replace('#', '').match(/.{2}/g).map((c) => parseInt(c, 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex) {
  const result = hex.replace('#', '').match(/.{2}/g).map((c) => parseInt(c, 16));
  return result.join(' / ');
}

export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'color-swatch-grid';

  rows.forEach((row) => {
    const cols = [...row.children];
    const name = cols[0]?.textContent.trim() || '';
    const hex = cols[1]?.textContent.trim() || '#000000';
    const desc = cols[2]?.textContent.trim() || '';
    const pantone = cols[3]?.textContent.trim() || '';

    const card = document.createElement('div');
    card.className = 'color-swatch-card';

    const swatch = document.createElement('div');
    swatch.className = 'color-swatch-color';
    swatch.style.backgroundColor = hex;

    const isLight = luminance(hex) > 0.4;
    swatch.classList.toggle('light-text', !isLight);
    swatch.classList.toggle('dark-text', isLight);

    const nameEl = document.createElement('span');
    nameEl.className = 'color-swatch-name';
    nameEl.textContent = name;
    swatch.append(nameEl);

    card.append(swatch);

    const info = document.createElement('div');
    info.className = 'color-swatch-info';

    const hexEl = document.createElement('div');
    hexEl.className = 'color-swatch-value';
    hexEl.innerHTML = `<span class="label">HEX</span> <span class="val">${hex.toUpperCase()}</span>`;
    info.append(hexEl);

    const rgbEl = document.createElement('div');
    rgbEl.className = 'color-swatch-value';
    rgbEl.innerHTML = `<span class="label">RGB</span> <span class="val">${hexToRgb(hex)}</span>`;
    info.append(rgbEl);

    if (pantone) {
      const pantoneEl = document.createElement('div');
      pantoneEl.className = 'color-swatch-value';
      pantoneEl.innerHTML = `<span class="label">PANTONE</span> <span class="val">${pantone}</span>`;
      info.append(pantoneEl);
    }

    if (desc) {
      const descEl = document.createElement('p');
      descEl.className = 'color-swatch-desc';
      descEl.textContent = desc;
      info.append(descEl);
    }

    card.append(info);
    grid.append(card);
  });

  block.replaceChildren(grid);
}
