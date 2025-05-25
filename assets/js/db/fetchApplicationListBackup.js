// Utility: Get CSS class for status color
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-success text-white";
    case "pre_processing":
      return "bg-info text-white";
    case "pre_approved":
    case "processing":
      return "bg-primary text-white";
    case "rejected":
      return "bg-danger text-white";
    case "new":
    default:
      return "bg-warning text-dark";
  }
}

async function fetchApplicationStudent() {
  const { data, error } = await window.supabase
    .from("student_applications")
    .select(
      "id, register_by, full_name, status, remark, profile_photo,finalStatus,OfferLetterStatus"
    );

  if (error) {
    console.error("Error fetching student applications:", error.message);
    return;
  }

  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach((application, index) => {
    const status = application.status ?? "new";
    const remark = application.remark ?? "";
    let downloadOtherLetter = "Letter's already submit.";
    let downloadOfferLetter = "Offer Letter's already submit.";
    if (!application.finalStatus) {
      downloadOtherLetter = `<div id="upload-container-${application.id}" style="display: flex; flex-direction: column; gap: 10px; padding: 8px; max-width: 220px;">
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label for="upload2-${application.id}" style="font-size: 0.8rem;">EMGS</label>
        <input type="file" accept="image/*" id="upload2-${application.id}" class="form-control form-control-sm" />
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label for="upload3-${application.id}" style="font-size: 0.8rem;">EVAL</label>
        <input type="file" accept="image/*" id="upload3-${application.id}" class="form-control form-control-sm" />
      </div>
      <button class="submit-btn btn btn-sm btn-success mt-2" type="button" data-id="${application.id}" style="align-self: start; padding: 4px 12px;">Submit</button>
    </div>`;
    }
    if (!application.OfferLetterStatus) {
      downloadOfferLetter = `<div id="upload-container-${application.id}" style="display: flex; flex-direction: column; gap: 10px; padding: 8px; max-width: 220px;">
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <label for="upload2-${application.id}" style="font-size: 0.8rem;">Offer Letter</label>
        <input type="file" accept=".zip" id="upload-zip-${application.id}" class="form-control form-control-sm" />
      </div>
      <button class="submit-uploadZip btn btn-sm btn-success mt-2" type="button" data-id="${application.id}" style="align-self: start; padding: 4px 12px;">Submit</button>
    </div>`;
    }

    const row = `
<tr data-id="${application.id}">
  <td class="text-sm text-center align-middle" style="width: 40px;">${
    index + 1
  }</td>

  <td class="align-middle" style="min-width: 180px;">
    <div class="d-flex flex-column">
      <span class="fw-semibold text-sm">${application.register_by}</span>
      <span class="text-muted small student-name" data-id="${application.id}">
        ${application.full_name}
      </span>
    </div>
  </td>

  <td class="align-middle" style="min-width: 140px;">
    <select class="form-select form-select-sm text-xs status-select ${getStatusClass(
      status
    )}" data-id="${application.id}">
      ${[
        "New",
        "Processing",
        "Pre_approved",
        "Pre_Processing",
        "Approved",
        "Rejected",
      ]
        .map(
          (s) =>
            `<option value="${s}" ${
              status.toLowerCase() === s.toLowerCase() ? "selected" : ""
            }>${s.replace("_", " ")}</option>`
        )
        .join("")}
    </select>
  </td>

  <td class="align-middle" style="min-width: 200px;">
    <div class="d-flex flex-column gap-1">
      <textarea class="form-control form-control-sm remark-input" rows="2" style="resize: vertical;" data-id="${
        application.id
      }" placeholder="Enter remark">${remark}</textarea>
      <button class="btn btn-success btn-sm update-remark px-2 py-1 align-self-start" style="width: 60px; font-size: 0.75rem;" data-id="${
        application.id
      }">Update</button>
    </div>
  </td>

  <td class="text-center align-middle" style="width: 60px;">
    <i class="material-symbols-rounded text-black download-icon image-receipt" data-id="${
      application.id
    }" style="cursor:pointer;" title="View Receipt">receipt_long</i>
  </td>

  <td class="align-middle" style="min-width: 220px;">
    ${downloadOfferLetter}
  </td>
  <td class="align-middle" style="min-width: 220px;"> 
    ${downloadOtherLetter}
  </td>
  <td class="text-center align-middle" style="width: 90px;">
    <i class="material-symbols-rounded text-black download-icon full-pdf me-2" data-id="${
      application.id
    }" style="cursor:pointer;" title="Download Full PDF">download</i>
    <i class="material-symbols-rounded text-black download-icon image-student" data-id="${
      application.id
    }" style="cursor:pointer;" title="View Uploaded Images">image</i>
  </td>
</tr>`;

    tbody.innerHTML += row;
  });

  // Event delegation on tbody for clicks and changes
  tbody.addEventListener("click", async (e) => {
    const target = e.target;

    // Update remark button
    if (target.classList.contains("update-remark")) {
      const id = target.dataset.id;
      const input = document.querySelector(`.remark-input[data-id="${id}"]`);
      const newRemark = input?.value ?? "";

      const { error } = await window.supabase
        .from("student_applications")
        .update({ remark: newRemark })
        .eq("id", id);

      if (error) {
        console.error("Error updating remark:", error.message);
        alert("Failed to update remark.");
      } else {
        alert("Remark updated successfully.");
      }
      return;
    }

    // **File Upload Submit Button**
    if (target.classList.contains("submit-btn")) {
      const id = target.dataset.id;
      await handleFileUpload(id); // Call upload function with student ID
      return;
    }

    // **File Upload Submit Button**
    if (target.classList.contains("submit-uploadZip")) {
      const id = target.dataset.id;
      await uploadZip(id); // Call upload function with student ID
      return;
    }

    // Download full PDF
    if (target.classList.contains("full-pdf")) {
      const id = target.dataset.id;
      const student = await getStudentDetails(id);
      if (student) generatePDF(student);
      return;
    }

    // View/download images PDF
    if (target.classList.contains("image-student")) {
      const id = target.dataset.id;
      const photo = await getImageDetail(id);
      if (photo) generatePDFimg(photo);
      return;
    }

    //download receipt
    if (target.classList.contains("image-receipt")) {
      const id = target.dataset.id;
      const photo = await getReceiptDetail(id);
      if (photo) generatePDFReceipt(photo);
      return;
    }
  });
  //handle filter for Pre_Processing
  document;

  // Handle status change event on tbody
  tbody.addEventListener("change", async (e) => {
    const target = e.target;
    if (target.classList.contains("status-select")) {
      const id = target.dataset.id;
      const newStatus = target.value;

      const { error } = await window.supabase
        .from("student_applications")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error.message);
        alert("Failed to update status.");
      } else {
        alert("Status updated to: " + newStatus);

        // Update color classes
        const allClasses = [
          "bg-success",
          "bg-warning",
          "bg-primary",
          "bg-danger",
          "text-white",
          "text-dark",
        ];
        target.classList.remove(...allClasses);
        target.classList.add(...getStatusClass(newStatus).split(" "));
      }
    }
  });
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result); // includes data:image/... prefix
    reader.onerror = (error) => reject(error);
  });
}

