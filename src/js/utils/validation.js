function validateString(elem, callBack, length) {
  if (!callBack(elem, length)) {
    elem.classList.add('bg-red-50')
    elem.nextElementSibling.classList.remove('hidden')
    return false
  } else {
    return true
  }
}

function checkName(elem) {
  const regex = /^\w+$/
  return regex.test(elem.value.trim())
}

function checkEmail(elem) {
  const regex = /^[\w\-.]+@stud.noroff.no$/
  return regex.test(elem.value.trim())
}

function checkLength(elem, length) {
  return elem.value.trim().length >= length
}

function checkConfirmPassword(elem, password) {
  return elem.value.trim() === password.value.trim();
}

function isImage(url) {
  const imgRegex = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/
  if (typeof url === 'object') {
    return imgRegex.test(url.value.trim())
  } else {
    return imgRegex.test(url.trim());
  }
}

function clearFormErrorsOnKeyUp(inPutElems, apiError) {
  document.querySelectorAll(inPutElems).forEach((item) => {
    item.onkeyup = function () {
      this.classList.remove('bg-red-50')
      this.nextElementSibling.classList.add('hidden')
      document.querySelector(apiError).classList.add('hidden')
    }
  })
}

export {validateString, checkName, checkEmail, checkLength, checkConfirmPassword, isImage, clearFormErrorsOnKeyUp}
