const username = sessionStorage.getItem("username");
const role = sessionStorage.getItem("role");

if (username && role) {
  if (role === "admin") {
    window.location.href = "dashboard-admin.html"; //dahboard-admin
  } else {
    window.location.href = "dashboard-agent.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const username = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const errorMessage = document.getElementById("error-message");

    const { data, error } = await supabase
      .from("user")
      .select(
        " role,email, full_name,profile_image_url, phone_number,bio, company_name, company_ssm, agent_remark, agent_status"
      )
      .eq("username", username)
      .eq("password", password) // ❗ Do not store plain text passwords in production!
      .single();

    if (error || !data) {
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";
      // Save to sessionStorage
      const loginDetail = {
        username: data.username,
        role: data.role,
        email: data.email,
        full_name: data.full_name,
        profile_image_url: data.profile_image_url,
        phone_number: data.phone_number,
        bio: data.bio,
        company_name: data.company_name,
        company_id: data.company_ssm,
        agent_remark: data.agent_remark,
        agent_status: data.agent_status,
      };

      sessionStorage.setItem("loginDetail", JSON.stringify(loginDetail));

      // Redirect based on role
      if (data.role === "admin") {
        window.location.href = "dashboard-admin.html";
      } else {
        window.location.href = "dashboard-agent.html"; // or any default user page
      }
    }
  });
});
