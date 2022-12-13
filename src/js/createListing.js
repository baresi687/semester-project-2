import {
  API_BASE_URL,
  GET_LISTING_DETAILS as POST_LISTING,
} from './settings/api';
import {
  clearFormErrorsOnKeyUp,
  isImage,
  validateString,
} from './utils/validation';
import { getListings as createListing } from './settings/getListings';
import { getFromStorage } from './utils/storage';
import { DateTime } from 'luxon';
import { showErrorMsg } from './utils/errorMessages';
import { buttonProcessing } from './components/loader';
import { redirectNoToken } from './utils/reDirect';

const createListingForm = document.querySelector('#create-listing-form');
const listingImgOne = document.querySelector('#item-img-1');
const listingDatePicker = document.querySelector('#item-ends-date');
const accessToken = getFromStorage('accessToken');
const now = DateTime.now().toISO();

redirectNoToken();

listingDatePicker.value = now.slice(0, -13);
listingDatePicker.min = now.slice(0, -13);

createListingForm.addEventListener('submit', function (event) {
  event.preventDefault();

  let isImageValid = validateString(listingImgOne, isImage);
  let optionalImgValid = true;
  const optionalImg = document.querySelectorAll('.optional-img');

  if (optionalImg.length) {
    for (let i = 0; i < optionalImg.length; i++) {
      optionalImgValid =
        !optionalImg[i].value || validateString(optionalImg[i], isImage);
    }
  }

  if (isImageValid && optionalImgValid) {
    createListingForm.querySelector('button').innerHTML = buttonProcessing;
    const dateValue = DateTime.fromISO(listingDatePicker.value)
      .minus({ hour: 1 })
      .toISO()
      .slice(0, -13);
    const postData = {
      title: document.querySelector('#item-title').value.trim(),
      description: document.querySelector('#item-description').value.trim(),
      media: [listingImgOne.value.trim()],
      endsAt: dateValue,
    };
    optionalImg.forEach((item) => {
      item.value ? postData.media.push(item.value.trim()) : null;
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    };

    createListing(API_BASE_URL + POST_LISTING, options)
      .then((response) => {
        if (response.id) {
          location.href = `listing-details.html?id=${response.id}`;
        }
        if (response.statusCode === 400) {
          showErrorMsg(
            document.querySelector('#general-error'),
            response.errors[0].message
          );
        } else if (response.statusCode === 404) {
          showErrorMsg(document.querySelector('#general-error'));
        }
      })
      .catch(() => {
        showErrorMsg(document.querySelector('#general-error'));
      })
      .finally(() => {
        createListingForm.querySelector('button').innerHTML = 'Create Listing';
      });
  }
});

const mainImgContainer = document.querySelector('#main-img');
const addImgInput = document.querySelector('#add-img');
addImgInput.onclick = function () {
  createImginput();
};

function createImginput() {
  const imageInputs = document.querySelectorAll('.input-val');
  const imageId = imageInputs.length + 1;
  if (imageInputs.length < 5) {
    let divContainer = document.createElement('div');
    divContainer.classList.add('flex', 'flex-col', 'gap-2');

    let labelImg = document.createElement('label');
    labelImg.setAttribute('for', `item-img-${imageId}`);
    labelImg.classList.add('flex', 'flex-row', 'flex-wrap', 'gap-2');

    let spanRemove = document.createElement('span');
    spanRemove.classList.add(
      'remove-input',
      'order-2',
      'flex',
      'items-center',
      'justify-center',
      'w-8',
      'h-8',
      'bg-amber-400',
      'text-xl',
      'cursor-pointer',
      'rounded'
    );
    spanRemove.innerHTML = '<span>-</span>';

    let inputImg = document.createElement('input');
    inputImg.id = `item-img-${imageId}`;
    inputImg.setAttribute('type', 'text');
    inputImg.setAttribute('placeholder', 'Image URL');
    inputImg.classList.add(
      'optional-img',
      'input-val',
      'bg-zinc-100',
      'rounded',
      'indent-2.5',
      'h-8',
      'order-1',
      'flex-1',
      'w-full'
    );

    let inputError = document.createElement('span');
    inputError.classList.add(
      'hidden',
      'order-3',
      'validation-error',
      'text-rose-700',
      'py-1.5'
    );
    inputError.textContent =
      'Image URL must have an image ending (eg .jpg .gif .png etc)';

    labelImg.append(spanRemove, inputImg, inputError);

    divContainer.append(labelImg);

    mainImgContainer.insertAdjacentElement('afterend', divContainer);
  }
  document.querySelectorAll('.remove-input').forEach((item) => {
    item.onclick = function () {
      removeImgInput(this.parentNode.parentElement);
    };
  });
  clearFormErrorsOnKeyUp('form .input-val', '#general-error');
}

function removeImgInput(elem) {
  elem.remove();
}

clearFormErrorsOnKeyUp('form .input-val', '#general-error');
