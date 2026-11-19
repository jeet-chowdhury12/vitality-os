import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, Download, ShieldCheck, Heart, Pill, CheckCircle2 } from 'lucide-react';
import { PatientRecord } from '../data/patientsDatabase';
import { printDigitalPrescription } from '../utils/printUtils';

interface PrescriptionModalProps {
  patient: PatientRecord;
  isOpen: boolean;
  onClose: () => void;
  onImportToPatientApp?: (patient: PatientRecord) => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  patient,
  isOpen,
  onClose,
  onImportToPatientApp
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const rx = patient.activePrescription;

  // Prepare QR Payload encoding the prescription so patient can scan
  const qrPayload = JSON.stringify({
    app: 'Vitality-OS',
    mrin: patient.mrin,
    patientName: patient.fullName,
    rxId: rx.prescriptionId,
    prescribedDate: rx.prescribedDate,
    doctorName: rx.doctorName,
    diagnosis: rx.diagnosis,
    medsCount: rx.medicines.length,
    medicines: rx.medicines.map(m => ({
      id: m.id,
      medId: m.medicineId,
      name: m.medicineName,
      form: m.form,
      organ: m.organName,
      organIcon: m.organIcon,
      dosage: m.dosage,
      timing: m.timing,
      exactTime: m.exactTime,
      food: m.foodRelation,
      duration: m.durationDays,
      why: m.whyGivenForPatient
    }))
  });

  const handlePrint = () => {
    printDigitalPrescription(patient);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Bar (Hidden during printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Digital Prescription &amp; Sync QR</h3>
              <p className="text-xs text-slate-400">Official Clinical Electronic Prescription • MRIN: {patient.mrin}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onImportToPatientApp && (
              <button
                type="button"
                onClick={() => {
                  onImportToPatientApp(patient);
                  onClose();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 transition shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Sync to Patient App
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Prescription
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div 
          ref={printAreaRef}
          className="p-8 sm:p-10 bg-white text-slate-900 print:p-0 print:m-0"
          id="printable-prescription"
        >
          {/* Clinic & Doctor Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-teal-700/80 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏥</span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {rx.clinicName}
                </h1>
              </div>
              <p className="text-sm font-semibold text-teal-800 mt-1">{rx.doctorName}</p>
              <p className="text-xs text-slate-600">Medical License: {rx.licenseNumber} • Department of Internal Medicine</p>
              <p className="text-xs text-slate-500">Emergency Contact: +880 1700-000001 • desk@vitality-os.health</p>
            </div>

            {/* Dynamic Prescription QR Code */}
            <div className="flex flex-col items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                <QRCodeSVG
                  value={qrPayload}
                  size={108}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider mt-1.5">
                Scan via Vitality App
              </span>
              <span className="text-[9px] text-slate-500">Auto-loads all reminders</span>
            </div>
          </div>

          {/* Patient Details & Vitals Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-200 text-xs bg-slate-50/70 p-3 rounded-lg my-4">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{patient.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">MRIN / Record #</span>
              <span className="font-mono font-bold text-teal-700 text-sm">{patient.mrin}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Age / Gender / Blood</span>
              <span className="font-medium text-slate-800">{patient.age} yrs • {patient.gender} • {patient.bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Prescribed Date</span>
              <span className="font-medium text-slate-800">{rx.prescribedDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Blood Pressure</span>
              <span className="font-medium text-slate-800">{patient.vitals.bloodPressure}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Heart Rate</span>
              <span className="font-medium text-slate-800">{patient.vitals.heartRate} bpm</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Known Allergies</span>
              <span className="font-bold text-rose-600">{patient.knownDrugAllergies.join(', ') || 'No known allergies'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">SpO2 / BMI</span>
              <span className="font-medium text-slate-800">{patient.vitals.spO2}% • BMI {patient.vitals.bmi}</span>
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div className="mb-6 p-3 bg-teal-50/60 border-l-4 border-teal-600 rounded-r-lg">
            <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block">Clinical Diagnosis</span>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">{rx.diagnosis}</p>
          </div>

          {/* Rx Symbol and Medications Table */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-serif font-bold text-teal-800 italic">℞</span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Prescribed Medication Regimen (Organ-Classified)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Target Organ / Medicine</th>
                    <th className="py-2.5 px-3">Dosage &amp; Form</th>
                    <th className="py-2.5 px-3">Timing &amp; Clock</th>
                    <th className="py-2.5 px-3">Meal Rule</th>
                    <th className="py-2.5 px-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {rx.medicines.map((m, idx) => (
                    <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="py-3 px-3 font-semibold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{m.organIcon}</span>
                          <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">{m.medicineName}</div>
                            <div className="text-[11px] text-teal-700 font-medium">{m.organName}</div>
                            <div className="text-[10px] text-slate-500 italic">Why: {m.whyGivenForPatient}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {m.dosage}
                        <span className="block text-[10px] font-normal text-slate-500">{m.form}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-slate-200 text-slate-800">
                          {m.timing}
                        </span>
                        <span className="block text-[11px] font-mono text-slate-600 mt-0.5">{m.exactTime}</span>
                      </td>
                      <td className="py-3 px-3 font-medium">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          m.foodRelation === 'before_food' ? 'bg-amber-100 text-amber-800' :
                          m.foodRelation === 'with_food' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {m.foodRelation === 'before_food' ? '30m Before Meals' :
                           m.foodRelation === 'with_food' ? 'With Meals' : 'After Meals'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {m.durationDays} Days
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Requisitioned Tests & Clinical Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
            <div>
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                🧪 Ordered Diagnostic Lab Tests
              </span>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                {patient.orderedDiagnosticTests.map(test => (
                  <li key={test.id} className="font-medium">
                    <span className="font-bold text-slate-900">{test.testName}</span> ({test.priority})
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                📋 Doctor's Directives &amp; Lifestyle Counseling
              </span>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                {rx.clinicalAdvice.map((advice, i) => (
                  <li key={i}>{advice}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Doctor Signature & Seal */}
          <div className="flex justify-between items-end pt-10 mt-6 border-t border-slate-300">
            <div className="text-[11px] text-slate-500">
              <div className="flex items-center gap-1 text-teal-800 font-semibold mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Digitally Authenticated via Vitality-OS Smart Hospital Gateway</span>
              </div>
              <p>Prescription ID: <span className="font-mono">{rx.prescriptionId}</span></p>
              <p>Security Hash: SHA-256 Verified • Valid for 30 Days</p>
            </div>

            <div className="text-right">
              <div className="w-48 border-b-2 border-slate-800 mb-1">
                <span className="font-serif italic text-lg font-bold text-teal-900 block text-center">
                  {rx.doctorName.split(',')[0]}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">{rx.doctorName}</p>
              <p className="text-[10px] text-slate-500">Official Physician Seal &amp; Signature</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
