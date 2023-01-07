import '../css/style.css';
import { createNavHeaderBar } from './components/createNavHeaderBar';
import { clearStorage } from './utils/storage';

const hamburgerBtn = document.querySelector('#hamburger-btn');
const hamburgerMenu = document.querySelector('#hamburger-menu');
const searchInput = document.querySelector('#search');
const searchBtn = document.querySelector('#search-btn');

createNavHeaderBar();

window.addEventListener('click', function (event) {
  if (
    event.target.closest('#hamburger-btn') &&
    !hamburgerMenu.classList.contains('-translate-x-0')
  ) {
    hamburgerMenu.classList.toggle('-translate-x-0');
    hamburgerBtn.querySelector('svg').classList.toggle('rotate-90');
    hamburgerBtn
      .querySelector('path')
      .setAttribute(
        'd',
        'M24 2.41714L21.5829 0L12 9.58286L2.41714 0L0 2.41714L9.58286 12L0 21.5829L2.41714 24L12 14.4171L21.5829 24L24 21.5829L14.4171 12L24 2.41714Z'
      );
  } else if (
    hamburgerMenu.classList.contains('-translate-x-0') &&
    !event.target.closest('#menu')
  ) {
    hamburgerMenu.classList.remove('-translate-x-0');
    hamburgerBtn.querySelector('svg').classList.remove('rotate-90');
    hamburgerBtn
      .querySelector('path')
      .setAttribute(
        'd',
        'M0 24.35H24V20.35H0V24.35ZM0 14.35H24V10.35H0V14.35ZM0 0.349976V4.34998H24V0.349976H0Z'
      );
  }
});
searchBtn.addEventListener('click', function () {
  if (searchInput.value.trim()) {
    location.href = `../search-listings.html?search=${searchInput.value}`;
  }
});

searchInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && searchInput.value.trim()) {
    location.href = `../search-listings.html?search=${searchInput.value}`;
  }
});

if (document.querySelector('#sign-out')) {
  const signOut = document.querySelector('#sign-out');
  signOut.onclick = function (event) {
    event.preventDefault();
    clearStorage();
  };
}

let prevScrollPos = window.scrollY;

window.addEventListener('scroll', function () {
  let currScrollPos = window.scrollY;
  if (currScrollPos > prevScrollPos) {
    document.querySelector('header').style.top = '-100%';
  } else {
    document.querySelector('header').style.top = '0';
  }
  prevScrollPos = currScrollPos;
});
