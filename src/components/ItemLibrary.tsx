import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';

export function ItemLibrary() {
  const [items, setItems] = useState<any[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    imagePath: '',
  });
  
  // Load items
  useEffect(() => {
    // In a real app, this would come from your API
    const mockItems = [
      {
        id: 1,
        name: 'Stop Sign',
        description: 'A red octagonal stop sign',
        imagePath: 'https://i.ibb.co/PMB4SWn/stop-sign.webp',
        features: {
          color: { r: 220, g: 20, b: 20 },
          shape: 'octagon'
        }
      },
      {
        id: 2,
        name: 'Copper Sheet',
        description: 'Flat copper material sheet',
        imagePath: 'https://i.ibb.co/9NSJzQP/copper.webp',
        features: {
          color: { r: 184, g: 115, b: 51 },
          shape: 'rectangle'
        }
      },
      {
        id: 3,
        name: 'Medical Tape',
        description: 'White medical adhesive tape',
        imagePath: 'https://i.ibb.co/vH6j0nn/medical-tape.webp',
        features: {
          color: { r: 240, g: 240, b: 240 },
          shape: 'cylinder'
        }
      }
    ];
    
    setItems(mockItems);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };
  
  const handleAddItem = () => {
    // In a real app, this would save to your API
    const newId = Math.max(0, ...items.map(item => item.id)) + 1;
    const itemToAdd = {
      id: newId,
      ...newItem,
      features: {
        color: { r: 100, g: 100, b: 100 },
        shape: 'unknown'
      }
    };
    
    setItems([...items, itemToAdd]);
    setNewItem({
      name: '',
      description: '',
      imagePath: '',
    });
    setIsAddingItem(false);
  };
  
  const handleEditItem = (id: number) => {
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setNewItem({
        name: itemToEdit.name,
        description: itemToEdit.description,
        imagePath: itemToEdit.imagePath,
      });
      setEditingItemId(id);
    }
  };
  
  const handleSaveEdit = () => {
    if (editingItemId === null) return;
    
    const updatedItems = items.map(item => {
      if (item.id === editingItemId) {
        return {
          ...item,
          name: newItem.name,
          description: newItem.description,
          imagePath: newItem.imagePath,
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    setEditingItemId(null);
    setNewItem({
      name: '',
      description: '',
      imagePath: '',
    });
  };
  
  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Item Library</h2>
        
        <button
          onClick={() => setIsAddingItem(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </button>
      </div>
      
      {/* Add/Edit Item Form */}
      {(isAddingItem || editingItemId !== null) && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-blue-500/50">
          <h3 className="text-xl font-bold mb-4">
            {editingItemId !== null ? 'Edit Item' : 'Add New Item'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                placeholder="Enter item name"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Image URL
              </label>
              <input
                type="text"
                name="imagePath"
                value={newItem.imagePath}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              placeholder="Enter item description"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsAddingItem(false);
                setEditingItemId(null);
                setNewItem({
                  name: '',
                  description: '',
                  imagePath: '',
                });
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            
            <button
              onClick={editingItemId !== null ? handleSaveEdit : handleAddItem}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{editingItemId !== null ? 'Save Changes' : 'Add Item'}</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div 
            key={item.id}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
          >
            <div className="h-48 overflow-hidden bg-gray-900 flex items-center justify-center">
              {item.imagePath ? (
                <img 
                  src={item.imagePath} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-600 flex items-center justify-center h-full w-full">
                  No image available
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2">{item.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: `rgb(${item.features.color.r}, ${item.features.color.g}, ${item.features.color.b})`
                    }}
                  ></div>
                  <span className="text-xs text-gray-500">{item.features.shape}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditItem(item.id)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {items.length === 0 && !isAddingItem && (
          <div className="col-span-full text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-400 mb-4">No items in your library yet</p>
            <button
              onClick={() => setIsAddingItem(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}