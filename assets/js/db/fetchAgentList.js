let currentPage = 1;
const rowsPerPage = 20;
let currentData = [];

async function fetchApplicationAgent(filterName = "") {
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

  // Filter the data
  currentData = filterName
    ? userData.filter((user) =>
        user.username.toLowerCase().includes(filterName.toLowerCase())
      )
    : userData;

  currentPage = 1; // Reset to first page on new filter
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = currentData.slice(start, end);

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center text-sm text-red-500">No agent found.</td></tr>`;
    return;
  }

  pageData.forEach((user, index) => {
    const row = `
      <tr>
        <td class="text-sm text-center">${start + index + 1}</td>
        <td><p class="mb-0 text-sm">${user.username}</p></td>
        <td><p class="mb-0 text-sm">${user.email}</p></td>
        <td><p class="mb-0 text-sm">${user.full_name}</p></td>
        <td><p class="mb-0 text-sm">${user.phone_number}</p></td>
        <td><p class="mb-0 text-sm">${user.address}</p></td>
        <td><p class="mb-0 text-sm">${user.company_name}</p></td>
        <td><p class="mb-0 text-sm">${user.company_ssm}</p></td>
        <td><p class="mb-0 text-sm">${user.agent_status}</p></td>
        <td><p class="mb-0 text-sm">${user.agent_remark}</p></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  renderPaginationControls();
}

function renderPaginationControls() {
  let paginationDiv = document.getElementById("pagination");
  if (!paginationDiv) {
    paginationDiv = document.createElement("div");
    paginationDiv.id = "pagination";
    paginationDiv.className =
      "d-flex justify-content-between align-items-center mt-3 px-3";
    document.querySelector(".table-responsive").appendChild(paginationDiv);
  }

  const totalPages = Math.ceil(currentData.length / rowsPerPage);

  paginationDiv.innerHTML = `
  <button class="btn btn-sm btn-secondary" ${
    currentPage === 1 ? "disabled" : ""
  } onclick="changePage(-1)">
    Previous
  </button>
  <span class="text-sm">Page ${currentPage} of ${totalPages}</span>
  <button class="btn btn-sm btn-secondary" ${
    currentPage === totalPages ? "disabled" : ""
  } onclick="changePage(1)">
    Next
  </button>
`;
}

function changePage(direction) {
  const totalPages = Math.ceil(currentData.length / rowsPerPage);
  currentPage += direction;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  renderTable();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchApplicationAgent();

  const input = document.getElementById("agentFilter");
  if (input) {
    input.addEventListener("input", () => {
      fetchApplicationAgent(input.value.trim());
    });
  }
});
