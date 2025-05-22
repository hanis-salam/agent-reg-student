function signout() {
  // Clear session
  sessionStorage.removeItem("loginDetail");

  // Optional: redirect to login page
  window.location.href = "/pages/sign-in.html";
}
