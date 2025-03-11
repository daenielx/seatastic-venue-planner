
import React from 'react';
import { Guest } from '@/utils/types';
import { Heart } from 'lucide-react';

interface CircularGuestsProps {
  guests: Guest[];
  tableSize: number;
  position: { x: number, y: number };
}

const CircularGuests = ({ guests, tableSize, position }: CircularGuestsProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {guests.map((guest, index) => {
        const angle = (index * 360) / guests.length;
        const radius = (tableSize / 2) + 20; // 20px offset from table edge
        const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
        const y = radius * Math.sin((angle - 90) * (Math.PI / 180));
        
        return (
          <div
            key={guest.id}
            className="absolute rounded-full w-9 h-9 flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110 shadow-sm"
            style={{
              left: `${position.x + tableSize/2 + x}px`,
              top: `${position.y + tableSize/2 + y}px`,
              background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
              border: '1px solid rgba(255,255,255,0.5)',
            }}
            title={guest.name}
          >
            {getInitials(guest.name)}
          </div>
        );
      })}
    </>
  );
};

export default CircularGuests;
