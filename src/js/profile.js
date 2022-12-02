import {getFromStorage, saveToStorage} from "./utils/storage";
import {isImage, validateString} from "./utils/validation";
import {API_BASE_URL, AVATAR_UPDATE, PROFILE_LISTINGS, GET_LISTING_DETAILS} from "./settings/api";
import {showErrorMsg} from "./utils/errorMessages";
import {buttonProcessing} from "./components/loader";
import {getListings} from "./settings/getListings";
import placeHolderImg from "../img/placeholder-image.svg"
import {redirectNoToken} from "./utils/reDirect";

const {name, credits, avatar} = getFromStorage('userKey')
const accessToken = getFromStorage('accessToken')
const avatarImg = document.querySelector('#avatar-img')
const userName = document.querySelector('#user-name')
const availableCredits = document.querySelector('#credits')
const avatarUpdateForm = document.querySelector('#avatar-update')
const avatarUpdate = document.querySelector('#avatar')
const getlistingsOptions = {method: 'GET', headers: {Authorization: `Bearer ${accessToken}`}}
const profileListingsContainer = document.querySelector('#listings-container')
const noListingsElement = document.querySelector('#no-listings')

redirectNoToken()

availableCredits.textContent = credits
userName.textContent = name

if (avatar && isImage(avatar)) {
  avatarImg.style.backgroundImage = `url(${avatar})`
}

avatarUpdateForm.addEventListener('submit', function (event) {
  document.querySelector('#general-error-avatar').classList.add('hidden')
  event.preventDefault()

  if (validateString(avatarUpdate, isImage)) {
    const putData = {
      avatar: avatarUpdate.value
    }
    updateAvatar(API_BASE_URL + AVATAR_UPDATE, putData)
  }
})

document.querySelectorAll('form input').forEach((item) => {
  item.onkeyup = function () {
    this.classList.remove('bg-red-50')
    this.nextElementSibling.classList.add('hidden')
  }
})

function getProfileListings() {
  getListings(API_BASE_URL + PROFILE_LISTINGS, getlistingsOptions)
    .then(response => {
      profileListingsContainer.innerHTML = ''
      noListingsElement.classList.remove('hidden')
      if (response.errors) {
        throw new Error
      } else {
        if (response.length) {
          profileListingsContainer.classList.remove('hidden')
          noListingsElement.classList.add('hidden')

          response.forEach(({id, title, media}) => {
            let isMedia = media[0]
            !isMedia ? isMedia = placeHolderImg : isMedia

            profileListingsContainer.innerHTML +=
              `<div class="flex flex-col gap-4 py-6 px-6 shadow shadow-gray-400 rounded-lg">
                 <div class=" flex flex-row gap-2 justify-between items-center">
                   <h3 class="text-xl font-krub font-semibold">${title}</h3>
                   <button data-id=${id} class="delete-listing bg-red-700 shrink-0 text-white rounded-md py-2 w-20 hover:bg-red-600">Delete</button>
                 </div>
                 <a href="listing-details.html?id=${id}" class="group flex flex-col gap-4">
                   <div class="rounded w-full h-56 bg-cover bg-center bg-no-repeat" style="background-image: url(${isMedia})"></div>
                   <div class="block bg-blue-700 text-white text-center w-full rounded-md py-2 group-hover:bg-blue-600">Details</div>
                 </a>
               </div>`
          })
        }
      }

    })
    .catch(error => {
      noListingsElement.classList.add('hidden')
      showErrorMsg(document.querySelector('#general-error-listings'), `Could not get listings... Please try again later`)
    })
    .finally(item => {
      const deleteListingBtn = document.querySelectorAll('.delete-listing')
      deleteListingBtn.forEach(listing => {
        listing.onclick = function () {
          const listingId = this.dataset.id
          deleteListing(API_BASE_URL + GET_LISTING_DETAILS + listingId)
        }
      })
    })
}

getProfileListings()

async function updateAvatar(url, putData) {
  avatarUpdateForm.querySelector('button').innerHTML = buttonProcessing
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(putData)
    }
    const response = await fetch(url, options)
    const responseJSON = await response.json()

    if (response.ok) {
      const userKey = {
        name: responseJSON.name,
        email: responseJSON.email,
        credits: responseJSON.credits,
        avatar: responseJSON.avatar
      }
      saveToStorage('userKey', userKey)
      location.href = '/profile.html'
    } else if (response.status === 400) {
      showErrorMsg(document.querySelector('#general-error-avatar'), responseJSON.errors[0].message)
    } else {
      showErrorMsg(document.querySelector('#general-error-avatar'))
    }

  } catch (error) {
    showErrorMsg(document.querySelector('#general-error-avatar'))
  } finally {
    avatarUpdateForm.querySelector('button').innerHTML = 'Update Avatar'
  }
}

async function deleteListing(url) {
  try {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const response = await fetch(url, options)
    response.ok ? getProfileListings() : showErrorMsg(document.querySelector('#general-error-listings'))

  } catch (error) {
    showErrorMsg(document.querySelector('#general-error-listings'))
  }
}
