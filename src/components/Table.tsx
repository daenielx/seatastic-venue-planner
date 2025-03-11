
import { useState, useRef, useEffect } from 'react';
import { Table as TableType, Guest } from '@/utils/types';
import { Users, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface TableProps {
  table: TableType;
  onUpdateTable: (table: TableType) => void;
  onDeleteTable: (id: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, tableId: string) => void;
  onRemoveGuest: (tableId: string, guestId: string) => void;
}

const Table = ({ table, onUpdateTable, onDeleteTable, onDrop, onRemoveGuest }: TableProps) => {
  const [position, setPosition] = useState({ x: table.position.x, y: table.position.y });
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTable, setEditedTable] = useState<TableType>({...table});
  const [isDragOver, setIsDragOver] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && tableRef.current) {
        const parentRect = tableRef.current.parentElement?.getBoundingClientRect();
        if (parentRect) {
          const newX = e.clientX - parentRect.left - dragOffset.current.x;
          const newY = e.clientY - parentRect.top - dragOffset.current.y;
          
          // Ensure the table stays within the boundaries of its parent
          const maxX = parentRect.width - tableRef.current.offsetWidth;
          const maxY = parentRect.height - tableRef.current.offsetHeight;
          
          setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
          });
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Update the table position in the parent component
        onUpdateTable({
          ...table,
          position: position
        });
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, table, onUpdateTable]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tableRef.current && e.target === tableRef.current || 
        (e.target as HTMLElement).classList.contains('table-header')) {
      setIsDragging(true);
      
      const rect = tableRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(false);
    onDrop(e, table.id);
  };

  const handleUpdateTable = () => {
    onUpdateTable(editedTable);
    setIsEditing(false);
    toast.success(`Table ${editedTable.name} updated`);
  };

  const handleDeleteTable = () => {
    onDeleteTable(table.id);
    toast.success(`Table ${table.name} deleted`);
  };

  const handleRemoveGuest = (guestId: string) => {
    onRemoveGuest(table.id, guestId);
  };

  const getTableStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: table.shape === 'round' ? '200px' : table.shape === 'rectangle' ? '280px' : '180px',
      height: table.shape === 'round' ? '200px' : table.shape === 'rectangle' ? '160px' : '180px',
      cursor: isDragging ? 'grabbing' : 'grab',
      zIndex: isDragging ? 10 : 1,
    };
    
    const shapeStyles = {
      round: {
        borderRadius: '50%',
      },
      rectangle: {
        borderRadius: '10px',
      },
      square: {
        borderRadius: '10px',
      },
    };
    
    return {
      ...baseStyle,
      ...shapeStyles[table.shape],
    };
  };

  return (
    <>
      <div
        ref={tableRef}
        className={`glassmorphism shadow-lg flex flex-col justify-start ${
          isDragging ? 'shadow-xl' : ''
        } ${isDragOver ? 'droppable-area can-drop' : 'droppable-area'}`}
        style={getTableStyle()}
        onMouseDown={handleMouseDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="table-header flex justify-between items-center p-3 border-b border-gray-100">
          <span className="font-medium text-sm">{table.name}</span>
          <div className="flex space-x-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => {
                    setIsEditing(true);
                    setEditedTable({...table});
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Table</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-table-name" className="text-right">
                      Table Name
                    </Label>
                    <Input
                      id="edit-table-name"
                      value={editedTable.name}
                      onChange={(e) => setEditedTable({...editedTable, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-capacity" className="text-right">
                      Capacity
                    </Label>
                    <Input
                      id="edit-capacity"
                      type="number"
                      min={editedTable.guests.length}
                      max="20"
                      value={editedTable.capacity}
                      onChange={(e) => setEditedTable({...editedTable, capacity: parseInt(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-shape" className="text-right">
                      Shape
                    </Label>
                    <Select 
                      value={editedTable.shape} 
                      onValueChange={(value) => setEditedTable({...editedTable, shape: value as 'round' | 'rectangle' | 'square'})}
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
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDeleteTable}
                  >
                    Delete Table
                  </Button>
                  <div className="flex space-x-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type="button" onClick={handleUpdateTable}>
                        Save Changes
                      </Button>
                    </DialogClose>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center justify-center mb-2 mt-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            {table.guests.length} / {table.capacity}
          </div>
        </div>

        <div className="p-2 flex-grow overflow-auto">
          {table.guests.length > 0 ? (
            <ul className="space-y-1">
              {table.guests.map((guest) => (
                <li 
                  key={guest.id} 
                  className="bg-background/70 rounded p-1 text-xs flex justify-between items-center"
                >
                  <span className="truncate max-w-[80%]">{guest.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 text-muted-foreground"
                    onClick={() => handleRemoveGuest(guest.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
              Drag guests here
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Table;
