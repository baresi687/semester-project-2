import {getFromStorage, saveToStorage} from "./utils/storage";
import {isImage, validateString} from "./utils/validation";
import {API_BASE_URL, AVATAR_UPDATE} from "./settings/api";
import {showErrorMsg} from "./utils/errorMessages";
import {buttonProcessing} from "./components/loader";

const {name, credits, avatar} = getFromStorage('userKey')
const accessToken = getFromStorage('accessToken')
const avatarImg = document.querySelector('#avatar-img')
const userName = document.querySelector('#user-name')
const availableCredits = document.querySelector('#credits')
const avatarUpdateForm = document.querySelector('#avatar-update')
const avatarUpdate = document.querySelector('#avatar')

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
    updateAvatar(API_BASE_URL+AVATAR_UPDATE, putData )
  }
})

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
    } else {
      avatarUpdateForm.querySelector('button').innerHTML = 'Update Avatar'
      showErrorMsg(document.querySelector('#general-error-avatar'), responseJSON.errors[0].message)
    }
  } catch (error) {
    showErrorMsg(document.querySelector('#general-error-avatar'))
  }
}

document.querySelectorAll('form input').forEach((item) => {
  item.onkeyup = function () {
    this.classList.remove('bg-red-50')
    this.nextElementSibling.classList.add('hidden')
  }
})