async function handleFileUpload(studentId) {
  let file1 = document.getElementById("upload1-" + studentId);
  let file2 = document.getElementById("upload2-" + studentId);
  let file3 = document.getElementById("upload3-" + studentId);

  file1 = file1 ? file1.files[0] : null;
  file2 = file2 ? file2.files[0] : null;
  file3 = file3 ? file3.files[0] : null;

  let offer_letter_url1 = "";
  if (file1) {
    offer_letter_url1 = await toBase64(file1);
  }

  let emgs_url2 = "";
  if (file2) {
    emgs_url2 = await toBase64(file2);
  }

  let eval_url3 = "";
  if (file3) {
    eval_url3 = await toBase64(file3);
  }

  const { error } = await window.supabase
    .from("student_applications")
    .update({
      offer_letter_url: offer_letter_url1,
      emgs_url: emgs_url2,
      eval_url: eval_url3,
      finalStatus: true,
    })
    .eq("id", studentId);

  if (error) {
    console.error("Error updating:", error.message);
    alert("Failed to update.");
  } else {
    alert("updated successfully.");
    location.reload();
  }

  return;
}

async function uploadZip(studentId) {
  const fileInput = document.getElementById("upload-zip-" + studentId);
  const file = fileInput.files[0];
  if (!file) return alert("Please select a ZIP file");

  const reader = new FileReader();

  reader.onload = async function (event) {
    const base64String = event.target.result.split(",")[1]; // remove prefix

    const { data, error } = await window.supabase
      .from("student_applications") // change to your table name
      .update({
        offer_letter_url: base64String,
        OfferLetterStatus: true,
      })
      .eq("id", studentId);

    if (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } else {
      alert("File uploaded successfully");
      location.reload();
    }
  };

  reader.readAsDataURL(file); // this will give base64 with MIME prefix
}

