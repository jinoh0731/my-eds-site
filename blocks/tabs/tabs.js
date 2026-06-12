/**
 * Loads and decorates the tabs block.
 * Each row: [tab label, tab content]
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  const tabPanels = document.createElement('div');
  tabPanels.className = 'tabs-panels';

  [...block.children].forEach((row, idx) => {
    const [labelCell, contentCell] = [...row.children];
    const tabId = `tab-${idx}`;
    const panelId = `panel-${idx}`;

    const tab = document.createElement('button');
    tab.className = 'tabs-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('id', tabId);
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    tab.textContent = labelCell?.textContent.trim() || `Tab ${idx + 1}`;

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', panelId);
    panel.setAttribute('aria-labelledby', tabId);
    panel.hidden = idx !== 0;
    if (contentCell) {
      while (contentCell.firstChild) panel.append(contentCell.firstChild);
    }

    tabList.append(tab);
    tabPanels.append(panel);
  });

  tabList.addEventListener('click', (e) => {
    const clicked = e.target.closest('.tabs-tab');
    if (!clicked) return;
    [...tabList.querySelectorAll('.tabs-tab')].forEach((tab, i) => {
      const active = tab === clicked;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tabPanels.children[i].hidden = !active;
    });
  });

  // Keyboard navigation
  tabList.addEventListener('keydown', (e) => {
    const tabs = [...tabList.querySelectorAll('.tabs-tab')];
    const current = tabs.indexOf(document.activeElement);
    if (current === -1) return;
    let next = current;
    if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else return;
    e.preventDefault();
    tabs[next].click();
    tabs[next].focus();
  });

  block.replaceChildren(tabList, tabPanels);
}
