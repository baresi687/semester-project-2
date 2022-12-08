import {
  validateString,
  checkName,
  checkEmail,
  checkLength,
  checkConfirmPassword,
  clearFormErrorsOnKeyUp
} from "./utils/validation";
import {API_BASE_URL, SIGN_UP} from "./settings/api";
import {showErrorMsg} from "./utils/errorMessages";
import {buttonProcessing} from "./components/loader";
import {redDirect} from "./utils/reDirect";

const signUpForm = document.querySelector('#sign-up-form')
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const confirmPassword = document.querySelector('#confirm-password')

redDirect()
signUpForm.addEventListener('submit', function (event) {
  event.preventDefault()
  document.querySelector('#general-error').classList.add('hidden')

  const isFormValid =
    validateString(name, checkName) &&
    validateString(email, checkEmail) &&
    validateString(password, checkLength, 8) &&
    validateString(confirmPassword, checkConfirmPassword, password);

  if (isFormValid) {
    const formData = {
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value.trim()
    }
    signUp(API_BASE_URL + SIGN_UP, formData)
  }
})

async function signUp(url, postData) {
  signUpForm.querySelector('button').innerHTML = buttonProcessing
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
      location.href = '../sign-in.html'
    } else {
      showErrorMsg(document.querySelector('#general-error'), responseJSON.errors[0].message)
      signUpForm.querySelector('button').innerHTML = 'Sign Up'
    }

  } catch (error) {
    showErrorMsg(document.querySelector('#general-error'))
  }
}

clearFormErrorsOnKeyUp('form input', '#general-error')
