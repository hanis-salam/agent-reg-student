// Retrieve and populate
const storedLoginDetail = JSON.parse(sessionStorage.getItem("loginDetail"));

if (storedLoginDetail) {
  const fileInputprofile = document.getElementById("profile_image_url");
  const fileprofile = fileInput8.files[0];

  let base64Image = "";
  if (fileprofile) {
    base64Image = await toBase64(file8);
    document.getElementById("fullName").innerText = storedLoginDetail.full_name;
    document.getElementById("email").innerText = storedLoginDetail.email;
    document.getElementById("company").innerText =
      storedLoginDetail.company_name;
    document.getElementById("companyid").innerText =
      storedLoginDetail.company_SSM;
    document.getElementById("role").innerText = storedLoginDetail.role;
    document.getElementById("bio").innerText = storedLoginDetail.bio;
  }
}