async function getReceiptDetail(studentId) {
  const { data, error } = await window.supabase
    .from("student_applications")
    .select("second_payment")
    .eq("id", studentId)
    .single();

  if (error) {
    console.error("Error fetching receipt photo:", error.message);
    alert("\u274C Error fetching receipt photo.");
    return null;
  }
  return data;
}

async function getStudentDetails(studentId) {
  try {
    if (!studentId) {
      alert("Invalid student ID");
      return null;
    }

    console.log("Fetching student details for ID:", studentId);

    const { data, error } = await window.supabase
      .from("student_applications")
      .select(
        `
        full_name, gender, date_of_birth, nationality, nonMalaysianInput,
        race, religion, ic_or_passport, email, birth_place, contact_number,
        emergency_contact_name, emergency_contact_number,
        permanent_address, permanent_postcode, permanent_city, permanent_state,
        program_status, program_name, study_mode, intake_year, intake_semester,
        highest_qualification, institution_name, institution_country, year_gradschool, graduation_year,
        secondary_name, secondary_address, secondary_qualification,
        english_test, english_test_date, english_score, english_test_other,
        require_visa, visa_type, passport_expiry, specifycondition, specifycurrent, current_medication, medicalConditions, father_name, father_occupation, father_phone, mother_name, mother_occupation, mother_phone, declaration_date, declaration_signature, parent_declaration_date, 
        offer_letter_url, emgs_url, eval_url
      `
      )
      .eq("id", studentId)
      .single();

    if (error) {
      console.error("❌ Supabase error fetching student details:", error);
      alert("Error fetching student details.");
      return null;
    }

    if (!data) {
      alert("No student found with the given ID.");
      return null;
    }

    console.log("Fetched student details:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error fetching student details.");
    return null;
  }
}

//DOWNLOAD FILE
async function getImageDetail(studentId) {
  const { data, error } = await window.supabase
    .from("student_applications")
    .select(
      "profile_photo, ResultQualification, Certificate_completion_studies_file, chsi, cscse, english_result_file, payment_receipt_file, graduatesecondry, Cert_sec_stud, Healthdeclare_file"
    )
    .eq("id", studentId)
    .single();

  if (error) {
    console.error("Error fetching student photo:", error.message);
    alert("\u274C Error fetching student photo.");
    return null;
  }
  return data;
}
function generatePDF(student) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(`Student Application Details of UniMAP@KL`, 14, 15);

  doc.autoTable({
    startY: 25,
    head: [["SECTION", "FIELD", "DETAIL"]],
    body: [
      [
        {
          content: "PERSONAL INFORMATION",
          rowSpan: 10,
          styles: { fontStyle: "bold" },
        },
        "Full Name",
        student.full_name,
      ],
      ["Gender", student.gender],
      ["Date of Birth", student.date_of_birth],
      [
        "Nationality",
        student.nationality === "noncitizen" ? "Non-Malaysian" : "Malaysian",
        student.non_malaysian_specify || "-",
      ],
      ["Race", student.race],
      ["Religion", student.religion],
      ["Ic/ Passport No.", student.ic_or_passport],
      ["Email", student.email],
      ["Place of Birth", student.birth_place],
      ["Contact Number", student.contact_number],

      [
        {
          content: "EMERGENCY INFORMATION",
          rowSpan: 1,
          styles: { fontStyle: "bold" },
        },
        "Emergency Contact",
        `${student.emergency_contact_name || ""}, ${
          student.emergency_contact_number || ""
        }`,
      ],

      [
        {
          content: "ADDRESS INFORMATION",
          rowSpan: 1,
          styles: { fontStyle: "bold" },
        },
        "Address",
        `${student.permanent_address}, ${student.permanent_postcode}, ${student.permanent_city}, ${student.permanent_state}`,
      ],

      [
        {
          content: "PROGRAM INFORMATION",
          rowSpan: 5,
          styles: { fontStyle: "bold" },
        },
        "Program Level",
        student.program_status,
      ],
      ["Program Name", student.program_name],
      ["Mode of Study", student.study_mode],
      ["Intake Year", student.intake_year],
      ["Semester", student.intake_semester],

      [
        {
          content: "ACADEMIC INFORMATION",
          rowSpan: 4,
          styles: { fontStyle: "bold" },
        },
        "Highest Qualification Obtained",
        student.highest_qualification,
      ],
      ["Institution Name", student.institution_name],
      ["Country of Institution", student.institution_country],
      ["Year of Graduation", student.graduation_year],

      [
        {
          content: "PREVIOUS EDUCATION",
          rowSpan: 3,
          styles: { fontStyle: "bold" },
        },
        "Secondary School Name",
        student.secondary_name,
      ],
      ["Address", student.secondary_address],
      ["Qualifications Obtained", student.secondary_qualification],

      [
        {
          content: "ENGLISH PROFICIENCY",
          rowSpan: 3,
          styles: { fontStyle: "bold" },
        },
        "Type of English Test Taken",
        student.english_test,
      ],
      ["Others English Specify", student.english_test_date],
      ["Test Date", student.english_score],

      [
        {
          content: "VISA INFORMATION",
          rowSpan: 4,
          styles: { fontStyle: "bold" },
        },
        "Require Student Visa?",
        student.require_visa,
      ],
      ["Type of Visa", student.visa_type],
      // ["Visa Expiry Date", student.visa_expiry],
      ["Passport Expiry Date", student.passport_expiry],

      [
        {
          content: "HEALTH DECLARATION",
          rowSpan: 4,
          styles: { fontStyle: "bold" },
        },
        "Any known medical conditions?",
        student.known_medical_conditions,
      ],
      ["If Yes, Specify", student.specifycondition],
      ["Currently on any regular medication?", student.on_medication],
      ["If Yes, Specify", student.specifycurrent],

      [
        {
          content: "PARENT/GUARDIAN INFORMATION",
          rowSpan: 6,
          styles: { fontStyle: "bold" },
        },
        "Father's/Guardian's Name",
        student.father_name,
      ],
      ["Father's/Guardian's Contact", student.father_phone],
      ["Father's/Guardian's Occupation", student.father_occupation],
      ["Mother's/Guardian's Name", student.mother_name],
      ["Mother's/Guardian's Contact", student.mother_phone],
      ["Mother's/Guardian's Occupation", student.mother_occupation],

      [
        { content: "DECLARATION", rowSpan: 4, styles: { fontStyle: "bold" } },
        "Declaration",
        "Yes, I declare that the information provided is accurate.",
      ],
      ["Signature of Student", student.declaration_signature],
      ["Date", student.declaration_date],
      ["Parent Declaration", student.parent_declaration_date],
    ],
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      halign: "center",
    },
    theme: "grid",
  });

  doc.save(`${student.full_name}_Application.pdf`);
}

