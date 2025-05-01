async function fetchStudentNames() {
  const { data, error } = await window.supabase
    .from("student_applications")
    .select("full_name");

  if (error) {
    console.error("Error fetching student names:", error.message);
    return;
  }

  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach((student, index) => {
    const row = `
        <tr>
          <td class="text-sm text-center">${index + 1}</td>
          <td>
            <div class="d-flex px-2 py-1">
              <div class="my-auto">
                <h6 class="mb-0 text-sm">${student.full_name}</h6>
              </div>
            </div>
          </td>
          <td>
        <span class="badge bg-warning text-dark text-xs">Pending</span>
      </td>
        </tr>`;
    tbody.innerHTML += row;
  });
}

// Call the function on DOMContentLoaded
document.addEventListener("DOMContentLoaded", fetchStudentNames);
