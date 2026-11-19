const fs = require('fs');
const path = require('path');
const { 
  Document, Packer, Paragraph, TextRun, HeadingLevel, 
  Table, TableRow, TableCell, WidthType, AlignmentType, 
  BorderStyle, ShadingType 
} = require('docx');

function createHeading(text, level) {
  return new Paragraph({
    text: text,
    heading: level,
    spacing: { before: 240, after: 120 }
  });
}

function createBullet(title, description) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: title + ": ", bold: true, color: "0D9488" }),
      new TextRun({ text: description })
    ]
  });
}

function createSectionHeader(title, who) {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 80 },
      children: [
        new TextRun({ text: title, bold: true, color: "0F172A", size: 28 })
      ]
    }),
    new Paragraph({
      spacing: { before: 0, after: 140 },
      children: [
        new TextRun({ text: "Who uses it: ", bold: true, italics: true, color: "64748B" }),
        new TextRun({ text: who, italics: true, color: "475569" })
      ]
    })
  ];
}

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({ text: "Vitality-OS", bold: true, size: 48, color: "0D9488" }),
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({ text: "Smart Hospital Operating System • Team Functional Guide", bold: true, size: 24, color: "334155" })
        ]
      }),
      new Paragraph({
        spacing: { before: 100, after: 200 },
        children: [
          new TextRun({ 
            text: "Vitality-OS connects every department in the hospital into 6 simple, specialized web apps that communicate with each other in real-time. Here is how each app works in easy-to-understand words for teammates and developers.",
            color: "334155",
            size: 22
          })
        ]
      }),

      // 5-Step Workflow Diagram in text
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 240 },
        children: [
          new TextRun({ 
            text: "[1. Receptionist]  ->  [2. Assistant Triage]  ->  [3. Doctor Room]  ->  [4. Diagnostic Lab]  ->  [5. Patient App]\n(App 6: Hospital Maintenance oversees all beds and wait times)", 
            bold: true, 
            color: "0284C7",
            size: 20
          })
        ]
      }),

      // App 1
      ...createSectionHeader("App 1: Receptionist Desk (Front Gate)", "The front desk staff when someone walks into the hospital."),
      createBullet("Register Patient", "Types the patient's name, phone number, age, gender, and blood group."),
      createBullet("Give MRIN Number", "Generates a permanent hospital ID card number (e.g., VO-2026-00142)."),
      createBullet("Give Queue Token", "Gives the patient a serial token number (e.g., 'You are Token #14, please wait in Anteroom 2')."),
      createBullet("Collect Fee", "Collects cash or digital payments (bKash/Nagad) and prints a money receipt."),
      createBullet("Auto-Send to Assistant", "Once registered, the patient automatically pops up on the Assistant's screen with an audio chime."),

      // App 2
      ...createSectionHeader("App 2: Clinical Assistant (History Taker & Vitals)", "The nurse or triage medical officer who checks the patient before the doctor."),
      createBullet("Check Vitals", "Enters Blood Pressure, Pulse, Body Temperature, Oxygen (SpO2), Height, and Weight."),
      createBullet("Write Down Problems", "Documents what is bothering the patient (e.g., 'Dizzy for 3 days, high fever, chest pain')."),
      createBullet("AI Doctor Matcher", "Valerian AI reads the symptoms and says: 'This looks like a heart problem - recommend Dr. Tariq (Cardiologist)'."),
      createBullet("Send to Doctor's Desk", "Clicks one button to send all vitals and history straight to the Doctor's screen so the doctor doesn't have to re-ask the same basic questions."),

      // App 3
      ...createSectionHeader("App 3: Doctor's Chamber (Consultation Cockpit)", "The specialist doctor inside their consultation chamber."),
      createBullet("See Patient's Full Story", "Shows past hospital visits, old test reports, and the intake notes from the assistant."),
      createBullet("AI Clinical Helper", "Valerian AI looks at the numbers and flags warnings (e.g., 'Warning: Blood pressure is dangerously high; elevated creatinine detected')."),
      createBullet("Search & Order Tests", "Doctor types 'hba1c' or 'ecg' in the search bar, picks from a dropdown, and clicks send. The hospital lab receives the order instantly."),
      createBullet("Make Digital Prescription", "Doctor picks medicines from the DGDA list (e.g., Napa 500mg, Comet 500mg), sets frequency as 1+0+1, and picks 'After food'."),
      createBullet("Generates Dynamic QR Code", "Creates a secure QR code on the prescription so the patient can scan it into their phone."),

      // App 4
      ...createSectionHeader("App 4: Diagnostic Lab (Lab & Imaging Hub)", "Pathologists, blood test technicians, and X-ray/MRI technicians."),
      createBullet("Receive Test Orders", "As soon as the doctor clicks order, the lab sees: 'Patient Rahim needs CBC + Chest X-Ray'."),
      createBullet("Sample Tracker", "Tracks sample progress: Blood Collected -> Running in Machine -> Completed."),
      createBullet("Fast Test Search Bar", "Search any test in seconds across Blood, Kidney, Liver, ECG, CT Scan, and Endoscopy."),
      createBullet("Enter Results", "Types in the numbers (e.g., Hemoglobin: 12.5). If a value is life-threatening, it flashes red and alerts the doctor immediately."),
      createBullet("Instant Push Report", "With one click, the report is instantly visible to both the Doctor and the Patient's app."),

      // App 5
      ...createSectionHeader("App 5: Patient App (Mobile App on Phone)", "The patient (or their family member) on their smartphone."),
      createBullet("Scan QR Code", "Point phone camera at doctor's prescription -> all medicines and times automatically load into the app."),
      createBullet("Medicine Alarms by Body Part", "Reminders are neatly arranged by organ (Heart medicines, Diabetes medicines, Stomach medicines)."),
      createBullet("Double-Dose Lock", "If an elderly patient forgets and tries to mark a pill taken twice within 1 hour, the app locks and says: 'You already took this at 8:00 AM! Do not take it again.'"),
      createBullet("AI Report Translator", "Patient can ask the AI: 'What does my blood report mean in simple Bengali?' and it explains it like a caring friend without jargon."),
      createBullet("Ramadan Fasting Button", "One click moves all daytime medicine alerts to Sehri and Iftar times."),
      createBullet("1-Tap Emergency SOS", "Big red button to call National Emergency 999 or hospital ambulance with live location."),

      // App 6
      ...createSectionHeader("App 6: Hospital Maintenance (Admin Command Center)", "Hospital Director, IT manager, and Head Nurse."),
      createBullet("Live Bed Map", "Shows how many ICU beds, CCU beds, and general ward beds are free right now."),
      createBullet("Wait Time Radar", "Shows if the OPD line or Lab is moving slow and where patients are getting stuck."),
      createBullet("Doctor Shift Rosters", "Shows which doctors and nurses are on duty right now."),
      createBullet("System Health & DGHS FHIR", "Monitors database, national FHIR health exchange, and AI system uptime."),

      // Summary
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 120 },
        children: [
          new TextRun({ text: "The 30-Second Elevator Pitch", bold: true, color: "0F172A", size: 26 })
        ]
      }),
      new Paragraph({
        spacing: { before: 60, after: 200 },
        children: [
          new TextRun({ 
            text: "\"Vitality-OS eliminates paper chaos in hospitals. The receptionist registers the patient, the assistant takes vitals and matches the right doctor, the doctor sees the full history and orders tests digitally, the lab enters results in real time, the patient gets all medicines and reminders directly on their phone with smart safety locks, and hospital management sees live beds and wait times on one central dashboard.\"",
            italics: true,
            bold: true,
            color: "0D9488",
            size: 22
          })
        ]
      })
    ]
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  const outPath1 = path.join(__dirname, 'Vitality-OS_Team_Guide.docx');
  const outPath2 = 'C:\\Users\\LenV\\.gemini\\antigravity\\brain\\49a284dc-0a03-4c05-88b0-26c5a46937e1\\Vitality-OS_Team_Guide.docx';
  
  fs.writeFileSync(outPath1, buffer);
  fs.writeFileSync(outPath2, buffer);
  console.log('Successfully generated Word documents:');
  console.log('1: ' + outPath1);
  console.log('2: ' + outPath2);
});
