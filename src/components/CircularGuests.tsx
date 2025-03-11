
import React from 'react';
import { Guest } from '@/utils/types';

interface CircularGuestsProps {
  guests: Guest[];
  tableSize: number;
}

const CircularGuests = ({ guests, tableSize }: CircularGuestsProps) => {
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
            className="absolute bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-xs font-medium transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `50%`,
              top: `50%`,
              transform: `translate(${x}px, ${y}px)`,
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
