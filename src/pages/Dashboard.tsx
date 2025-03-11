
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, Map, Users, Settings, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/utils/types';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Smith-Johnson Wedding',
      date: '2023-06-15',
      venue: 'Grand Ballroom',
      tables: [],
      guests: []
    },
    {
      id: '2',
      name: 'Anniversary Celebration',
      date: '2023-08-22',
      venue: 'Garden Terrace',
      tables: [],
      guests: []
    }
  ]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    name: '',
    date: '',
    venue: '',
    tables: [],
    guests: []
  });

  const handleCreateEvent = () => {
    if (newEvent.name && newEvent.date) {
      const event: Event = {
        id: Date.now().toString(),
        name: newEvent.name,
        date: newEvent.date,
        venue: newEvent.venue || '',
        tables: [],
        guests: []
      };
      setEvents([...events, event]);
      setNewEvent({
        name: '',
        date: '',
        venue: '',
        tables: [],
        guests: []
      });
      toast.success(`Event "${event.name}" created`);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast.success('Event deleted');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30 page-transition">
      <Navbar />
      
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Events</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-hover">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new wedding or event.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-name" className="text-right">
                      Event Name
                    </Label>
                    <Input
                      id="event-name"
                      placeholder="Smith-Johnson Wedding"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-venue" className="text-right">
                      Venue
                    </Label>
                    <Input
                      id="event-venue"
                      placeholder="Grand Ballroom"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="button" onClick={handleCreateEvent}>
                      Create Event
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="glassmorphism card-hover overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-1">{event.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(event.date)}
                        </CardDescription>
                        {event.venue && (
                          <CardDescription className="flex items-center mt-1">
                            <Map className="h-3 w-3 mr-1" />
                            {event.venue}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.guests.length} Guests</span>
                      </div>
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.tables.length} Tables</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full btn-hover" 
                      variant="outline"
                      onClick={() => navigate('/planner', { state: { eventId: event.id } })}
                    >
                      Edit Seating Plan
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glassmorphism rounded-xl">
              <h3 className="text-xl font-semibold mb-2">No events yet</h3>
              <p className="text-muted-foreground mb-6">Create your first wedding or event to get started.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="btn-hover">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Enter the details for your new wedding or event.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-name-empty" className="text-right">
                        Event Name
                      </Label>
                      <Input
                        id="event-name-empty"
                        placeholder="Smith-Johnson Wedding"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-date-empty" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="event-date-empty"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-venue-empty" className="text-right">
                        Venue
                      </Label>
                      <Input
                        id="event-venue-empty"
                        placeholder="Grand Ballroom"
                        value={newEvent.venue}
                        onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type="button" onClick={handleCreateEvent}>
                        Create Event
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
