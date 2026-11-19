import React, { useState, useRef, MouseEvent } from 'react';
import './CreditCard.css';

export interface CreditCardProps {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  brand?: 'visa' | 'mastercard' | 'hospital_rfid';
  rfidUid?: string;
  balance?: number;
  isProcessing?: boolean;
  isSuccess?: boolean;
  className?: string;
}

export const CreditCard: React.FC<CreditCardProps> = ({
  cardNumber = '•••• •••• •••• 4291',
  cardHolder = 'AARAB CHOWDHURY',
  expiryDate = '09/29',
  brand = 'hospital_rfid',
  rfidUid = 'E2-80-11-53-7A',
  balance = 25000,
  isProcessing = false,
  isSuccess = false,
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-15 to 15 deg)
    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 14;
    
    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className={`credit-card-perspective-container ${className}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`credit-card-3d ${isHovered ? 'hovered' : ''} ${isProcessing ? 'processing' : ''} ${isSuccess ? 'success' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`
        }}
      >
        {/* Dynamic Light Sheen / Glare */}
        <div
          className="credit-card-glare"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%)`
          }}
        />

        {/* Card Header: Hospital Logo & Contactless Wave */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center font-black text-emerald-400 text-sm shadow">
              H+
            </div>
            <div>
              <span className="text-[11px] font-black tracking-widest text-emerald-300 block uppercase">
                {brand === 'hospital_rfid' ? 'VITALITY HEALTHPASS' : 'SMART CARD'}
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                RFID UID: {rfidUid}
              </span>
            </div>
          </div>

          {/* Contactless Waves */}
          <div className="flex items-center gap-1.5">
            <svg className="w-6 h-6 text-emerald-400/80 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 16.5a5 5 0 0 1 0-7" />
              <path d="M12 19a9 9 0 0 1 0-14" />
              <path d="M15.5 21.5a13 13 0 0 1 0-19" />
            </svg>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              13.56MHz
            </span>
          </div>
        </div>

        {/* EMV Gold Chip & Hologram */}
        <div className="flex items-center justify-between my-auto z-10">
          <div className="emv-chip">
            <div className="emv-chip-line" />
            <div className="emv-chip-line" />
          </div>

          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Prepaid Balance</span>
            <span className="font-mono font-black text-base text-emerald-400 tracking-tight">
              ৳ {balance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 16-Digit Card Number */}
        <div className="card-number font-mono tracking-widest text-base sm:text-lg font-bold text-slate-100 z-10 drop-shadow">
          {cardNumber}
        </div>

        {/* Card Footer: Holder Name, Expiry & Network */}
        <div className="flex items-end justify-between z-10 pt-1">
          <div>
            <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Patient / Cardholder</span>
            <span className="font-mono text-xs font-black text-white tracking-wider uppercase">
              {cardHolder}
            </span>
          </div>

          <div className="text-center">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Valid Thru</span>
            <span className="font-mono text-xs font-bold text-slate-200">
              {expiryDate}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-red-500/80 -mr-2" />
            <div className="w-5 h-5 rounded-full bg-amber-500/80" />
          </div>
        </div>

        {/* Status Overlays */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 rounded-2xl animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            <span className="text-xs font-bold text-emerald-300 font-mono tracking-wide">
              AUTHENTICATING RFID...
            </span>
          </div>
        )}

        {isSuccess && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-1.5 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-xl">
              ✓
            </div>
            <span className="text-xs font-black text-white font-mono tracking-wider">
              PAYMENT AUTHORIZED
            </span>
            <span className="text-[10px] text-emerald-300">ESP32 Handshake Confirmed</span>
          </div>
        )}
      </div>
    </div>
  );
};
