
import React from 'react';
import { Table as TableType } from '@/utils/types';

interface PrintableSeatingListProps {
  tables: TableType[];
  eventName: string;
  eventDate: string;
  venue?: string;
}

const PrintableSeatingList = React.forwardRef<HTMLDivElement, PrintableSeatingListProps>(
  ({ tables, eventName, eventDate, venue }, ref) => {
    return (
      <div ref={ref} className="p-8 bg-white hidden print:block">
        <h1 className="text-3xl font-bold text-center mb-2">{eventName}</h1>
        <p className="text-center text-muted-foreground mb-8">
          {eventDate}
          {venue && ` • ${venue}`}
        </p>
        
        <div className="space-y-6">
          {tables.map((table) => (
            <div key={table.id} className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">{table.name}</h2>
              <ul className="grid grid-cols-2 gap-2">
                {table.guests?.map((guest) => (
                  <li key={guest.id} className="text-sm">
                    {guest.name}
                    {guest.dietary_restrictions && (
                      <span className="text-muted-foreground ml-2">
                        ({guest.dietary_restrictions})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

PrintableSeatingList.displayName = 'PrintableSeatingList';

export default PrintableSeatingList;
