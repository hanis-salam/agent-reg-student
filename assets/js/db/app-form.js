document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const profilePic = document.querySelector('[name="profilePic"]').value;
  const full_name_student = document.querySelector(
    '[name="full_name_student"]'
  ).value;
  const ic_no = document.querySelector('[name="ic_no"]').value;
  const ic_not = document.querySelector('[name="ic_not"]').value;
  const email = document.querySelector('[name="email"]').value;
  const nationality = document.querySelector('[name="nationality"]').value;
  const race = document.querySelector('[name="race"]').value;
  const phone = document.querySelector('[name="phone"]').value;
  const dob = document.querySelector('[name="dob"]').value;
  const religion = document.querySelector('[name="religion"]').value;
  const emergency_contact = document.querySelector(
    '[name="emergency_contact"]'
  ).value;
  const address = document.querySelector('[name="address"]').value;
  const city = document.querySelector('[name="city"]').value;
  const postcode = document.querySelector('[name="postcode"]').value;
  const state = document.querySelector('[name="state"]').value;
  const different_no = document.querySelector('[name="different_no"]').value;
  const address_country = document.querySelector(
    '[name="address_country"]'
  ).value;
  const city_country = document.querySelector('[name="city_country"]').value;
  const country = document.querySelector('[name="country"]').value;
  const postal_code = document.querySelector('[name="postal_code"]').value;
  const programstatus = document.querySelector('[name="programstatus"]').value;
  const program = document.querySelector('[name="program"]').value;
  const visa_status = document.querySelector('[name="visa_status"]').value;
  const visa_experience = document.querySelector(
    '[name="visa_experience"]'
  ).value;
  const guardian_name = document.querySelector('[name="guardian_name"]').value;
  const academic_qualification = document.querySelector(
    '[name="academic_qualification"]'
  ).value;
  const health_condition = document.querySelector(
    '[name="health_condition"]'
  ).value;
  const medication = document.querySelector('[name="medication"]').value;
  const father_name = document.querySelector('[name="father_name"]').value;
  const father_occupation = document.querySelector(
    '[name="father_occupation"]'
  ).value;
  const father_number = document.querySelector('[name="father_number"]').value;
  const mother_name = document.querySelector('[name="mother_name"]').value;
  const mother_occupation = document.querySelector(
    '[name="mother_occupation"]'
  ).value;
  const mother_number = document.querySelector('[name="mother_number"]').value;
  const payment_checking = document.querySelector(
    '[name="paymentchecking"]'
  ).value;
  const declaration_check = document.querySelector(
    '[name="declarationCheck"]'
  ).checked;
  const date_sign = document.querySelector('[name="datesign"]').value;
  const sign_parents = document.querySelector('[name="sign-parents"]').value;

  const { data, error } = await supabase.from("student_applications").insert([
    {
      profilePic,
      full_name_student,
      ic_no,
      ic_not,
      email,
      nationality,
      race,
      phone,
      dob,
      religion,
      emergency_contact,
      address,
      city,
      postcode,
      state,
      different_no,
      address_country,
      city_country,
      country,
      postal_code,
      programstatus,
      program,
      visa_status,
      visa_experience,
      guardian_name,
      academic_qualification,
      health_condition,
      medication,
      father_name,
      father_occupation,
      father_number,
      mother_name,
      mother_occupation,
      mother_number,
      payment_checking,
      declaration_check,
      date_sign,
      sign_parents,
    },
  ]);

  if (error) {
    alert("❌ Error saving data: " + error.message);
  } else {
    alert("✅ Application submitted successfully!");
    document.querySelector("form").reset();
  }
});