function generatePDFimg(photo) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const imageFields = [
    { key: "profile_photo", label: "Passport Photo" },
    { key: "ResultQualification", label: "Academic Transcript" },
    {
      key: "Certificate_completion_studies_file",
      label: "Academic Graduation Results",
    },
    { key: "english_result_file", label: "English Result" },
    { key: "chsi", label: "CHSI" },
    { key: "cscse", label: "CSCSE" },
    // { key: "Passport_FPage", label: "Passport Front Page" },
    { key: "payment_receipt_file", label: "Payment Receipt" },
    { key: "graduatesecondry", label: "Graduate Secondary Cert" },
    { key: "Cert_sec_stud", label: "Certificate of Secondary Studies" },
    { key: "Healthdeclare_file", label: "Health Declaration" },
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
      doc.text(label, 10, 10); // Label at top-left
      doc.addImage(photo[key], "JPEG", 0, 20, pageWidth, pageHeight - 20);
    }
  });

  doc.save("image_Application.pdf");
}

function generatePDFReceipt(photo) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const imageFields = [
    { key: "second_payment", label: "Second Payment Receipt" },
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
      doc.text(label, 10, 10); // Label at top-left
      doc.addImage(photo[key], "JPEG", 0, 20, pageWidth, pageHeight - 20);
    }
  });

  doc.save("Receipt.pdf");
}

// Handle nationality select toggle (if on the page)
const nationalitySelect = document.getElementById("nationality");
const nonMalaysianInput = document.getElementById("nonMalaysianInput");
if (nationalitySelect && nonMalaysianInput) {
  nationalitySelect.addEventListener("change", function () {
    if (this.value === "noncitizen") {
      nonMalaysianInput.style.display = "block";
    } else {
      nonMalaysianInput.style.display = "none";
    }
  });
}
// Handle ENGLISH PROF  select toggle (if on the page)
const englishTestSelect = document.getElementById("nationality");
const englishTestInput = document.getElementById("english_test_other");
if (nationalitySelect && nonMalaysianInput) {
  nationalitySelect.addEventListener("change", function () {
    if (this.value === "englishTest") {
      nonMalaysianInput.style.display = "block";
    } else {
      nonMalaysianInput.style.display = "none";
    }
  });
}
document.addEventListener("DOMContentLoaded", fetchApplicationStudent);
