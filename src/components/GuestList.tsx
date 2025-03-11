
import { useState } from 'react';
import { User, UserPlus, Search, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Guest } from '@/utils/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface GuestListProps {
  guests: Guest[];
  onAddGuest: (guest: Guest) => void;
  onUpdateGuest: (guest: Guest) => void;
  onDeleteGuest: (id: string) => void;
}

const GuestList = ({ guests, onAddGuest, onUpdateGuest, onDeleteGuest }: GuestListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({
    name: '',
    email: '',
    phone: '',
    group_name: '',
    plus_one: false,
    dietary_restrictions: '',
    rsvp_status: 'pending'
  });
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (guest.group_name && guest.group_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddGuest = () => {
    if (newGuest.name) {
      onAddGuest({
        id: Date.now().toString(), // This will be replaced by the server
        name: newGuest.name,
        email: newGuest.email || '',
        phone: newGuest.phone || '',
        group_name: newGuest.group_name,
        plus_one: newGuest.plus_one || false,
        dietary_restrictions: newGuest.dietary_restrictions,
        rsvp_status: newGuest.rsvp_status || 'pending',
        event_id: '' // This will be set by the server
      });
      setNewGuest({
        name: '',
        email: '',
        phone: '',
        group_name: '',
        plus_one: false,
        dietary_restrictions: '',
        rsvp_status: 'pending'
      });
    }
  };

  const handleUpdateGuest = () => {
    if (editingGuest) {
      onUpdateGuest(editingGuest);
      setEditingGuest(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <User className="mr-2 h-5 w-5" />
          Guest List
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="btn-hover">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="group" className="text-right">
                  Group
                </Label>
                <Input
                  id="group"
                  value={newGuest.group_name}
                  onChange={(e) => setNewGuest({...newGuest, group_name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dietary" className="text-right">
                  Dietary Needs
                </Label>
                <Input
                  id="dietary"
                  value={newGuest.dietary_restrictions}
                  onChange={(e) => setNewGuest({...newGuest, dietary_restrictions: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rsvp" className="text-right">
                  RSVP Status
                </Label>
                <Select 
                  value={newGuest.rsvp_status} 
                  onValueChange={(value) => setNewGuest({...newGuest, rsvp_status: value as 'pending' | 'confirmed' | 'declined'})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" onClick={handleAddGuest}>
                  Add Guest
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search guests..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="overflow-y-auto flex-grow">
        <ul className="space-y-2">
          {filteredGuests.length > 0 ? (
            filteredGuests.map((guest) => (
              <li 
                key={guest.id} 
                className="glassmorphism rounded-lg p-3 flex justify-between items-center draggable-item card-hover group"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('guest', JSON.stringify(guest));
                }}
              >
                <div>
                  <div className="font-medium">{guest.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {guest.group_name && `Group: ${guest.group_name}`}
                    {guest.table_id && ` • Assigned to table`}
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingGuest(guest)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {editingGuest && (
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Guest</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingGuest.name}
                              onChange={(e) => setEditingGuest({...editingGuest, name: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="edit-email"
                              value={editingGuest.email}
                              onChange={(e) => setEditingGuest({...editingGuest, email: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-group" className="text-right">
                              Group
                            </Label>
                            <Input
                              id="edit-group"
                              value={editingGuest.group_name}
                              onChange={(e) => setEditingGuest({...editingGuest, group_name: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-dietary" className="text-right">
                              Dietary Needs
                            </Label>
                            <Input
                              id="edit-dietary"
                              value={editingGuest.dietary_restrictions}
                              onChange={(e) => setEditingGuest({...editingGuest, dietary_restrictions: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-rsvp" className="text-right">
                              RSVP Status
                            </Label>
                            <Select 
                              value={editingGuest.rsvp_status} 
                              onValueChange={(value) => setEditingGuest({...editingGuest, rsvp_status: value as 'pending' | 'confirmed' | 'declined'})}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button type="button" onClick={handleUpdateGuest}>
                              Save Changes
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                    onClick={() => onDeleteGuest(guest.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {searchTerm ? 'No guests found matching your search' : 'No guests added yet'}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GuestList;
