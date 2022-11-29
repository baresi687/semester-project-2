import {validateString, checkName, checkEmail, checkLength, checkConfirmPassword} from "./utils/validation";
import {API_BASE_URL, SIGN_UP} from "./settings/api";
import {showErrorMsg} from "./utils/errorMessages";

const signUpForm = document.querySelector('#sign-up')
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const confirmPassword = document.querySelector('#confirm-password')

signUpForm.addEventListener('submit', function (event) {
  event.preventDefault()
  const isFormValid =
    validateString(name, checkName) &&
    validateString(email, checkEmail) &&
    validateString(password, checkLength, 8) &&
    validateString(confirmPassword, checkConfirmPassword, password);

  if (isFormValid) {
    const formData = {
      name: name.value,
      email: email.value,
      password: password.value
    }
    signUp(API_BASE_URL + SIGN_UP, formData)
  }
})

async function signUp(url, postData) {
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
      /*location.href = '../sign-in.html'*/
      console.log('User created')
    } else {
      showErrorMsg(document.querySelector('#general-error'), responseJSON.errors[0].message)
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
