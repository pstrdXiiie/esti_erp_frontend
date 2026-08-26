import { ChildTableGrid } from "@/components/sms/ChildTableGrid"
import type { EntrySpec, FormSpec } from "@/lib/forms/types"

/**
 * Registrar module specs (blueprint Phase 1). Field lists mirror the real
 * installed DocTypes plus the PH-specific custom fields added in
 * campus_erp/setup/custom_fields.py — see IMPLEMENTATION-MAPPING.md's
 * Registrar section for the terminology swap: blueprint "Course" (degree
 * program) == Education "Program"; blueprint "Subject" == Education "Course".
 * Link fields are entered as the exact document name (Program/Course/Student
 * Group all autoname off their own name field, so this is human-typable).
 */

export const studentEnrollmentSpec: EntrySpec = {
  doctype: "SMS Student Enrollment",
  title: "Enrollment",
  fields: [
    { fieldname: "student_image", label: "Student Photo", fieldtype: "Attach Image" },
    { fieldname: "student_id", label: "Student ID", fieldtype: "Autocomplete", inListView: true },
    { fieldname: "last_name", label: "Last Name", fieldtype: "Data", required: true, inListView: true },
    { fieldname: "first_name", label: "First Name", fieldtype: "Data", required: true, inListView: true },
    { fieldname: "middle_name", label: "Middle Name", fieldtype: "Data", required: true },
    { fieldname: "email_address", label: "Email Address", fieldtype: "Data", required: true },
    { fieldname: "signature", label: "Signature", fieldtype: "Signature" },
  ],
  childTable: {
    fieldname: "academic_personal_info",
    doctype: "SMS Student Enrollment Detail",
    columns: [
      { fieldname: "course", label: "Course", fieldtype: "Link", options: "SMS Course", required: true, section: "personal" },
      { fieldname: "curriculum", label: "Curriculum", fieldtype: "Link", options: "SMS Curriculum", section: "personal" },
      { fieldname: "year_level", label: "Year Level", fieldtype: "Select", options: "1\n2\n3\n4\n7\n8\n9\n10\n11\n12", section: "personal" },
      { fieldname: "gender", label: "Gender", fieldtype: "Link", options: "Gender", required: true, section: "personal" },
      { fieldname: "birth_date", label: "Birth Date", fieldtype: "Date", section: "personal" },
      { fieldname: "age", label: "Age", fieldtype: "Data", section: "personal" },
      { fieldname: "telephone", label: "Telephone", fieldtype: "Data", section: "personal" },
      { fieldname: "birth_place", label: "Birth Place", fieldtype: "Data", section: "personal" },
      { fieldname: "religion", label: "Religion", fieldtype: "Select", options: "Roman Catholic\nIslam\nIglesia ni Cristo\nProtestants\nEvangelicals\nSeventh-day Adventists\nJehovah's Witnesses\nLatter-day Saints\nPhilippine Independent Church\nIndigenous/Other Faiths", section: "personal" },
      { fieldname: "citizenship", label: "Citizenship", fieldtype: "Data", section: "personal" },
      { fieldname: "address", label: "Address", fieldtype: "Data", section: "personal" },
      { fieldname: "city_province", label: "City/Town", fieldtype: "Data", section: "personal" },
      { fieldname: "province", label: "Province", fieldtype: "Data", section: "personal" },
      { fieldname: "father", label: "Father", fieldtype: "Data", section: "personal" },
      { fieldname: "address_father", label: "Address", fieldtype: "Data", section: "personal" },
      { fieldname: "phone_father", label: "Phone", fieldtype: "Data", section: "personal" },
      { fieldname: "occupation_father", label: "Occupation", fieldtype: "Data", section: "personal" },
      { fieldname: "mother", label: "Mother", fieldtype: "Data", section: "personal" },
      { fieldname: "address_mother", label: "Address", fieldtype: "Data", section: "personal" },
      { fieldname: "phone_mother", label: "Phone", fieldtype: "Data", section: "personal" },
      { fieldname: "occupation_mother", label: "Occupation", fieldtype: "Data", section: "personal" },
      { fieldname: "guardian", label: "Guardian", fieldtype: "Data", section: "personal" },
      { fieldname: "relation", label: "Relation", fieldtype: "Data", section: "personal" },
      { fieldname: "address_guardian", label: "Address", fieldtype: "Data", section: "personal" },
      { fieldname: "phone_guardian", label: "Phone", fieldtype: "Data", section: "personal" },
      { fieldname: "guardian_occupation", label: "Occupation", fieldtype: "Data", section: "personal" },

      { fieldname: "birth_certificate", label: "Birth Certificate", fieldtype: "Check", section: "credentials" },
      { fieldname: "certificate_of_goodmoral", label: "Certificate of Good Moral", fieldtype: "Check", section: "credentials" },
      { fieldname: "form_137", label: "Form 137", fieldtype: "Check", section: "credentials" },
      { fieldname: "form_138", label: "Form 138", fieldtype: "Check", section: "credentials" },
      { fieldname: "honorable_dismissal", label: "Honorable Dismissal", fieldtype: "Check", section: "credentials" },
      { fieldname: "ncae", label: "NCAE", fieldtype: "Check", section: "credentials" },
      { fieldname: "transcript_of_records", label: "Transcript of Records", fieldtype: "Check", section: "credentials" },

      { fieldname: "elementary", label: "Elementary", fieldtype: "Data", section: "scholastic" },
      { fieldname: "year_elementary", label: "Year Completed", fieldtype: "Data", section: "scholastic" },
      { fieldname: "secondary", label: "Secondary", fieldtype: "Data", section: "scholastic" },
      { fieldname: "year_secondary", label: "Year Completed", fieldtype: "Data", section: "scholastic" },
      { fieldname: "tertiary", label: "Tertiary", fieldtype: "Data", section: "scholastic" },
      { fieldname: "previous_course", label: "Previous Course", fieldtype: "Data", section: "scholastic" },
      { fieldname: "last_attended", label: "Last Attended", fieldtype: "Data", section: "scholastic" },
      { fieldname: "year", label: "Year", fieldtype: "Data", section: "scholastic" },
      { fieldname: "gwa", label: "GWA", fieldtype: "Data", section: "scholastic" },
      { fieldname: "transferee", label: "Transferee", fieldtype: "Check", section: "scholastic" },
      { fieldname: "graduate", label: "Graduate", fieldtype: "Check", section: "scholastic" },
    ],
  },
}


