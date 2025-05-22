const supabase = window.supabase;

async function fetchStudentNames() {
  const storedLoginDetail = JSON.parse(sessionStorage.getItem("loginDetail"));
  let agent_name = "";

  if (storedLoginDetail) {
    agent_name = storedLoginDetail.full_name;
    document.getElementById("userFullName").innerText = agent_name;
  } else {
    console.error("Login detail missing");
    return;
  }

  const { data, error } = await supabase
    .from("student_applications")
    .select(
      "id, full_name, status, remark, second_payment, offer_letter_url, emgs_url, eval_url"
    )
    .eq("register_by", agent_name);

  if (error) {
    console.error("Error fetching student names:", error.message);
    return;
  }

  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (const [index, student] of data.entries()) {
    const status = student.status ?? "new";
    const remark = student.remark ?? "";
    const badgeClass = getStatusBadgeClass(status);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="text-sm text-center">${index + 1}</td>
      <td><div class="d-flex px-2 py-1"><div class="my-auto"><h6 class="mb-0 text-sm">${
        student.full_name
      }</h6></div></div></td>
      <td><span class="badge ${badgeClass} text-xs">${status.replace(
      "_",
      " "
    )}</span></td>
    `;

    // Receipt upload column before remark
    const receiptTd = document.createElement("td");
    receiptTd.className = "text-sm text-center";

    if (status && status.toLowerCase() === "pre_approved") {
      const group = document.createElement("div");
      group.className = "file-group d-flex align-items-center gap-2 w-100";

      group.innerHTML = `
        <input type="file" accept="image/*" class="form-control form-control-sm receipt-input" data-id="${student.id}" />
        <span class="material-symbols-rounded text-success upload-receipt-icon" style="font-size: 24px; cursor: pointer;">upload</span>
        <img src="" alt="Receipt preview" class="receipt-preview" style="max-height: 50px; margin-left: 10px; display:none; border: 1px solid #ccc; border-radius: 4px;" />
      `;

      receiptTd.appendChild(group);

      if (student.second_payment) {
        const previewImg = group.querySelector(".receipt-preview");
        previewImg.src = student.second_payment;
        previewImg.style.display = "inline-block";
      }
    } else {
      receiptTd.innerHTML = `<span class="text-muted">-</span>`;
    }
    row.appendChild(receiptTd);

    // Remark column
    const remarkTd = document.createElement("td");
    remarkTd.className = "text-sm text-left";
    remarkTd.innerText = remark;
    row.appendChild(remarkTd);

    // Files column with download icon
    const filesTd = document.createElement("td");
    filesTd.className = "text-sm text-center";
    const hasFiles =
      student.offer_letter_url && student.emgs_url && student.eval_url;

    if (hasFiles) {
      filesTd.innerHTML = `
        <span class="material-symbols-rounded download-icon" style="font-size:24px; cursor:pointer;" 
          data-id="${student.id}"
          data-offer="${student.offer_letter_url}" 
          data-emgs="${student.emgs_url}" 
          data-eval="${student.eval_url}" 
          title="Download files">
          download
        </span>
      `;
    } else {
      filesTd.innerHTML = `<span class="text-muted">-</span>`;
    }

    row.appendChild(filesTd);

    fragment.appendChild(row);
  }

  tbody.appendChild(fragment);
}

// Upload & download handler
document.addEventListener("click", async (e) => {
  const target = e.target;

  // Handle receipt upload
  if (target.classList.contains("upload-receipt-icon")) {
    const parent = target.closest(".file-group");
    const input = parent.querySelector(".receipt-input");
    const preview = parent.querySelector(".receipt-preview");

    const studentId = input.dataset.id;
    const file = input.files[0];

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result;

      // Upload receipt and update status to 'pre_processing'
      const { error } = await supabase
        .from("student_applications")
        .update({
          second_payment: base64String,
          status: "pre_processing",
        })
        .eq("id", studentId);

      if (error) {
        console.error("Upload failed:", error.message);
        alert("❌ Upload failed.");
        return;
      }

      // Show preview and reload data
      preview.src = base64String;
      preview.style.display = "inline-block";
      alert("✅ Receipt uploaded. Status updated to 'pre_processing'.");
      fetchStudentNames();
    };

    reader.readAsDataURL(file);
  }

  // Handle file download
  if (target.classList.contains("download-icon")) {
    const id = target.dataset.id;
    const photo = await getImageDetail(id);
    if (photo) generatePDFimg(photo);
    return;
  }
});

async function getImageDetail(studentId) {
  const { data, error } = await window.supabase
    .from("student_applications")
    .select("offer_letter_url, emgs_url, eval_url")
    .eq("id", studentId)
    .single();

  if (error) {
    console.error("Error fetching student letter:", error.message);
    alert("\u274C Error fetching student letter.");
    return null;
  }
  return data;
}

function generatePDFimg(photo) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const imageFields = [
    { key: "offer_letter_url", label: "" },
    { key: "emgs_url", label: "" },
    { key: "eval_url", label: "" },
  ];

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let firstPage = true;

  imageFields.forEach(({ key, label }) => {
    if (photo[key]) {
      if (!firstPage) {
        doc.addPage();
      } else {
        firstPage = false;
      }

      doc.setFontSize(12);
      doc.text(label, 10, 10);
      doc.addImage(photo[key], "JPEG", 0, 20, pageWidth, pageHeight - 20);
    }
  });

  doc.save("Letter_Application.pdf");
}

// Status badge class
function getStatusBadgeClass(status) {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-success text-white";
    case "pre_approved":
      return "bg-primary text-white";
    case "pre_processing":
      return "bg-info text-white";
    case "rejected":
      return "bg-danger text-white";
    case "new":
    default:
      return "bg-warning text-dark";
  }
}

document.addEventListener("DOMContentLoaded", fetchStudentNames);
