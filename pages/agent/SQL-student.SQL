CREATE TABLE student_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Personal Information
  full_name TEXT,
  gender TEXT,
  ic_or_passport TEXT,
  date_of_birth DATE,
  nationality TEXT,
  race TEXT,
  religion TEXT,
  contact_number TEXT,
  email TEXT,
  emergency_contact_name TEXT,
  emergency_contact_number TEXT,
  profile_photo TEXT,

  -- Address Information
  permanent_address TEXT,
  permanent_city TEXT,
  permanent_postcode TEXT,
  permanent_state TEXT,
  alternate_phone_number TEXT,
  home_country_address TEXT,
  home_country_city TEXT,
  home_country_country TEXT,
  home_country_postcode TEXT,

  -- Program Information
  program_status TEXT,
  program_name TEXT,
  study_mode TEXT,
  intake_year INT,
  intake_semester TEXT,

  -- Academic Qualifications
  highest_qualification TEXT,
  institution_name TEXT,
  institution_country TEXT,
  graduation_year TEXT,
  qualification_result_file TEXT,
  qualification_certificate_file TEXT,

  -- Previous Education
  secondary_school TEXT,
  secondary_qualification TEXT,
  higher_education_name TEXT,

  -- English Proficiency
  english_test TEXT,
  english_test_other TEXT,
  english_score TEXT,
  english_test_date DATE,
  english_result_file TEXT,

  -- Visa Information
  require_visa BOOLEAN,
  visa_type TEXT,
  visa_expiry DATE,
  passport_expiry DATE,
  visa_image TEXT,

  -- Health Information
  health_declaration_file TEXT,
  known_medical_conditions TEXT,
  on_medication TEXT,

  -- Parent/Guardian Info
  father_name TEXT,
  father_occupation TEXT,
  father_phone TEXT,
  mother_name TEXT,
  mother_occupation TEXT,
  mother_phone TEXT,

  -- Payment
  payment_receipt_file TEXT,

  -- Declaration
  declaration_date DATE,
  declaration_signature TEXT,
  parent_declaration_date DATE,

  -- Office Use
  registration_number TEXT,
  application_status TEXT,
  officer_name TEXT,
  date_processed DATE,

  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);
