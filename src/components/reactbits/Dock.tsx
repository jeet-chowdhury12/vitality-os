import React, { useRef, useState, ReactNode, CSSProperties } from 'react';
import './Dock.css';

export interface DockItemData {
  icon?: ReactNode;
  label?: string;
  active?: boolean;
  badge?: number | string | boolean;
  onClick?: () => void;
  separator?: boolean;
  className?: string;
}

export interface DockProps {
  items: DockItemData[];
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  gap?: number;
  showLabels?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const Dock: React.FC<DockProps> = ({
  items = [],
  baseItemSize = 48,
  magnification = 68,
  distance = 140,
  panelHeight = 64,
  gap = 10,
  showLabels = true,
  className = '',
  style
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [bouncingIndex, setBouncingIndex] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left);
    }
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  const handleClick = (item: DockItemData, idx: number) => {
    setBouncingIndex(idx);
    setTimeout(() => setBouncingIndex(null), 450);
    item.onClick?.();
  };

  return (
    <div className={`dock-container ${className}`} style={style}>
      <div
        ref={dockRef}
        className="dock-panel"
        style={{ minHeight: `${panelHeight}px`, gap: `${gap}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {items.map((item, idx) => {
          if (item.separator) {
            return <div key={`sep-${idx}`} className="dock-separator" />;
          }

          // Calculate magnification size
          let size = baseItemSize;
          if (mouseX !== null && dockRef.current) {
            // Approx position of item center
            const itemCenter = idx * (baseItemSize + gap) + baseItemSize / 2 + 14;
            const dist = Math.abs(mouseX - itemCenter);
            if (dist < distance) {
              const factor = (1 - dist / distance) ** 1.5;
              size = baseItemSize + (magnification - baseItemSize) * factor;
            }
          }

          const isBouncing = bouncingIndex === idx;

          return (
            <button
              key={`dock-${idx}-${item.label}`}
              type="button"
              className={`dock-item ${item.active ? 'dock-item--active' : ''} ${isBouncing ? 'dock-item-bounce' : ''} ${item.className || ''}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                fontSize: `${size * 0.44}px`
              }}
              onClick={() => handleClick(item, idx)}
              title={item.label}
              aria-label={item.label}
            >
              {item.icon}

              {showLabels && item.label && (
                <span className="dock-label-tooltip">{item.label}</span>
              )}

              {item.badge !== undefined && item.badge !== null && item.badge !== false && (
                <span className="dock-badge">
                  {typeof item.badge === 'boolean' ? '' : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
