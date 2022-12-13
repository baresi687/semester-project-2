import { getFromStorage, saveToStorage } from './utils/storage';
import {
  clearFormErrorsOnKeyUp,
  isImage,
  validateString,
} from './utils/validation';
import {
  API_BASE_URL,
  AVATAR_UPDATE,
  PROFILE_LISTINGS,
  GET_PROFILE,
  GET_LISTING_DETAILS,
} from './settings/api';
import { showErrorMsg } from './utils/errorMessages';
import { buttonProcessing, removeLoader } from './components/loader';
import { getListings } from './settings/getListings';
import placeHolderImg from '../img/placeholder-image.svg';
import profileImg from '../img/profile.svg';
import { redirectNoToken } from './utils/reDirect';

const profileSection = document.querySelector('#profile');
const { name } = getFromStorage('userKey');
const accessToken = getFromStorage('accessToken');
const avatarImg = document.querySelector('#avatar-img');
const userName = document.querySelector('#user-name');
const availableCredits = document.querySelector('#credits');
const avatarUpdateForm = document.querySelector('#avatar-update');
const avatarUpdate = document.querySelector('#avatar');
const getlistingsOptions = {
  method: 'GET',
  headers: { Authorization: `Bearer ${accessToken}` },
};
const profileListingsContainer = document.querySelector('#listings-container');
const noListingsElement = document.querySelector('#no-listings');

redirectNoToken();

profileSection.classList.add('hidden');
userName.textContent = name;
getListings(
  API_BASE_URL + GET_PROFILE,
  getlistingsOptions,
  'loader',
  profileSection
)
  .then((response) => {
    if (response.name) {
      const { avatar, credits } = response;
      availableCredits.textContent = credits;
      if (avatar && isImage(avatar)) {
        avatarImg.style.backgroundImage = `url(${avatar})`;
      } else {
        avatarImg.style.backgroundImage = `url(${profileImg})`;
      }
    } else {
      showErrorMsg(
        document.querySelector('#general-error-profile'),
        'Error getting profile information. Please try again later'
      );
    }
  })
  .catch(() => {
    showErrorMsg(document.querySelector('#general-error-profile'));
  })
  .finally(() => {
    profileSection.classList.remove('hidden');
    removeLoader();
  });

avatarUpdateForm.addEventListener('submit', function (event) {
  document.querySelector('#general-error-profile').classList.add('hidden');
  event.preventDefault();

  if (validateString(avatarUpdate, isImage)) {
    const putData = {
      avatar: avatarUpdate.value.trim(),
    };
    updateAvatar(API_BASE_URL + AVATAR_UPDATE, putData);
  }
});

function getProfileListings() {
  getListings(API_BASE_URL + PROFILE_LISTINGS, getlistingsOptions)
    .then((response) => {
      profileListingsContainer.innerHTML = '';
      noListingsElement.classList.remove('hidden');
      if (response.errors) {
        throw new Error();
      } else {
        if (response.length) {
          profileListingsContainer.classList.remove('hidden');
          noListingsElement.classList.add('hidden');

          response.forEach(({ id, title, media }) => {
            let isMedia = media[0];
            let isTitle = title.replace(/</g, '&lt');
            !isMedia ? (isMedia = placeHolderImg) : isMedia;

            profileListingsContainer.innerHTML += `<div class="flex flex-col gap-4 py-6 px-6 shadow shadow-gray-400 rounded-lg">
                 <div class=" flex flex-row gap-2 justify-between items-center">
                   <h3 class="text-xl font-krub font-semibold capitalize">${isTitle}</h3>
                   <button data-id=${id} class="delete-listing bg-red-700 shrink-0 text-white rounded-md py-2 w-20 hover:bg-red-600">Delete</button>
                 </div>
                 <a href="listing-details.html?id=${id}" class="group flex flex-col gap-4">
                   <div class="rounded w-full h-64 bg-cover bg-center" style="background-image: url(${isMedia})"></div>
                   <div class="block bg-blue-700 text-white text-center w-full rounded-md py-2 group-hover:bg-blue-600">Details</div>
                 </a>
               </div>`;
          });
        }
      }
    })
    .catch(() => {
      noListingsElement.classList.add('hidden');
      showErrorMsg(
        document.querySelector('#general-error-listings'),
        `Could not get listings... Please try again later`
      );
    })
    .finally(() => {
      const deleteListingBtn = document.querySelectorAll('.delete-listing');
      deleteListingBtn.forEach((listing) => {
        listing.onclick = function () {
          const listingId = this.dataset.id;
          deleteListing(API_BASE_URL + GET_LISTING_DETAILS + listingId);
        };
      });
    });
}

getProfileListings();

async function updateAvatar(url, putData) {
  avatarUpdateForm.querySelector('button').innerHTML = buttonProcessing;
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(putData),
    };
    const response = await fetch(url, options);
    const responseJSON = await response.json();

    if (response.ok) {
      const userKey = {
        name: responseJSON.name,
        email: responseJSON.email,
        credits: responseJSON.credits,
        avatar: responseJSON.avatar,
      };
      saveToStorage('userKey', userKey);
      location.href = '/profile.html';
    } else if (response.status === 400) {
      showErrorMsg(
        document.querySelector('#general-error-profile'),
        responseJSON.errors[0].message
      );
    } else {
      showErrorMsg(document.querySelector('#general-error-profile'));
    }
  } catch (error) {
    showErrorMsg(document.querySelector('#general-error-profile'));
  } finally {
    avatarUpdateForm.querySelector('button').innerHTML = 'Update Avatar';
  }
}

async function deleteListing(url) {
  try {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await fetch(url, options);
    response.ok
      ? getProfileListings()
      : showErrorMsg(document.querySelector('#general-error-listings'));
  } catch (error) {
    showErrorMsg(document.querySelector('#general-error-listings'));
  }
}

clearFormErrorsOnKeyUp('form input', '#general-error-profile');
