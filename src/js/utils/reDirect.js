function redDirect() {
  if (localStorage.getItem('accessToken')) {
    window.location.replace('/')
  }
}

export {redDirect}
