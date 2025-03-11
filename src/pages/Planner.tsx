
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import GuestList from '@/components/GuestList';
import TableGrid from '@/components/TableGrid';
import { Guest, Table, Event } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Planner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const eventId = location.state?.eventId;
  
  // Redirect to dashboard if no eventId provided
  useEffect(() => {
    if (!eventId) {
      navigate('/dashboard');
      toast.error('No event selected. Please select an event from your dashboard.');
    }
  }, [eventId, navigate]);

  // Fetch event details
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('No event ID provided');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      return data as Event;
    },
    enabled: !!eventId && !!session.user
  });

  // Fetch tables for this event
  const { data: tables = [], isLoading: isTablesLoading } = useQuery({
    queryKey: ['tables', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('event_id', eventId);
      
      if (error) throw error;
      
      return data.map(table => ({
        ...table,
        position: {
          x: table.position_x,
          y: table.position_y
        },
        guests: [] // Initialize empty guests array
      }));
    },
    enabled: !!eventId && !!session.user
  });

  // Fetch guests for this event
  const { data: guests = [], isLoading: isGuestsLoading } = useQuery({
    queryKey: ['guests', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId);
      
      if (error) throw error;
      
      return data as Guest[];
    },
    enabled: !!eventId && !!session.user
  });

  // Process tables and guests to match our application structure
  const processedTables = tables.map(table => {
    const tableGuests = guests.filter(guest => guest.table_id === table.id);
    return {
      ...table,
      guests: tableGuests
    };
  });

  // Mutations
  const addGuestMutation = useMutation({
    mutationFn: async (newGuest: Guest) => {
      const { data, error } = await supabase
        .from('guests')
        .insert([
          {
            name: newGuest.name,
            email: newGuest.email,
            phone: newGuest.phone,
            group_name: newGuest.group_name,
            plus_one: newGuest.plus_one,
            dietary_restrictions: newGuest.dietary_restrictions,
            rsvp_status: newGuest.rsvp_status,
            event_id: eventId
          }
        ])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add guest');
    }
  });

  const updateGuestMutation = useMutation({
    mutationFn: async (updatedGuest: Guest) => {
      const { data, error } = await supabase
        .from('guests')
        .update({
          name: updatedGuest.name,
          email: updatedGuest.email,
          phone: updatedGuest.phone,
          group_name: updatedGuest.group_name,
          plus_one: updatedGuest.plus_one,
          dietary_restrictions: updatedGuest.dietary_restrictions,
          rsvp_status: updatedGuest.rsvp_status,
          table_id: updatedGuest.table_id
        })
        .eq('id', updatedGuest.id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update guest');
    }
  });

  const deleteGuestMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete guest');
    }
  });

  const addTableMutation = useMutation({
    mutationFn: async (newTable: Table) => {
      const { data, error } = await supabase
        .from('tables')
        .insert([
          {
            name: newTable.name,
            capacity: newTable.capacity,
            shape: newTable.shape,
            position_x: newTable.position.x,
            position_y: newTable.position.y,
            event_id: eventId
          }
        ])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', eventId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add table');
    }
  });

  const updateTableMutation = useMutation({
    mutationFn: async (updatedTable: Table) => {
      const { data, error } = await supabase
        .from('tables')
        .update({
          name: updatedTable.name,
          capacity: updatedTable.capacity,
          shape: updatedTable.shape,
          position_x: updatedTable.position.x,
          position_y: updatedTable.position.y
        })
        .eq('id', updatedTable.id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', eventId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update table');
    }
  });

  const deleteTableMutation = useMutation({
    mutationFn: async (id: string) => {
      // First update any guests assigned to this table to have no table
      await supabase
        .from('guests')
        .update({ table_id: null })
        .eq('table_id', id);
      
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', eventId] });
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete table');
    }
  });

  // Event handlers
  const handleAddGuest = (newGuest: Guest) => {
    addGuestMutation.mutate({ ...newGuest, event_id: eventId });
  };

  const handleUpdateGuest = (updatedGuest: Guest) => {
    updateGuestMutation.mutate(updatedGuest);
  };

  const handleDeleteGuest = (id: string) => {
    deleteGuestMutation.mutate(id);
  };

  const handleAddTable = (newTable: Table) => {
    addTableMutation.mutate({ ...newTable, event_id: eventId });
  };

  const handleUpdateTable = (updatedTable: Table) => {
    // Convert position object to x/y properties for database
    updateTableMutation.mutate({
      ...updatedTable,
      position_x: updatedTable.position.x,
      position_y: updatedTable.position.y,
      event_id: eventId
    });
  };

  const handleDeleteTable = (id: string) => {
    deleteTableMutation.mutate(id);
  };

  const handleSeatGuest = (tableId: string, guest: Guest) => {
    // Update the guest with the new table assignment
    updateGuestMutation.mutate({
      ...guest,
      table_id: tableId,
      event_id: eventId
    });
  };

  const handleRemoveGuest = (tableId: string, guestId: string) => {
    // Find the guest
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      // Update the guest to remove table assignment
      updateGuestMutation.mutate({
        ...guest,
        table_id: null,
        event_id: eventId
      });
    }
  };

  const handleSave = () => {
    toast.success('Seating plan saved successfully');
  };

  const handleExport = () => {
    toast.success('Seating plan exported successfully');
  };

  // Loading state
  if (isEventLoading || !event) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

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
              guests={guests} 
              onAddGuest={handleAddGuest}
              onUpdateGuest={handleUpdateGuest}
              onDeleteGuest={handleDeleteGuest}
            />
          </div>
          <div className="lg:col-span-3">
            <TableGrid 
              tables={processedTables}
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
