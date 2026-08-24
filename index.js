/* Main JS */

const hamMenu = document.querySelector('.header__ham-menu');
const smMenu = document.querySelector('.header__sm-menu');
const hamMenuIcon = document.querySelector('.header__ham-menu-icon');
const hamMenuClose = document.querySelector('.header__ham-menu-close');

if (hamMenu) {
  hamMenu.addEventListener('click', () => {
    if (smMenu.classList.contains('active')) {
      smMenu.classList.remove('active');
      hamMenuIcon.classList.remove('d-none');
      hamMenuClose.classList.add('d-none');
    } else {
      smMenu.classList.add('active');
      hamMenuIcon.classList.add('d-none');
      hamMenuClose.classList.remove('d-none');
    }
  });

  // Close menu when clicking a link
  const smLinks = document.querySelectorAll('.header__sm-menu-link a');
  smLinks.forEach(link => {
    link.addEventListener('click', () => {
      smMenu.classList.remove('active');
      hamMenuIcon.classList.remove('d-none');
      hamMenuClose.classList.add('d-none');
    });
  });
}
