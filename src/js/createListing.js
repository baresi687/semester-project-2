import {API_BASE_URL, GET_LISTING_DETAILS as POST_LISTING} from "./settings/api";
import {isImage, validateString} from "./utils/validation";
import {getListings as createListing} from "./settings/getListings";
import {getFromStorage} from "./utils/storage";
import {DateTime} from "luxon";

const createListingForm = document.querySelector('#create-listing-form')
const listingImgOne = document.querySelector('#item-img-1')
const listingImgTwo = document.querySelector('#item-img-2')
const listingImgThree = document.querySelector('#item-img-3')
const listingDatePicker = document.querySelector('#item-ends-date')
const accessToken = getFromStorage('accessToken')
const now = DateTime.now().toISO()

listingDatePicker.value = now.slice(0, -13)
listingDatePicker.min = now.slice(0, -13)

createListingForm.addEventListener('submit', function (event) {
  event.preventDefault()
  const isFormValid =
    validateString(listingImgOne, isImage) &&
    ((!listingImgTwo.value) || validateString(listingImgTwo, isImage)) &&
    ((!listingImgThree.value) || validateString(listingImgThree, isImage))

  if (isFormValid) {
    const postData = {
      title: document.querySelector('#item-title').value.trim(),
      description: document.querySelector('#item-description').value.trim(),
      media: [listingImgOne.value],
      endsAt: listingDatePicker.value
    }
    document.querySelectorAll('.optional-img').forEach(item => {
      item.value ? postData.media.push(item.value) : null
    })
    console.log(postData)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(postData)
    }
    createListing(API_BASE_URL+POST_LISTING, options)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }
})

document.querySelectorAll('form .input-val').forEach((item) => {
  item.onkeyup = function () {
    this.classList.remove('bg-red-50')
    this.nextElementSibling.classList.add('hidden')
  }
})
