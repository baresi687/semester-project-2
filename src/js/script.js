import "../css/style.css";
import openMenu from "../img/hamburger-menu.svg"
import closeMenu from "../img/close-hamburger-menu.svg"
import {createNavHeaderBar} from "./components/createNavHeaderBar";

const hamburgerBtn = document.querySelector('#hamburger-btn')
const hamburgerMenu = document.querySelector('#hamburger-menu')
const searchInput = document.querySelector('#search')
const searchBtn = document.querySelector('#search-btn')

hamburgerBtn.onclick = function () {
  hamburgerMenu.classList.toggle('-translate-x-0')
  if (hamburgerMenu.classList.contains('-translate-x-0')) {
    hamburgerBtn.querySelector('img').src = closeMenu
  } else {
    hamburgerBtn.querySelector('img').src = openMenu
  }
}

window.addEventListener('click', function (event) {
  if (event.target.parentElement !== document.querySelector('#menu') &&
    event.target !== hamburgerBtn.querySelector('img') &&
    hamburgerMenu.classList.contains('-translate-x-0')) {
    hamburgerMenu.classList.remove('-translate-x-0')
    hamburgerBtn.querySelector('img').src = openMenu
  }
})

createNavHeaderBar()

searchBtn.addEventListener('click', function () {
  if (searchInput.value.trim()) {
    location.href = `../search-listings.html?search=${searchInput.value}`
  }
})

searchInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && searchInput.value.trim()) {
    location.href = `../search-listings.html?search=${searchInput.value}`
  }
})
