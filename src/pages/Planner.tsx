
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import GuestList from '@/components/GuestList';
import TableGrid from '@/components/TableGrid';
import { Guest, Table, Event } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Download } from 'lucide-react';
import { toast } from 'sonner';

const Planner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event>({
    id: '1',
    name: 'Sample Wedding',
    date: '2023-10-15',
    venue: 'Grand Ballroom',
    tables: [],
    guests: []
  });

  // Sample data for demonstration
  useEffect(() => {
    const demoGuests: Guest[] = [
      { id: '1', name: 'John Smith', group: 'Family', rsvpStatus: 'confirmed' },
      { id: '2', name: 'Jane Doe', group: 'Friends', rsvpStatus: 'confirmed' },
      { id: '3', name: 'Robert Johnson', group: 'Family', rsvpStatus: 'confirmed' },
      { id: '4', name: 'Emily Davis', group: 'Friends', rsvpStatus: 'confirmed' },
      { id: '5', name: 'Michael Brown', group: 'Family', rsvpStatus: 'pending' },
      { id: '6', name: 'Sarah Wilson', group: 'Friends', rsvpStatus: 'pending' },
      { id: '7', name: 'David Taylor', group: 'Colleagues', dietaryRestrictions: 'Vegetarian', rsvpStatus: 'confirmed' },
      { id: '8', name: 'Lisa Thomas', group: 'Colleagues', rsvpStatus: 'confirmed' }
    ];

    const demoTables: Table[] = [
      { 
        id: '1', 
        name: 'Family Table', 
        capacity: 8, 
        shape: 'round', 
        position: { x: 100, y: 100 }, 
        guests: [] 
      },
      { 
        id: '2', 
        name: 'Friends Table', 
        capacity: 6, 
        shape: 'rectangle', 
        position: { x: 400, y: 100 }, 
        guests: [] 
      }
    ];

    setEvent(prev => ({
      ...prev,
      guests: demoGuests,
      tables: demoTables
    }));
  }, []);

  const handleAddGuest = (newGuest: Guest) => {
    setEvent(prev => ({
      ...prev,
      guests: [...prev.guests, newGuest]
    }));
    toast.success(`${newGuest.name} added to guest list`);
  };

  const handleUpdateGuest = (updatedGuest: Guest) => {
    setEvent(prev => ({
      ...prev,
      guests: prev.guests.map(guest => 
        guest.id === updatedGuest.id ? updatedGuest : guest
      )
    }));
    toast.success(`${updatedGuest.name} updated`);
  };

  const handleDeleteGuest = (id: string) => {
    const guestToDelete = event.guests.find(guest => guest.id === id);
    
    // Remove guest from table if assigned
    const updatedTables = event.tables.map(table => {
      if (table.guests.some(g => g.id === id)) {
        return {
          ...table,
          guests: table.guests.filter(g => g.id !== id)
        };
      }
      return table;
    });
    
    setEvent(prev => ({
      ...prev,
      guests: prev.guests.filter(guest => guest.id !== id),
      tables: updatedTables
    }));
    
    if (guestToDelete) {
      toast.success(`${guestToDelete.name} removed from guest list`);
    }
  };

  const handleAddTable = (newTable: Table) => {
    setEvent(prev => ({
      ...prev,
      tables: [...prev.tables, newTable]
    }));
  };

  const handleUpdateTable = (updatedTable: Table) => {
    setEvent(prev => ({
      ...prev,
      tables: prev.tables.map(table => 
        table.id === updatedTable.id ? updatedTable : table
      )
    }));
  };

  const handleDeleteTable = (id: string) => {
    // Check if table has guests
    const tableToDelete = event.tables.find(table => table.id === id);
    
    if (tableToDelete && tableToDelete.guests.length > 0) {
      // Move guests back to unassigned (remove tableId)
      const updatedGuests = event.guests.map(guest => {
        if (tableToDelete.guests.some(g => g.id === guest.id)) {
          return { ...guest, tableId: undefined };
        }
        return guest;
      });
      
      setEvent(prev => ({
        ...prev,
        tables: prev.tables.filter(table => table.id !== id),
        guests: updatedGuests
      }));
    } else {
      setEvent(prev => ({
        ...prev,
        tables: prev.tables.filter(table => table.id !== id)
      }));
    }
  };

  const handleSeatGuest = (tableId: string, guest: Guest) => {
    // First check if guest is already seated at another table
    const isGuestSeated = event.tables.some(table => 
      table.id !== tableId && table.guests.some(g => g.id === guest.id)
    );
    
    if (isGuestSeated) {
      // Remove guest from previous table
      const updatedTables = event.tables.map(table => {
        if (table.id !== tableId && table.guests.some(g => g.id === guest.id)) {
          return {
            ...table,
            guests: table.guests.filter(g => g.id !== guest.id)
          };
        }
        return table;
      });
      
      setEvent(prev => ({
        ...prev,
        tables: updatedTables
      }));
    }
    
    // Now add guest to the new table
    const targetTable = event.tables.find(table => table.id === tableId);
    
    if (targetTable && targetTable.guests.length < targetTable.capacity) {
      // Update the guest with tableId
      const updatedGuest = { 
        ...guest, 
        tableId 
      };
      
      // Update guest in the guests array
      const updatedGuests = event.guests.map(g => 
        g.id === guest.id ? updatedGuest : g
      );
      
      // Add guest to table
      const updatedTables = event.tables.map(table => {
        if (table.id === tableId) {
          return {
            ...table,
            guests: [...table.guests, updatedGuest]
          };
        }
        return table;
      });
      
      setEvent(prev => ({
        ...prev,
        guests: updatedGuests,
        tables: updatedTables
      }));
    }
  };

  const handleRemoveGuest = (tableId: string, guestId: string) => {
    // Remove guest from table
    const updatedTables = event.tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          guests: table.guests.filter(g => g.id !== guestId)
        };
      }
      return table;
    });
    
    // Update guest's tableId to undefined
    const updatedGuests = event.guests.map(guest => {
      if (guest.id === guestId) {
        return { ...guest, tableId: undefined };
      }
      return guest;
    });
    
    setEvent(prev => ({
      ...prev,
      tables: updatedTables,
      guests: updatedGuests
    }));
    
    const guestName = event.guests.find(g => g.id === guestId)?.name || 'Guest';
    toast.success(`${guestName} removed from table`);
  };

  const handleSave = () => {
    toast.success('Seating plan saved successfully');
  };

  const handleExport = () => {
    toast.success('Seating plan exported successfully');
  };

  return (
    <div className="min-h-screen bg-secondary/30 page-transition">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{event.name}</h1>
              <p className="text-muted-foreground">
                {new Date(event.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {event.venue && ` • ${event.venue}`}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="btn-hover"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              className="btn-hover"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Plan
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <GuestList 
              guests={event.guests} 
              onAddGuest={handleAddGuest}
              onUpdateGuest={handleUpdateGuest}
              onDeleteGuest={handleDeleteGuest}
            />
          </div>
          <div className="lg:col-span-3">
            <TableGrid 
              tables={event.tables}
              onAddTable={handleAddTable}
              onUpdateTable={handleUpdateTable}
              onDeleteTable={handleDeleteTable}
              onSeatGuest={handleSeatGuest}
              onRemoveGuest={handleRemoveGuest}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
