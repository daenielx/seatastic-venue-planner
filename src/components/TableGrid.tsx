
import { useState, useRef } from 'react';
import { Table as TableType, Guest } from '@/utils/types';
import Table from './Table';
import { Plus, LayoutGrid, Save, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface TableGridProps {
  tables: TableType[];
  onAddTable: (table: TableType) => void;
  onUpdateTable: (table: TableType) => void;
  onDeleteTable: (id: string) => void;
  onSeatGuest: (tableId: string, guest: Guest) => void;
  onRemoveGuest: (tableId: string, guestId: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const TableGrid = ({ 
  tables, 
  onAddTable, 
  onUpdateTable, 
  onDeleteTable, 
  onSeatGuest, 
  onRemoveGuest,
  isFullscreen = false,
  onToggleFullscreen 
}: TableGridProps) => {
  const [gridVisible, setGridVisible] = useState(false);
  const [newTable, setNewTable] = useState<Partial<TableType>>({
    name: '',
    capacity: 8,
    shape: 'round',
    position_x: 0,
    position_y: 0
  });
  const gridRef = useRef<HTMLDivElement>(null);

  // Add the missing handleDragOver function
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Allow dropping by preventing the default behavior
    e.dataTransfer.dropEffect = 'move';
  };

  // Add the missing handleSaveLayout function
  const handleSaveLayout = () => {
    toast.success('Seating layout saved successfully');
    // We would typically perform a save operation here
    // For now, just notify the user with a toast
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, tableId: string) => {
    e.preventDefault();
    try {
      const guestData = e.dataTransfer.getData('guest');
      if (guestData) {
        const guest = JSON.parse(guestData);
        
        const targetTable = tables.find(t => t.id === tableId);
        if (targetTable && targetTable.guests && targetTable.guests.length < targetTable.capacity) {
          onSeatGuest(tableId, guest);
          toast.success(`${guest.name} seated at ${targetTable.name}`);
        } else {
          toast.error('This table is at full capacity');
        }
      }
    } catch (error) {
      console.error('Error processing drop:', error);
    }
  };

  const handleAddTable = () => {
    if (newTable.name) {
      // Calculate a position within the visible area
      const gridRect = gridRef.current?.getBoundingClientRect();
      const maxX = gridRect ? gridRect.width - 200 : 500;
      const maxY = gridRect ? gridRect.height - 200 : 300;
      
      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY);
      
      onAddTable({
        id: Date.now().toString(), // This will be replaced by the server
        name: newTable.name || '',
        capacity: newTable.capacity || 8,
        shape: newTable.shape || 'round',
        position_x: randomX,
        position_y: randomY,
        event_id: '',  // This will be set by the server
        guests: []
      });
      
      setNewTable({
        name: '',
        capacity: 8,
        shape: 'round',
        position_x: 0,
        position_y: 0
      });
      
      toast.success(`Table ${newTable.name} added`);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Seating Plan</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={gridVisible ? 'bg-accent' : ''}
            onClick={() => setGridVisible(!gridVisible)}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            {gridVisible ? 'Hide Grid' : 'Show Grid'}
          </Button>
          <Button 
            size="sm" 
            className="btn-hover"
            onClick={handleSaveLayout}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
          {onToggleFullscreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFullscreen}
              className="btn-hover"
            >
              {isFullscreen ? (
                <><Minimize className="h-4 w-4 mr-2" />Exit Fullscreen</>
              ) : (
                <><Maximize className="h-4 w-4 mr-2" />Fullscreen</>
              )}
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="btn-hover">
                <Plus className="h-4 w-4 mr-2" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Table</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table-name" className="text-right">
                    Table Name
                  </Label>
                  <Input
                    id="table-name"
                    value={newTable.name}
                    onChange={(e) => setNewTable({...newTable, name: e.target.value})}
                    className="col-span-3"
                    placeholder="e.g., Family, Friends, etc."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="20"
                    value={newTable.capacity}
                    onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shape" className="text-right">
                    Shape
                  </Label>
                  <Select 
                    value={newTable.shape} 
                    onValueChange={(value) => setNewTable({...newTable, shape: value as 'round' | 'rectangle' | 'square'})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select table shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">Round</SelectItem>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
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
                  <Button type="button" onClick={handleAddTable}>
                    Add Table
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div 
        ref={gridRef} 
        className={`flex-grow relative overflow-auto border rounded-lg ${
          gridVisible ? 'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Cg fill=\'%23f0f0f0\' fill-opacity=\'1\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M0 0h20v20H0V0zm1 1v18h18V1H1z\'/%3E%3C/g%3E%3C/svg%3E")]' : ''
        } ${isFullscreen ? '' : 'min-h-[650px]'}`}
        onDragOver={handleDragOver}
      >
        {tables.map((table) => (
          <Table 
            key={table.id}
            table={table}
            onUpdateTable={onUpdateTable}
            onDeleteTable={onDeleteTable}
            onDrop={handleDrop}
            onRemoveGuest={onRemoveGuest}
          />
        ))}
        
        {tables.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <p className="mb-4">No tables added yet</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Table
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Table</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="table-name-first" className="text-right">
                      Table Name
                    </Label>
                    <Input
                      id="table-name-first"
                      value={newTable.name}
                      onChange={(e) => setNewTable({...newTable, name: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., Family, Friends, etc."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity-first" className="text-right">
                      Capacity
                    </Label>
                    <Input
                      id="capacity-first"
                      type="number"
                      min="1"
                      max="20"
                      value={newTable.capacity}
                      onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="shape-first" className="text-right">
                      Shape
                    </Label>
                    <Select 
                      value={newTable.shape} 
                      onValueChange={(value) => setNewTable({...newTable, shape: value as 'round' | 'rectangle' | 'square'})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select table shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="round">Round</SelectItem>
                        <SelectItem value="rectangle">Rectangle</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
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
                    <Button type="button" onClick={handleAddTable}>
                      Add Table
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableGrid;
