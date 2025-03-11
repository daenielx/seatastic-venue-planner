import React from 'react';
import { Table as TableType } from '@/utils/types';

interface PrintableSeatingListProps {
  tables: TableType[];
  eventName: string;
  eventDate: string;
  venue?: string;
  design?: 'elegant' | 'modern' | 'classic';
}

const PrintableSeatingList = React.forwardRef<HTMLDivElement, PrintableSeatingListProps>(
  ({ tables, eventName, eventDate, venue, design = 'elegant' }, ref) => {
    const getDesignClasses = () => {
      switch (design) {
        case 'modern':
          return {
            container: 'print:block hidden p-8 bg-gradient-to-br from-gray-50 to-gray-100',
            title: 'text-4xl font-bold text-gray-800 mb-4',
            subtitle: 'text-2xl font-light text-gray-600',
            tableTitle: 'text-xl font-bold text-gray-700 border-b-2 border-gray-300 pb-2 mb-3',
            guestName: 'text-sm text-gray-600'
          };
        case 'classic':
          return {
            container: 'print:block hidden p-8 bg-cream',
            title: 'text-4xl font-serif text-gray-900 mb-4',
            subtitle: 'text-2xl font-serif text-gray-700',
            tableTitle: 'text-xl font-serif text-gray-800 border-b border-gray-400 pb-2 mb-3',
            guestName: 'text-sm font-serif text-gray-700'
          };
        default: // elegant
          return {
            container: 'print:block hidden p-8 bg-white relative',
            title: 'text-4xl font-light text-amber-700 mb-4',
            subtitle: 'text-3xl font-semibold text-gray-700',
            tableTitle: 'text-xl font-semibold text-amber-800 border-b border-amber-200 pb-2 mb-3',
            guestName: 'text-sm text-gray-700'
          };
      }
    };

    const classes = getDesignClasses();

    return (
      <div ref={ref} className={classes.container}>
        {design === 'elegant' && (
          <>
            <div className="absolute top-0 left-0 w-64 h-64 opacity-30">
              <img 
                src="/lovable-uploads/d29c9ba0-2517-4098-89fd-4b526177b070.png" 
                alt="" 
                className="object-contain w-full h-full"
              />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-30 transform rotate-90">
              <img 
                src="/lovable-uploads/d29c9ba0-2517-4098-89fd-4b526177b070.png" 
                alt="" 
                className="object-contain w-full h-full"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-64 h-64 opacity-30 transform -rotate-90">
              <img 
                src="/lovable-uploads/d29c9ba0-2517-4098-89fd-4b526177b070.png" 
                alt="" 
                className="object-contain w-full h-full"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30 transform rotate-180">
              <img 
                src="/lovable-uploads/d29c9ba0-2517-4098-89fd-4b526177b070.png" 
                alt="" 
                className="object-contain w-full h-full"
              />
            </div>
            
            <div className="absolute top-8 left-8 right-8 bottom-8 border-2 border-amber-200 pointer-events-none"></div>
            <div className="absolute top-12 left-12 right-12 bottom-12 border border-amber-300 pointer-events-none"></div>
          </>
        )}
        
        <div className="text-center pt-12 pb-8 relative z-10">
          <h1 className={classes.title} style={{ fontFamily: design === 'modern' ? 'sans-serif' : 'serif' }}>
            Seating Plan
          </h1>
          <h2 className={classes.subtitle}>{eventName}</h2>
          <p className="text-gray-500">
            {eventDate}
            {venue && ` • ${venue}`}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 relative z-10 px-12 py-8">
          {tables.map((table) => (
            <div key={table.id} className="mb-8">
              <h3 className={classes.tableTitle}>
                {table.name}
              </h3>
              <ul className="space-y-1">
                {table.guests?.map((guest) => (
                  <li key={guest.id} className={classes.guestName}>
                    {guest.name}
                    {guest.dietary_restrictions && (
                      <span className="text-gray-500 text-xs ml-1">
                        ({guest.dietary_restrictions})
                      </span>
                    )}
                  </li>
                ))}
                {table.capacity > (table.guests?.length || 0) && (
                  Array.from({ length: table.capacity - (table.guests?.length || 0) }).map((_, i) => (
                    <li key={`empty-${i}`} className="text-sm text-gray-300 italic">
                      Available seat
                    </li>
                  ))
                )}
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

