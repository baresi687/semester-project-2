import { getFromStorage, saveToStorage } from './utils/storage';
import { clearFormErrorsOnKeyUp, isImage, validateString } from './utils/validation';
import { API_BASE_URL, AVATAR_UPDATE, PROFILE_LISTINGS, GET_PROFILE, GET_LISTING_DETAILS } from './settings/api';
import { showErrorMsg } from './utils/errorMessages';
import { buttonProcessing, removeLoader } from './components/loader';
import { getListings as getProfileListingsAndUpdate } from './settings/getListings';
import placeHolderImg from '../img/placeholder-image.svg';
import profileImg from '../img/profile.svg';
import { redirectNoToken } from './utils/reDirect';
import { createImginput } from './components/createImgInput';

const profileSection = document.querySelector('#profile');
const { name } = getFromStorage('userKey');
const accessToken = getFromStorage('accessToken');
let avatarImgSrc;
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
const editListingModal = document.querySelector('#modal');
const editListingForm = document.querySelector('#edit-listing-form');
const editListingTitle = document.querySelector('#item-title');
const editListingDesc = document.querySelector('#item-description');
const editListingImg = document.querySelector('#item-img-1');
let editlistingId = '';
let editImgArr = '';
const mainEditImgContainer = document.querySelector('#main-img');
const addImgInput = document.querySelector('#add-img');

redirectNoToken();

userName.textContent = name;

getProfileListingsAndUpdate(API_BASE_URL + GET_PROFILE, getlistingsOptions, 'loader', profileSection)
  .then((response) => {
    if (response.name) {
      const { avatar, credits } = response;
      availableCredits.textContent = credits;
      avatar && isImage(avatar) ? (avatarImgSrc = avatar) : (avatarImgSrc = profileImg);
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
    profileSection
      .querySelector('#profile-info')
      .insertAdjacentHTML(
        'afterbegin',
        `<img src="${avatarImgSrc}" alt="${name}" id="avatar-img" class="object-cover m-auto w-40 h-40 rounded-full"/>`
      );
    profileSection.classList.remove('hidden');
    document.querySelector('main').classList.remove('min-h-screen');
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
  getProfileListingsAndUpdate(API_BASE_URL + PROFILE_LISTINGS, getlistingsOptions)
    .then((response) => {
      profileListingsContainer.innerHTML = '';
      noListingsElement.classList.remove('hidden');
      if (response.errors) {
        throw new Error();
      } else {
        if (response.length) {
          profileListingsContainer.classList.remove('hidden');
          noListingsElement.classList.add('hidden');
          editListingModal.classList.remove('hidden');

          response.forEach(({ id, title, media, description }) => {
            const forEditListing = [];
            let isMedia = media[0];
            const isTitle = title.replace(/</g, '&lt');
            media.forEach((item) => forEditListing.push(item.toString()));
            !isMedia ? (isMedia = placeHolderImg) : isMedia;

            profileListingsContainer.innerHTML += `<div class="flex flex-col gap-4 py-6 px-6 shadow shadow-gray-400 rounded-lg">
                                                     <div class="flex flex-row gap-2 justify-between items-center h-18">
                                                       <h3 class="overflow-hidden whitespace-nowrap text-ellipsis text-xl font-archivo font-medium capitalize">${isTitle}</h3>
                                                       <div class="flex flex-row gap-2">
                                                         <button data-id=${id} class="delete-listing bg-red-700 shrink-0 text-white rounded py-1 w-16 text-sm hover:bg-red-600">Delete</button>
                                                         <button data-id=${id} data-title="${title}" data-description="${description}" data-media="${forEditListing}" class="edit-listing bg-amber-400 shrink-0 rounded py-1 w-16 text-sm text-gray-900 hover:brightness-110">Edit</button> 
                                                       </div>
                                                     </div>
                                                     <a href="listing-details.html?id=${id}" class="group flex flex-col gap-4">
                                                       <img src="${isMedia}" alt="${isTitle}" class="object-cover h-56 rounded sm:h-64 lg:h-72">
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
      const editListingBtn = document.querySelectorAll('.edit-listing');
      editListingBtn.forEach((listing) => {
        listing.onclick = function () {
          document.querySelectorAll('.opt-img').forEach((item) => {
            item.remove();
          });
          document.querySelector('#general-error-edit-listing').classList.add('hidden');
          editlistingId = this.dataset.id;
          editImgArr = this.dataset.media.split(',');
          editListingTitle.value = this.dataset.title;
          editListingDesc.value = this.dataset.description;
          editListingDesc.value = editListingDesc.value.charAt(0).toUpperCase() + editListingDesc.value.slice(1);
          editListingImg.value = editImgArr[0];

          if (editImgArr.length) {
            for (let i = 1; i < editImgArr.length; i++) {
              createImginput(
                mainEditImgContainer,
                '#edit-listing-container form .input-val',
                '#general-error-edit-listing'
              );
              document.querySelector(`#item-img-${i + 1}`).value = editImgArr[i];
            }
          }
          editListingModal.classList.remove('invisible', 'opacity-0');
        };
      });

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

editListingForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const isImageValid = validateString(editListingImg, isImage);
  const optionalImg = document.querySelectorAll('.optional-img');
  const optionalImgBool = [];

  if (optionalImg.length) {
    for (let i = 0; i < optionalImg.length; i++) {
      optionalImgBool.push(!optionalImg[i].value || validateString(optionalImg[i], isImage));
    }
  }

  if (isImageValid && optionalImgBool.every((item) => item)) {
    editListingForm.querySelector('button').innerHTML = buttonProcessing;

    const putData = {
      title: editListingTitle.value.trim(),
      description: editListingDesc.value.trim(),
      media: [editListingImg.value.trim()],
    };
    optionalImg.forEach((item) => {
      item.value ? putData.media.push(item.value.trim()) : null;
    });

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(putData),
    };

    getProfileListingsAndUpdate(API_BASE_URL + GET_LISTING_DETAILS + editlistingId, options)
      .then((response) => {
        if (response.id) {
          editListingModal.classList.add('invisible', 'opacity-0');
          getProfileListings();
        }
        if (response.statusCode === 400) {
          showErrorMsg(document.querySelector('#general-error-edit-listing'), response.errors[0].message);
        } else if (response.statusCode === 404) {
          showErrorMsg(document.querySelector('#general-error-edit-listing'));
        }
      })
      .catch(() => {
        showErrorMsg(document.querySelector('#general-error-edit-listing'));
      })
      .finally(() => {
        editListingForm.querySelector('button').innerHTML = 'Edit Listing';
      });
  }
});

editListingModal.querySelector('#close-edit-modal').onclick = function () {
  editListingModal.classList.add('invisible', 'opacity-0');
};

addImgInput.onclick = function () {
  createImginput(mainEditImgContainer, '#edit-listing-container form .input-val', '#general-error-edit-listing');
};

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
      location.reload();
    } else if (response.status === 400) {
      showErrorMsg(document.querySelector('#general-error-profile'), responseJSON.errors[0].message);
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
    response.ok ? getProfileListings() : showErrorMsg(document.querySelector('#general-error-listings'));
  } catch (error) {
    showErrorMsg(document.querySelector('#general-error-listings'));
  }
}

clearFormErrorsOnKeyUp('#avatar-update-container form input', '#general-error-profile');
clearFormErrorsOnKeyUp('#edit-listing-container form .input-val', '#general-error-edit-listing');
