import {validateString, checkLength, checkEmail} from "./utils/validation";
import {API_BASE_URL, SIGN_IN} from "./settings/api";
import {showErrorMsg} from "./utils/errorMessages";
import {buttonProcessing} from "./components/loader";

const signInForm = document.querySelector('#sign-in')
const email = document.querySelector('#email')
const password = document.querySelector('#password')

signInForm.addEventListener('submit', function (event) {
  event.preventDefault()
  document.querySelector('#general-error').classList.add('hidden')

  const isFormValid =
    validateString(email, checkEmail) &&
    validateString(password, checkLength, 8);

  if (isFormValid) {
    const formData = {
      email: email.value,
      password: password.value
    }
    signIn(API_BASE_URL + SIGN_IN, formData)
  }
})

async function signIn(url, postData) {
  signInForm.querySelector('button').innerHTML = buttonProcessing
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    }
    const response = await fetch(url, options)
    const responseJSON = await response.json()

    if (response.ok) {
      console.log(response)
      console.log(responseJSON)
    } else {
      showErrorMsg(document.querySelector('#general-error'), responseJSON.errors[0].message)
      signInForm.querySelector('button').innerHTML = 'Sign In'
    }

  } catch (error) {
    showErrorMsg(document.querySelector('#general-error'))
  }
}

document.querySelectorAll('form input').forEach((item) => {
  item.onkeyup = function () {
    this.classList.remove('bg-red-50')
    this.nextElementSibling.classList.add('hidden')
  }
})