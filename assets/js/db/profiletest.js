const supabase = window.supabase;

async function fetchApplicationStudent(userId) {
  try {
    const { data, error } = await supabase
      .from("user")
      .select(
        `
        profile_image_url, full_name, username, email,
        company_name, company_ssm, agent_status,
        agent_remark, bio, role
      `
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user data:", error.message);
      return;
    }

    if (!data) {
      console.warn("No user data found.");
      return;
    }

    console.log("Fetched user data:", data);

    sessionStorage.setItem("loginDetail", JSON.stringify(data));
    loadUserProfile();
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

async function loadUserProfile() {
  let storedLoginDetail;
  try {
    storedLoginDetail = JSON.parse(sessionStorage.getItem("loginDetail"));
  } catch (e) {
    console.error("Invalid JSON in sessionStorage:", e);
    sessionStorage.removeItem("loginDetail");
    return;
  }

  if (!storedLoginDetail) {
    console.error("Login detail missing");
    return;
  }

  console.log("Loading user profile data:", storedLoginDetail);

  document.getElementById("fullName").innerText =
    storedLoginDetail.full_name || "-";
  document.getElementById("email").innerText = storedLoginDetail.email || "-";
  document.getElementById("username").innerText =
    storedLoginDetail.username || "-";
  document.getElementById("company").innerText =
    storedLoginDetail.company_name || "-";
  document.getElementById("companyId").innerText =
    storedLoginDetail.company_ssm || "-";
  document.getElementById("agent_status").innerText =
    storedLoginDetail.agent_status || "-";
  document.getElementById("agent_remark").innerText =
    storedLoginDetail.agent_remark || "-";
  document.getElementById("role").innerText = storedLoginDetail.role || "-";
  document.getElementById("bio").innerText = storedLoginDetail.bio || "-";

  const profilePic = document.getElementById("profilePic");

  if (storedLoginDetail.profile_image_url) {
    if (
      storedLoginDetail.profile_image_url.startsWith("data:image") ||
      storedLoginDetail.profile_image_url.startsWith("http")
    ) {
      profilePic.src = storedLoginDetail.profile_image_url;
    } else {
      const { data: imageData, error: imageError } = supabase.storage
        .from("user") // ✅ Adjust bucket name if different
        .getPublicUrl(storedLoginDetail.profile_image_url);

      if (!imageError && imageData?.publicUrl) {
        profilePic.src = imageData.publicUrl;
      } else {
        console.error("Error fetching image from storage:", imageError);
        profilePic.src = "/assets/default-profile.png";
      }
    }
  } else {
    profilePic.src = "/assets/default-profile.png";
  }
}

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting auth user:", error.message);
    return null;
  }
  return data?.user?.id || null;
}

document.addEventListener("DOMContentLoaded", async () => {
  let storedLogin = null;
  try {
    storedLogin = JSON.parse(sessionStorage.getItem("loginDetail"));
  } catch (e) {
    sessionStorage.removeItem("loginDetail");
  }

  if (storedLogin) {
    loadUserProfile();
  } else {
    const userId = await getCurrentUserId();
    if (userId) {
      fetchApplicationStudent(userId);
    } else {
      console.error("No logged-in user found.");
    }
  }
});
