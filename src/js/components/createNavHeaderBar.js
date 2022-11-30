import profileImgWhite from '../../img/profile-white.svg'
import {getFromStorage} from "../utils/storage";
import {isImage} from "../utils/validation";

export function createNavHeaderBar() {
  const navItems = document.querySelector('#menu')
  const searchProfileContainer = document.querySelector('#search-profile-container')
  const userKey = getFromStorage('userKey')
  const userName = userKey.name

  let userAvatar = userKey.avatar
  if (!userAvatar || !isImage(userAvatar)) {
    userAvatar = profileImgWhite
  }

  const profileIcon =
    `<a href="profile.html" title="Profile" class="sm:flex flex-row items-center gap-3 sm:order-2">
       <span class="hidden sm:block text-white">${userName}</span>
       <div class="h-8 w-8 rounded-full mr-3 bg-center bg-cover" style="background-image: url(${userAvatar})"></div>
     </a>`

  const navItemsSignedIn =
    `<li class="border-b border-slate-700 mb-8 pb-4 hover:text-amber-300 sm:border-0 sm:p-0 sm:m-0 text-amber-400">
       <a href="create-listing.html" class="block">Create Listing</a>
     </li>
     <li id="sign-out" class="border-b border-slate-700 pb-4 hover:text-slate-300 sm:border-0 sm:p-0">
       <a href="/" class="block">Sign Out</a>
     </li>`

  const navItemsNotSignedIn =
    `<li class="mt-8 font-medium sm:hidden">
       <a href="sign-up.html" class="block bg-amber-400 text-black text-center w-full rounded-md py-2 hover:brightness-110">Sign Up</a>
     </li>
     <li class="mt-8 font-medium sm:hidden">
       <a href="sign-in.html" class="block bg-blue-700 text-white text-center w-full rounded-md py-2 hover:bg-blue-600">Sign In</a>
     </li>`

  if (localStorage.getItem('accessToken')) {
    navItems.innerHTML += navItemsSignedIn
    searchProfileContainer.insertAdjacentHTML('afterbegin', profileIcon)
    document.querySelector('#sign-up-log-in-desktop').style.display = 'none'
  } else {
    navItems.innerHTML += navItemsNotSignedIn
  }
}
