
import React from 'react';
import { Guest } from '@/utils/types';

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
        const radius = (tableSize / 2) + 30; // Increased offset for better spacing
        const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
        const y = radius * Math.sin((angle - 90) * (Math.PI / 180));
        
        return (
          <div
            key={guest.id}
            className="absolute rounded-full w-8 h-8 flex items-center justify-center text-xs font-medium bg-white/90 border border-primary/20 shadow-sm transition-all duration-200 hover:scale-110"
            style={{
              left: `${position.x + tableSize/2 + x}px`,
              top: `${position.y + tableSize/2 + y}px`,
              transform: 'translate(-50%, -50%)',
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
