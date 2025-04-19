const username = sessionStorage.getItem("username");
const role = sessionStorage.getItem("role");

if (username && role) {
  if (role === "admin") {
    window.location.href = "dashboard.html";
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
      .from("users")
      .select("id, role")
      .eq("username", username)
      .eq("password", password) // ❗ Do not store plain text passwords in production!
      .single();

    if (error || !data) {
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";
      // Save to sessionStorage
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("role", data.role);

      // Redirect based on role
      if (data.role === "admin") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "agent/dashboard-agent.html"; // or any default user page
      }
    }
  });
});
