async function fetchApplicationAgent() {
  // Fetch data from the 'user' table including Agent_remark (assuming it's in the 'user' table)
  const { data: userData, error: userError } = await window.supabase.from(
    "user"
  ).select(`
      username, email, full_name, phone_number, address,
      company_name, company_ssm, agent_status, agent_remark
    `);

  if (userError) {
    console.error("Error fetching user data:", userError.message);
    return;
  }

  const tbody = document.querySelector("tbody");
  tbody.innerHTML = ""; // Clear previous rows

  // Populate the table with the fetched user data
  userData.forEach((user, index) => {
    const row = `
      <tr>
        <td class="text-sm text-center">${index + 1}</td>
        <td><p class="mb-0 text-sm">${user.username}</p></td>
        <td><p class="mb-0 text-sm">${user.email}</p></td>
        <td><p class="mb-0 text-sm">${user.full_name}</p></td>
        <td><p class="mb-0 text-sm">${user.phone_number}</p></td>
        <td><p class="mb-0 text-sm">${user.address}</p></td>
        <td><p class="mb-0 text-sm">${user.company_name}</p></td>
        <td><p class="mb-0 text-sm">${user.company_ssm}</p></td>
        <td><p class="mb-0 text-sm">${user.agent_status}</p></td>
        <td><p class="mb-0 text-sm">${
          user.agent_remark
        }</p></td> <!-- Directly use agent_remark -->
      </tr>
    `;
    tbody.innerHTML += row; // Append the row to the table
  });
}

document.addEventListener("DOMContentLoaded", fetchApplicationAgent);