export const curriculumSpec: EntrySpec = {
  doctype: "SMS Curriculum",
  title: "Curriculum",
  fields: [
    { fieldname: "curriculum_code", label: "Curriculum Code", fieldtype: "Data", required: true },
    { fieldname: "course", label: "Program", fieldtype: "Link", options: "Program", required: true },
    { fieldname: "curriculum_year", label: "Curriculum Year", fieldtype: "Data" },
    {
      fieldname: "sem_type",
      label: "Term Structure",
      fieldtype: "Select",
      options: "Quarter\nPrelim-Midterm-Finals\nTrisemester\nFull Payment Only",
    },
    { fieldname: "max_units", label: "Max Units per Term", fieldtype: "Float" },
    { fieldname: "is_active", label: "Is Current Curriculum", fieldtype: "Check" },
  ],
  childTable: {
    fieldname: "subjects",
    doctype: "SMS Curriculum Subject",
    columns: [
      { fieldname: "year_level", label: "Year Level", fieldtype: "Int", required: true },
      { fieldname: "semester", label: "Semester", fieldtype: "Int", required: true },
      { fieldname: "subject", label: "Subject", fieldtype: "Link", options: "Course", required: true },
      { fieldname: "prerequisite", label: "Prerequisite", fieldtype: "Link", options: "Course" },
    ],
  },
}

export const permitSpec: EntrySpec = {
  doctype: "SMS Permit",
  title: "Permit to Take Exam",
  fields: [
    { fieldname: "student", label: "Student", fieldtype: "Link", options: "Student", required: true },
    { fieldname: "course", label: "Program", fieldtype: "Link", options: "Program" },
    { fieldname: "year_level", label: "Year Level", fieldtype: "Int" },
    { fieldname: "semester", label: "Semester", fieldtype: "Int" },
    { fieldname: "school_year", label: "School Year", fieldtype: "Data" },
    { fieldname: "term", label: "Exam Period", fieldtype: "Data" },
    { fieldname: "total_fee", label: "Total Fee", fieldtype: "Currency" },
    { fieldname: "payment", label: "Payment", fieldtype: "Currency" },
    { fieldname: "due_payment", label: "Due Payment", fieldtype: "Currency" },
    { fieldname: "status", label: "Status", fieldtype: "Select", options: "Pending\nEligible\nIssued" },
    { fieldname: "permit_no", label: "Permit No.", fieldtype: "Data" },
  ],
  childTable: {
    fieldname: "subjects",
    doctype: "SMS Permit Subject",
    columns: [
      { fieldname: "subject", label: "Subject", fieldtype: "Link", options: "Course", required: true },
      { fieldname: "class", label: "Class (Student Group)", fieldtype: "Link", options: "Student Group" },
    ],
  },
}

export const studentcredentialSpec: FormSpec = {
  doctype: "SMS Student Credentials",
  title: "Credentials",
  fields: [
    { fieldname: "student", label: "Student", fieldtype: "Link", options: "Student", required: true, section: "details", inListView: true },
    { fieldname: "date_encoded", label: "Date Encoded", fieldtype: "Date", section: "details", inListView: true },
    { fieldname: "encoder", label: "Encoder", fieldtype: "Link", options: "Encoder", required: true, section: "details", inListView: true },

    { fieldname: "psa_birth_certificate", label: "PSA Birth Certificate", fieldtype: "Check", required: true, section: "credentials" },
    { fieldname: "certificate_of_good_moral", label: "Certificate of Good Moral", fieldtype: "Check", required: true, section: "credentials" },
    { fieldname: "transcript_of_record", label: "Transcript of Record", fieldtype: "Check", required: true, section: "credentials" },
    { fieldname: "ncae", label: "NCAE", fieldtype: "Check", required: true, section: "credentials" },
    { fieldname: "form_138", label: "Form 138", fieldtype: "Check", required: true, section: "credentials" },
    { fieldname: "form_137", label: "Form 137", fieldtype: "Check", required: true, section: "credentials" },
  ],
}

export const programenrollmentSpect: FormSpec = {
  doctype: "Program Enrollment",
  title: "Program Enrollment",
  fields: [
    {fieldname: "student", label: "Student", fieldtype: "Link", required: true},
    {fieldname: "studdent_name", label: "Student Name", fieldtype: "Data", readOnly: true},

  ],
}
