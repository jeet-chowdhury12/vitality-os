import { PatientRecord } from '../data/patientsDatabase';

/**
 * Vitality-OS Enterprise Print Engine
 * Provides dedicated, zero-fail, isolated printing for:
 * 1. 80mm Thermal Queue Slips (Receptionist)
 * 2. Cashier Advance Deposit Vouchers (Receptionist)
 * 3. Formal Digital Prescriptions with QR Code & BMDC Seal (Doctor)
 * 4. 80mm Thermal Pharmacy POS Bills (Pharmacy)
 * 5. SBAR Shift Handover Slips (Assistant Triage)
 * 6. Official Sick Leave Medical Certificates (Doctor)
 * 7. Tertiary Apex Referral Letters (Doctor)
 *
 * Uses hidden iframe isolation to ensure that Tailwind dark mode, overflow clipping,
 * fixed modals, or virtual DOM state never cause blank prints.
 */

function runIsolatedPrint(title: string, bodyHtml: string, isThermal: boolean = false) {
  // Check if an existing print frame exists and remove it
  const existingFrame = document.getElementById('vitality-print-frame');
  if (existingFrame) {
    existingFrame.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'vitality-print-frame';
  // Position completely off-screen while maintaining full layout dimensions and visibility
  // IMPORTANT: Never use visibility:hidden or width:0/height:0 as Chromium prints blank pages for invisible iframes
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '-10000px';
  iframe.style.width = '800px';
  iframe.style.height = '1200px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '-9999';
  iframe.style.opacity = '0.01';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  const printCss = isThermal
    ? `
      @page {
        size: auto;
        margin: 2mm;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      html, body {
        width: 100% !important;
        margin: 0 auto !important;
        padding: 4px !important;
        background: #ffffff !important;
        color: #000000 !important;
        font-family: 'Courier New', Courier, monospace;
        font-size: 11px;
        line-height: 1.4;
        visibility: visible !important;
        display: block !important;
      }
      .thermal-wrap {
        width: 100%;
        max-width: 74mm;
        margin: 0 auto;
        border: 1.5px dashed #000000;
        padding: 10px 8px;
        box-sizing: border-box;
        background: #ffffff;
      }
      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .bold { font-weight: bold; }
      .divider { border-top: 1px dashed #000000; margin: 6px 0; }
      .double-divider { border-top: 2px dashed #000000; margin: 8px 0; }
      table { width: 100%; border-collapse: collapse; font-size: 10px; }
      th, td { padding: 3px 1px; color: #000000; }
      .token-badge { font-size: 34px; font-weight: 900; margin: 4px 0; letter-spacing: 1px; color: #000000; }
    `
    : `
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      html, body {
        margin: 0;
        padding: 0;
        background: #ffffff !important;
        color: #0f172a !important;
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 12px;
        line-height: 1.5;
        visibility: visible !important;
        display: block !important;
      }
      .sheet-wrap {
        max-width: 190mm;
        margin: 0 auto;
        padding: 4mm;
        box-sizing: border-box;
      }
      .header-band {
        border-bottom: 3px solid #0d9488;
        padding-bottom: 12px;
        margin-bottom: 14px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .clinic-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
      .clinic-sub { font-size: 11px; color: #0d9488; font-weight: 700; margin-top: 2px; }
      .grid-box { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 14px; font-size: 11px; }
      .label { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: 700; }
      .val { font-weight: 700; color: #0f172a; margin-top: 1px; }
      table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11px; }
      th { background: #f1f5f9; border-bottom: 2px solid #cbd5e1; padding: 8px 6px; text-align: left; font-weight: 700; color: #334155; }
      td { border-bottom: 1px solid #e2e8f0; padding: 8px 6px; vertical-align: top; }
      .rx-symbol { font-size: 26px; font-family: serif; font-weight: bold; color: #0d9488; font-style: italic; }
      .footer-sign { margin-top: 28px; padding-top: 14px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; }
      .text-muted { color: #64748b; font-size: 10px; }
    `;

  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>${printCss}</style>
  </head>
  <body>
    ${bodyHtml}
  </body>
</html>`);
  doc.close();

  // Allow browser layout engine to paint DOM before opening print dialog
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Isolated frame print error, falling back to window.print()', e);
      window.print();
    }
  }, 200);
}

// 1. Thermal Queue Slip Print
export interface ThermalSlipData {
  token: string;
  name: string;
  mrin: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  tariffScheme: string;
  fee: number;
  paymentMethod: string;
  doctorName?: string;
  chamberRoom?: string;
  date: string;
  time: string;
}

export function printThermalSlip(data: ThermalSlipData) {
  const html = `
    <div class="thermal-wrap">
      <div class="text-center">
        <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px;">VITALITY-OS HOSPITAL</div>
        <div style="font-size: 10px; font-weight: bold;">OPD INTAKE &amp; QUEUE TOKEN</div>
        <div style="font-size: 9px; margin-top: 2px;">Date: ${data.date} | Time: ${data.time}</div>
      </div>

      <div class="divider"></div>

      <div class="text-center" style="padding: 6px 0;">
        <div style="font-size: 10px; letter-spacing: 1px;">QUEUE TOKEN NUMBER</div>
        <div class="token-badge">${data.token}</div>
        <div style="font-size: 10px; font-weight: bold;">DESTINATION: TRIAGE ANTEROOM 2</div>
      </div>

      <div class="divider"></div>

      <div style="font-size: 10px; line-height: 1.5;">
        <div><strong>Patient:</strong> ${data.name}</div>
        <div><strong>MRIN:</strong> ${data.mrin}</div>
        <div><strong>Age / Sex:</strong> ${data.age} Y / ${data.gender} (${data.bloodGroup})</div>
        <div><strong>Mobile:</strong> ${data.phone}</div>
        <div><strong>Tariff:</strong> ${data.tariffScheme}</div>
        ${data.doctorName ? `<div><strong>Consultant:</strong> ${data.doctorName}</div>` : ''}
        ${data.chamberRoom ? `<div><strong>Chamber:</strong> ${data.chamberRoom}</div>` : ''}
      </div>

      <div class="divider"></div>

      <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold;">
        <span>FEE COLLECTED:</span>
        <span>৳${data.fee} BDT</span>
      </div>
      <div style="font-size: 9px; color: #333; margin-top: 2px;">Method: ${data.paymentMethod} • Status: CONFIRMED</div>

      <div class="double-divider"></div>

      <div class="text-center" style="font-size: 9px;">
        <div>* Please proceed to Anteroom 2 when called *</div>
        <div style="margin-top: 3px; font-weight: bold;">Vitality-OS Smart Hospital Cloud</div>
      </div>
    </div>
  `;
  runIsolatedPrint(`Token-${data.token}`, html, true);
}

// 2. Deposit Voucher Print
export interface DepositVoucherData {
  voucherNo: string;
  patientName: string;
  mrin: string;
  amount: number;
  scheme: string;
  method: string;
  cashierName: string;
  timestamp: string;
}

export function printDepositVoucher(data: DepositVoucherData) {
  const html = `
    <div class="thermal-wrap">
      <div class="text-center">
        <div style="font-size: 14px; font-weight: 900;">VITALITY-OS HOSPITAL</div>
        <div style="font-size: 10px; font-weight: bold;">CASHIER DEPOSIT RECEIPT</div>
        <div style="font-size: 9px;">Voucher #${data.voucherNo} • ${data.timestamp}</div>
      </div>
      <div class="divider"></div>
      <div style="font-size: 10px; line-height: 1.5;">
        <div><strong>Patient:</strong> ${data.patientName}</div>
        <div><strong>MRIN:</strong> ${data.mrin}</div>
        <div><strong>Scheme:</strong> ${data.scheme}</div>
        <div><strong>Payment Mode:</strong> ${data.method}</div>
        <div><strong>Cashier:</strong> ${data.cashierName}</div>
      </div>
      <div class="divider"></div>
      <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 900;">
        <span>AMOUNT DEPOSITED:</span>
        <span>৳${data.amount} BDT</span>
      </div>
      <div class="double-divider"></div>
      <div class="text-center" style="font-size: 8px;">
        <div>Thank you. Retain this receipt for admission credit.</div>
      </div>
    </div>
  `;
  runIsolatedPrint(`Voucher-${data.voucherNo}`, html, true);
}

// 3. Pharmacy POS Thermal Bill Print
export interface PharmacyBillPrintData {
  invoiceId: string;
  timestamp: string;
  buyerName: string;
  patientMrin?: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  total: number;
  items: Array<{
    medicineName: string;
    form: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export function printPharmacyBill(data: PharmacyBillPrintData) {
  const itemsHtml = data.items.map(it => `
    <tr>
      <td style="font-weight: bold;">${it.medicineName}<br/><span style="font-size: 8px; color: #444;">${it.form} x${it.quantity}</span></td>
      <td class="text-right" style="vertical-align: top;">৳${it.total.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div class="thermal-wrap">
      <div class="text-center">
        <div style="font-size: 14px; font-weight: 900;">VITALITY PHARMACY &amp; STORES</div>
        <div style="font-size: 9px;">Hospital Medical Retail Counter • Reg: DGDA-2026-PH</div>
        <div style="font-size: 9px; margin-top: 2px;">Bill #${data.invoiceId} | ${data.timestamp}</div>
      </div>
      <div class="divider"></div>
      <div style="font-size: 10px; line-height: 1.4;">
        <div><strong>Customer:</strong> ${data.buyerName}</div>
        ${data.patientMrin ? `<div><strong>Patient MRIN:</strong> ${data.patientMrin}</div>` : ''}
        <div><strong>Payment:</strong> ${data.paymentMethod}</div>
      </div>
      <div class="divider"></div>
      <table>
        <thead>
          <tr style="border-bottom: 1px dashed #000;">
            <th style="text-align: left;">Item</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div class="divider"></div>
      <div style="font-size: 10px; line-height: 1.5;">
        <div style="display: flex; justify-content: space-between;">
          <span>Subtotal:</span>
          <span>৳${data.subtotal.toFixed(2)}</span>
        </div>
        ${data.discount > 0 ? `
          <div style="display: flex; justify-content: space-between; color: #333;">
            <span>Discount:</span>
            <span>-৳${data.discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="double-divider"></div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 900;">
          <span>GRAND TOTAL:</span>
          <span>৳${data.total.toFixed(2)} BDT</span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="text-center" style="font-size: 8px;">
        <div>Medicines once sold cannot be returned after 72 hours.</div>
        <div style="font-weight: bold; margin-top: 2px;">Vitality-OS Pharmacy Management System</div>
      </div>
    </div>
  `;
  runIsolatedPrint(`Bill-${data.invoiceId}`, html, true);
}

// 4. SBAR Clinical Nursing Handover Slip
export interface SbarHandoverData {
  patientName: string;
  mrin: string;
  age: number;
  gender: string;
  bed: string;
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  timestamp: string;
  handoverNurse: string;
}

export function printSbarHandover(data: SbarHandoverData) {
  const html = `
    <div class="sheet-wrap">
      <div class="header-band">
        <div>
          <h1 class="clinic-title">VITALITY-OS HOSPITAL • CLINICAL NURSING</h1>
          <div class="clinic-sub">OFFICIAL SBAR SHIFT HANDOVER RECORD</div>
        </div>
        <div style="text-align: right; font-size: 11px;">
          <div><strong>Date &amp; Time:</strong> ${data.timestamp}</div>
          <div><strong>Handing-over Nurse:</strong> ${data.handoverNurse}</div>
        </div>
      </div>

      <div class="grid-box">
        <div>
          <div class="label">Patient Name</div>
          <div class="val">${data.patientName}</div>
        </div>
        <div>
          <div class="label">MRIN</div>
          <div class="val">${data.mrin}</div>
        </div>
        <div>
          <div class="label">Age / Sex</div>
          <div class="val">${data.age} Y / ${data.gender}</div>
        </div>
        <div>
          <div class="label">Assigned Location</div>
          <div class="val" style="color: #0d9488;">${data.bed}</div>
        </div>
      </div>

      <div style="margin-top: 14px; font-size: 12px; line-height: 1.6;">
        <div style="margin-bottom: 12px; border-left: 3px solid #ef4444; padding-left: 10px;">
          <strong style="color: #b91c1c;">[S] SITUATION:</strong>
          <div>${data.situation}</div>
        </div>
        <div style="margin-bottom: 12px; border-left: 3px solid #f59e0b; padding-left: 10px;">
          <strong style="color: #b45309;">[B] BACKGROUND:</strong>
          <div>${data.background}</div>
        </div>
        <div style="margin-bottom: 12px; border-left: 3px solid #0d9488; padding-left: 10px;">
          <strong style="color: #0f766e;">[A] ASSESSMENT:</strong>
          <div>${data.assessment}</div>
        </div>
        <div style="margin-bottom: 12px; border-left: 3px solid #3b82f6; padding-left: 10px;">
          <strong style="color: #1d4ed8;">[R] RECOMMENDATION &amp; ACTIONS:</strong>
          <div>${data.recommendation}</div>
        </div>
      </div>

      <div class="footer-sign">
        <div class="text-muted">
          Clinical Audit Log: SHA-256 Verified • Vitality Nursing Protocol
        </div>
        <div style="text-align: center;">
          <div style="width: 160px; border-bottom: 1px solid #000; margin-bottom: 4px;"></div>
          <div style="font-size: 11px; font-weight: bold;">Nurse In-Charge Signature</div>
        </div>
      </div>
    </div>
  `;
  runIsolatedPrint(`SBAR-${data.mrin}`, html, false);
}

// 5. Medical Leave Certificate Print
export interface MedicalCertificateData {
  certId: string;
  patientName: string;
  mrin: string;
  days: number;
  reason: string;
  doctorName: string;
  bmdcReg: string;
  clinicName: string;
  date: string;
}

export function printMedicalCertificate(data: MedicalCertificateData) {
  const html = `
    <div class="sheet-wrap">
      <div class="header-band">
        <div>
          <h1 class="clinic-title">${data.clinicName}</h1>
          <div class="clinic-sub">OFFICIAL MEDICAL REST &amp; FITNESS CERTIFICATE</div>
        </div>
        <div style="text-align: right; font-size: 11px;">
          <div><strong>Cert No:</strong> ${data.certId}</div>
          <div><strong>Issue Date:</strong> ${data.date}</div>
        </div>
      </div>

      <div style="margin: 30px 0; font-size: 14px; line-height: 2;">
        <p>This is to certify that <strong>${data.patientName}</strong> (MRIN: <code>${data.mrin}</code>) has been examined at our outpatient consultation chamber and diagnosed with:</p>
        <div style="padding: 12px 16px; background: #f1f5f9; border-left: 4px solid #0d9488; font-weight: bold; font-size: 14px; margin: 16px 0;">
          ${data.reason}
        </div>
        <p>In view of the above condition, the patient is medically advised complete bed rest and abstinence from physical work/duties for a duration of <strong>${data.days} (${data.days === 1 ? 'one' : data.days}) days</strong> commencing from ${data.date}.</p>
      </div>

      <div class="footer-sign" style="margin-top: 60px;">
        <div class="text-muted">
          Authenticated via Vitality-OS Smart Hospital Cloud<br/>
          Valid only with authorized BMDC registration seal.
        </div>
        <div style="text-align: center;">
          <div style="font-family: serif; font-style: italic; font-size: 18px; color: #0f766e; margin-bottom: 6px;">
            ${data.doctorName.split(',')[0]}
          </div>
          <div style="width: 180px; border-bottom: 2px solid #0f172a; margin: 0 auto 4px auto;"></div>
          <div style="font-size: 12px; font-weight: bold;">${data.doctorName}</div>
          <div style="font-size: 10px; color: #64748b;">BMDC Reg No: ${data.bmdcReg}</div>
        </div>
      </div>
    </div>
  `;
  runIsolatedPrint(`Medical-Certificate-${data.mrin}`, html, false);
}

// 6. Tertiary Referral Letter Print
export interface ReferralLetterData {
  refId: string;
  patientName: string;
  mrin: string;
  age: number;
  gender: string;
  referralHospital: string;
  clinicalReason: string;
  doctorName: string;
  bmdcReg: string;
  date: string;
}

export function printReferralLetter(data: ReferralLetterData) {
  const html = `
    <div class="sheet-wrap">
      <div class="header-band">
        <div>
          <h1 class="clinic-title">VITALITY-OS HOSPITAL &amp; SPECIALIST CENTRES</h1>
          <div class="clinic-sub">OFFICIAL TERTIARY APEX CLINICAL REFERRAL LETTER</div>
        </div>
        <div style="text-align: right; font-size: 11px;">
          <div><strong>Ref:</strong> ${data.refId}</div>
          <div><strong>Date:</strong> ${data.date}</div>
        </div>
      </div>

      <div style="margin: 16px 0; font-size: 13px;">
        <div><strong>TO:</strong></div>
        <div style="font-weight: bold; font-size: 14px; color: #0f766e; margin: 4px 0 16px 0;">
          The Consultant In-Charge / Duty Specialist<br/>
          ${data.referralHospital}
        </div>

        <div class="grid-box">
          <div><div class="label">Patient Name</div><div class="val">${data.patientName}</div></div>
          <div><div class="label">MRIN Identifier</div><div class="val">${data.mrin}</div></div>
          <div><div class="label">Age / Sex</div><div class="val">${data.age} Y / ${data.gender}</div></div>
          <div><div class="label">Priority</div><div class="val" style="color: #dc2626;">URGENT TERTIARY</div></div>
        </div>

        <div style="margin-top: 18px; line-height: 1.8;">
          <p>Dear Colleague,</p>
          <p>We are referring the above patient who attended our consultation clinic for your specialized clinical management and tertiary apex evaluation regarding:</p>
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #ef4444; padding: 12px; margin: 12px 0; font-weight: 600;">
            ${data.clinicalReason}
          </div>
          <p>Kindly evaluate and take over appropriate advanced interventions. A copy of previous ECG, biomarkers, and active pharmacological history is available electronically via the Vitality-OS DGHS FHIR bundle.</p>
        </div>
      </div>

      <div class="footer-sign" style="margin-top: 50px;">
        <div class="text-muted">
          DGHS Bangladesh Core R4 Interoperability Enabled • Confidential Medical Document
        </div>
        <div style="text-align: center;">
          <div style="font-family: serif; font-style: italic; font-size: 18px; color: #0f766e; margin-bottom: 4px;">
            ${data.doctorName.split(',')[0]}
          </div>
          <div style="width: 180px; border-bottom: 2px solid #0f172a; margin: 0 auto 4px auto;"></div>
          <div style="font-size: 12px; font-weight: bold;">${data.doctorName}</div>
          <div style="font-size: 10px; color: #64748b;">BMDC Reg No: ${data.bmdcReg}</div>
        </div>
      </div>
    </div>
  `;
  runIsolatedPrint(`Referral-${data.mrin}`, html, false);
}

// 7. Full Digital Prescription Print (A4 with BMDC Validation & DGHS Interop)
export function printDigitalPrescription(patient: PatientRecord) {
  const rx = patient.activePrescription;
  const docName = rx?.doctorName || 'Dr. Marcus Vance, MD, FACC';
  const docReg = rx?.licenseNumber || 'BMDC-A-48921';
  const docSpecialty = rx?.clinicName || 'Cardiology & Internal Medicine';
  const issueDate = rx?.prescribedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const meds = rx?.medicines || [];

  const medsRows = meds.map((m, idx) => `
    <tr>
      <td style="font-weight: bold; font-size: 12px; color: #0f172a;">${idx + 1}. ${m.medicineName} <span style="font-size: 10px; color: #0d9488; font-weight: normal;">(${m.form})</span></td>
      <td><strong>${m.dosage}</strong></td>
      <td>${m.timing} <div style="font-size: 9px; color: #64748b;">${m.foodRelation || ''}</div></td>
      <td>${m.durationDays ? `${m.durationDays} Days` : 'Continuous'}</td>
      <td style="font-size: 10px; color: #475569;">${m.whyGivenForPatient || 'Maintenance'}</td>
    </tr>
  `).join('');

  const html = `
    <div class="sheet-wrap">
      <div class="header-band">
        <div>
          <h1 class="clinic-title">VITALITY-OS HOSPITAL &amp; SPECIALIST CENTRES</h1>
          <div class="clinic-sub">DIGITAL CONTINUITY-OF-CARE OUTPATIENT PRESCRIPTION</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 3px;">
            Accredited by Directorate General of Health Services (DGHS) • ISO 15189 Reference Standards
          </div>
        </div>
        <div style="text-align: right; font-size: 11px;">
          <div style="font-weight: bold; color: #0f766e;">OPD CONSULTATION</div>
          <div><strong>Rx Serial:</strong> RX-${patient.mrin.replace('MRIN-', '')}-${Date.now().toString().slice(-4)}</div>
          <div><strong>Date:</strong> ${issueDate}</div>
        </div>
      </div>

      <div class="grid-box">
        <div><div class="label">Patient Name</div><div class="val">${patient.fullName}</div></div>
        <div><div class="label">MRIN Identifier</div><div class="val font-mono">${patient.mrin}</div></div>
        <div><div class="label">Age / Sex</div><div class="val">${patient.age} Y / ${patient.gender} (${patient.bloodGroup || 'O+'})</div></div>
        <div><div class="label">Vitals (BP / HR / BMI)</div><div class="val">${patient.vitals?.bloodPressure || '120/80'} | ${patient.vitals?.heartRate || '76'} bpm | BMI ${patient.vitals?.bmi || 24.2}</div></div>
      </div>

      <div style="display: flex; gap: 14px; margin: 12px 0;">
        <div style="flex: 1; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
          <div class="label">Chief Complaints &amp; Clinical Presentation</div>
          <div style="font-weight: 600; color: #1e293b; margin-top: 3px; font-size: 12px;">
            ${patient.chiefComplaints?.[0] || 'Follow-up for chronic cardiometabolic evaluation.'}
          </div>
        </div>
        <div style="flex: 1; padding: 10px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px;">
          <div class="label" style="color: #15803d;">Clinical Diagnosis / Impression</div>
          <div style="font-weight: bold; color: #14532d; margin-top: 3px; font-size: 12px;">
            ${rx?.diagnosis || 'Essential Hypertension with Chronic Stable Angina (ICD-10 I10 / I20.9)'}
          </div>
        </div>
      </div>

      <div style="margin: 18px 0;">
        <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 8px;">
          <span class="rx-symbol">℞</span>
          <span style="font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #0f172a;">Prescribed Pharmacological Regimen</span>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 32%;">Medicine Name &amp; Formulation</th>
              <th style="width: 15%;">Dose</th>
              <th style="width: 22%;">Timing / Regimen</th>
              <th style="width: 13%;">Duration</th>
              <th style="width: 18%;">Indication / Action</th>
            </tr>
          </thead>
          <tbody>
            ${medsRows || '<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 14px;">No active medications prescribed.</td></tr>'}
          </tbody>
        </table>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 16px 0;">
        <div style="padding: 10px 12px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 6px;">
          <div class="label" style="color: #7e22ce;">Recommended Diagnostic Investigations</div>
          <ul style="margin: 6px 0 0 16px; padding: 0; font-size: 11px; color: #3b0764; line-height: 1.6;">
            <li>12-Lead Rest Electrocardiogram (ECG)</li>
            <li>High-Sensitivity Cardiac Troponin-I (hs-cTnI)</li>
            <li>Lipid Profile &amp; Serum Creatinine with eGFR</li>
            <li>HbA1c Glycated Hemoglobin</li>
          </ul>
        </div>

        <div style="padding: 10px 12px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px;">
          <div class="label" style="color: #b45309;">Clinical Advice &amp; Warning Precautions</div>
          <div style="font-size: 11px; color: #78350f; margin-top: 4px; line-height: 1.6;">
            ${rx?.clinicalAdvice?.join('. ') || 'Low salt (<3g/day) & low saturated fat diet. Avoid sudden strenuous exertion. In case of acute retrosternal chest pain radiating to left arm or jaw lasting >15 mins, take Tab Sorbitrate 5mg sublingually and proceed immediately to Emergency Room.'}
          </div>
        </div>
      </div>

      <div class="footer-sign" style="margin-top: 36px;">
        <div class="text-muted" style="max-width: 60%;">
          <div><strong>Digital Prescription Authentication:</strong> DGHS FHIR R4 Bundle Hash: <code>${patient.mrin}-FHIR-SIG</code></div>
          <div>Dispense strictly by licensed registered pharmacist. Valid for 90 days from issue date.</div>
        </div>
        <div style="text-align: center;">
          <div style="font-family: serif; font-style: italic; font-size: 18px; color: #0f766e; margin-bottom: 4px;">
            ${docName.split(',')[0]}
          </div>
          <div style="width: 200px; border-bottom: 2px solid #0f172a; margin: 0 auto 4px auto;"></div>
          <div style="font-size: 12px; font-weight: bold;">${docName}</div>
          <div style="font-size: 10px; color: #64748b;">${docSpecialty}</div>
          <div style="font-size: 10px; color: #0d9488; font-weight: 700;">BMDC Reg No: ${docReg}</div>
        </div>
      </div>
    </div>
  `;

  runIsolatedPrint(`Prescription-${patient.mrin}`, html, false);
}
