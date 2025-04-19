document.getElementById("signOutBtn").addEventListener("click", () => {
  // Clear session
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("role");

  // Optional: redirect to login page
  window.location.href = "sign-in.html";
});
