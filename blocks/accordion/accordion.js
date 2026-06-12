export default function decorate(block) {
  [...block.children].forEach((row) => {
    const heading = row.children[0];
    const body = row.children[1];

    if (heading && body) {
      heading.classList.add('accordion-heading');
      body.classList.add('accordion-body');
      body.style.display = 'none';

      heading.addEventListener('click', () => {
        const isOpen = row.classList.contains('active');
        // Close all
        block.querySelectorAll('.active').forEach((open) => {
          open.classList.remove('active');
          open.querySelector('.accordion-body').style.display = 'none';
        });
        // Toggle current
        if (!isOpen) {
          row.classList.add('active');
          body.style.display = 'block';
        }
      });
    }
  });
}
