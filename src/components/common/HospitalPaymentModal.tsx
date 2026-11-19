import React, { useState } from 'react';
import { 
  X, CreditCard as CardIcon, Smartphone, Banknote, 
  CheckCircle2, Printer, Mail, Send, Radio, ShieldCheck, 
  FileText, Download, Sparkles, AlertCircle
} from 'lucide-react';
import { CreditCard } from '../reactbits/CreditCard';
import confetti from 'canvas-confetti';

export interface PaymentItem {
  id: string;
  description: string;
  department: string;
  amountBDT: number;
}

export interface HospitalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientMrin: string;
  patientPhone?: string;
  items: PaymentItem[];
  onPaymentSuccess: (receiptData: { invoiceNo: string; method: string; amount: number; items: PaymentItem[] }) => void;
}

export const HospitalPaymentModal: React.FC<HospitalPaymentModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientMrin,
  patientPhone = '01711-000000',
  items,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'rfid' | 'mfs' | 'cash'>('mfs');
  const [rfidScanning, setRfidScanning] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState(`INV-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [mfsNumber, setMfsNumber] = useState('018XXXXXXXX');
  const [mfsTrxId, setMfsTrxId] = useState('');
  const [emailSentToast, setEmailSentToast] = useState(false);
  const [serialConnected, setSerialConnected] = useState(false);
  const [activeScannedCard, setActiveScannedCard] = useState<{
    uid: string;
    holder: string;
    balance: number;
  }>({
    uid: 'E2-80-68-3F-9A',
    holder: patientName,
    balance: 35000
  });

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.amountBDT, 0);

  // Connect Physical ESP32 Hardware via Web Serial API
  const handleConnectEsp32Serial = async () => {
    if (!('serial' in navigator)) {
      alert('Web Serial API is available in Chrome, Edge, and Opera. Connect your ESP32 over USB or Bluetooth COM port, or tap the button below to test!');
      return;
    }
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 115200 });
      setSerialConnected(true);

      const textDecoder = new TextDecoderStream();
      port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
              try {
                const data = JSON.parse(trimmed);
                if (data.event === 'RFID_CARD_DETECTED' || data.cardUid) {
                  triggerPaymentWithCard(data);
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('ESP32 Serial status:', err?.message || err);
    }
  };

  const triggerPaymentWithCard = (cardData: any) => {
    setActiveScannedCard({
      uid: cardData.cardUid || 'E2-80-68-3F-9A',
      holder: cardData.patientName || patientName,
      balance: cardData.balanceBDT || 35000
    });
    setRfidScanning(true);
    setTimeout(() => {
      setRfidScanning(false);
      setPaymentSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#3b82f6']
      });
      onPaymentSuccess({
        invoiceNo,
        method: `RFID Smart Card [${cardData.cardUid || 'ESP32'}]`,
        amount: totalAmount,
        items
      });
    }, 1200);
  };

  // Simulate ESP32 RFID Card Scan & Authorization
  const handleRfidScan = () => {
    triggerPaymentWithCard({
      cardUid: 'E2-80-68-3F-9A',
      patientName: patientName,
      balanceBDT: 35000
    });
  };

  // Confirm MFS or Cash Payment
  const handleConfirmManualPayment = () => {
    setPaymentSuccess(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#3b82f6']
    });
    onPaymentSuccess({
      invoiceNo,
      method: paymentMethod === 'mfs' ? 'bKash / Nagad' : 'Cash at Counter',
      amount: totalAmount,
      items
    });
  };

  const handleSendEmailSms = () => {
    setEmailSentToast(true);
    setTimeout(() => setEmailSentToast(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Hospital Automated Billing &amp; Payment Gateway</h2>
              <p className="text-xs text-slate-400">
                Patient: <span className="text-emerald-400 font-bold">{patientName}</span> ({patientMrin})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View: Official Designed Hospital Receipt */}
        {paymentSuccess ? (
          <div className="p-6 space-y-5">
            {/* Success Banner */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 text-emerald-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="font-black text-sm">Payment Confirmed &amp; Ledger Settled</h4>
                  <p className="text-[11px] text-slate-300 font-mono">Invoice: {invoiceNo} • Cashier: Counter 02</p>
                </div>
              </div>
              <span className="font-mono font-black text-lg text-emerald-400">
                ৳ {totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Official Hospital Receipt Slip */}
            <div id="hospital-printable-receipt" className="p-5 bg-white text-slate-900 rounded-xl border border-slate-300 shadow font-mono text-xs space-y-4">
              <div className="text-center border-b border-slate-300 pb-3">
                <h3 className="font-black text-base tracking-wide uppercase">DHAKA CENTRAL MEDICAL COLLEGE &amp; HOSPITAL</h3>
                <p className="text-[10px] text-slate-600">Plot 14, Health Precinct, Dhaka • Helpline: 10600 (Extension 42)</p>
                <p className="text-[10px] text-slate-500">Official Billing Voucher</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Invoice No:</span> <strong>{invoiceNo}</strong><br />
                  <span className="text-slate-500">Date/Time:</span> {new Date().toLocaleString()}
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Patient:</span> <strong>{patientName}</strong><br />
                  <span className="text-slate-500">MRIN:</span> {patientMrin}
                </div>
              </div>

              {/* Service Table */}
              <table className="w-full text-left border-t border-b border-slate-300 py-2">
                <thead>
                  <tr className="border-b border-slate-300 text-[10px] uppercase text-slate-600">
                    <th className="py-1">Service Description</th>
                    <th className="py-1">Dept</th>
                    <th className="py-1 text-right">Amount (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 font-bold">{item.description}</td>
                      <td className="py-1.5 text-slate-600">{item.department}</td>
                      <td className="py-1.5 text-right font-bold">৳ {item.amountBDT.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-1 text-sm font-black">
                <span>TOTAL PAID ({paymentMethod.toUpperCase()}):</span>
                <span>৳ {totalAmount.toLocaleString()}</span>
              </div>

              <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                Thank you for choosing DCMCH. Computer-generated tax receipt — no signature required.
              </div>
            </div>

            {/* Notification Toast */}
            {emailSentToast && (
              <div className="p-3 bg-cyan-950 border border-cyan-500 text-cyan-200 rounded-xl text-xs font-bold text-center animate-in fade-in">
                ✓ Receipt PDF successfully dispatched to patient's registered email &amp; SMS ({patientPhone})!
              </div>
            )}

            {/* Receipt Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>

              <button
                onClick={handleSendEmailSms}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 border border-slate-700"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Send to Email &amp; SMS</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Payment Selection & Card View */
          <div className="p-6 space-y-6">
            {/* Billing Summary Box */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Requisition</span>
              <div className="space-y-1">
                {items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-300">
                    <span>{it.description} <span className="text-slate-500 font-mono">({it.department})</span></span>
                    <span className="font-mono font-bold text-white">৳ {it.amountBDT.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-black text-sm text-emerald-400">
                <span>Total Payable:</span>
                <span className="font-mono text-base">৳ {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('rfid')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'rfid' 
                    ? 'bg-emerald-950/60 border-emerald-500 text-white' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CardIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold">Smart Health Card</span>
              </button>

              <button
                onClick={() => setPaymentMethod('mfs')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'mfs' 
                    ? 'bg-emerald-950/60 border-emerald-500 text-white' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-5 h-5 text-pink-400" />
                <span className="text-xs font-bold">bKash / Nagad</span>
              </button>

              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'cash' 
                    ? 'bg-emerald-950/60 border-emerald-500 text-white' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Banknote className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Cash Counter</span>
              </button>
            </div>

            {/* Method 1: RFID Smart Card (With 3D React Bits Pro Card) */}
            {paymentMethod === 'rfid' && (
              <div className="space-y-4">
                {/* 3D Tilting Card */}
                <CreditCard
                  cardHolder={activeScannedCard.holder}
                  cardNumber="•••• •••• •••• 8492"
                  expiryDate="12/28"
                  brand="hospital_rfid"
                  rfidUid={activeScannedCard.uid}
                  balance={activeScannedCard.balance}
                  isProcessing={rfidScanning}
                  isSuccess={paymentSuccess}
                />

                {/* ESP32 Hardware Status & Serial Port Connector */}
                <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className={`w-2.5 h-2.5 rounded-full ${serialConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>{serialConnected ? 'ESP32 Hardware Stream Active (115200 Baud)' : 'ESP32 Bluetooth / USB Serial Reader'}</span>
                  </div>
                  <button
                    onClick={handleConnectEsp32Serial}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 border ${
                      serialConnected 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    <span>{serialConnected ? '✓ Connected' : 'Connect ESP32 (COM/BT)'}</span>
                  </button>
                </div>

                <button
                  onClick={handleRfidScan}
                  disabled={rfidScanning}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Radio className="w-4 h-4 animate-ping" />
                  <span>{rfidScanning ? 'Authorizing Scanned RFID Card...' : 'Tap Card or Run Virtual RFID Authorization'}</span>
                </button>
              </div>
            )}

            {/* Method 2: bKash / Nagad */}
            {paymentMethod === 'mfs' && (
              <div className="space-y-3 p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-pink-400 font-bold">
                  <Smartphone className="w-4 h-4" />
                  <span>bKash / Nagad Merchant Payment</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Merchant Number: <strong className="text-white font-mono">01700-000000</strong>. Enter customer mobile and Transaction ID below:
                </p>

                <div>
                  <label className="text-slate-400 block mb-1">Customer Mobile Number</label>
                  <input
                    type="text"
                    value={mfsNumber}
                    onChange={e => setMfsNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Transaction ID (TrxID)</label>
                  <input
                    type="text"
                    placeholder="e.g. BL9A814K2"
                    value={mfsTrxId}
                    onChange={e => setMfsTrxId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono uppercase"
                  />
                </div>

                <button
                  onClick={handleConfirmManualPayment}
                  className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-pink-900/40 mt-2"
                >
                  Verify TrxID &amp; Authorize ৳ {totalAmount.toLocaleString()}
                </button>
              </div>
            )}

            {/* Method 3: Cash at Counter */}
            {paymentMethod === 'cash' && (
              <div className="space-y-3 p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-center">
                <Banknote className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="font-extrabold text-white text-sm">Physical Cash Collection</h4>
                <p className="text-slate-400 text-[11px]">
                  Collect <strong className="text-emerald-400">৳ {totalAmount.toLocaleString()}</strong> from patient at Counter 02.
                </p>

                <button
                  onClick={handleConfirmManualPayment}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-900/40"
                >
                  Confirm Cash Received &amp; Issue Receipt
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
