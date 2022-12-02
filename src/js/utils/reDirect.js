function redDirect() {
  if (localStorage.getItem('accessToken')) {
    window.location.replace('/')
  }
}

function redirectNoToken() {
  if (!localStorage.getItem('accessToken')) {
    window.location.replace('/sign-in.html')
  }
}

export {redDirect, redirectNoToken}
