// Retrieve and populate
const storedLoginDetail = JSON.parse(sessionStorage.getItem("loginDetail"));

if (storedLoginDetail) {
  document.getElementById("fullName").innerText = storedLoginDetail.full_name;
  document.getElementById("email").innerText = storedLoginDetail.email;
  document.getElementById("company").innerText = storedLoginDetail.company_name;
  document.getElementById("companyid").innerText =
    storedLoginDetail.company_SSM;
  document.getElementById("role").innerText = storedLoginDetail.role;
  document.getElementById("bio").innerText = storedLoginDetail.bio;
}
