import React, { useState, useEffect } from 'react';
import { 
  User, 
  Image as ImageIcon, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface DashboardHomeProps {
  selectedDate: string;
}

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

export function DashboardHome({ selectedDate }: DashboardHomeProps) {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  
  // Simulate loading stats and recent items
  useEffect(() => {
    // In a real app, these would come from your API
    const mockStats = [
      { 
        title: 'Images Processed', 
        value: 24, 
        icon: <ImageIcon className="w-5 h-5" />, 
        color: 'bg-blue-500' 
      },
      { 
        title: 'Users Active', 
        value: 7, 
        icon: <User className="w-5 h-5" />, 
        color: 'bg-green-500' 
      },
      { 
        title: 'Last Update', 
        value: '5 mins ago', 
        icon: <Clock className="w-5 h-5" />, 
        color: 'bg-purple-500' 
      },
      { 
        title: 'Processing Errors', 
        value: 2, 
        icon: <AlertTriangle className="w-5 h-5" />, 
        color: 'bg-red-500' 
      }
    ];
    
    const mockRecentItems = [
      {
        id: 1,
        username: 'Player1',
        timestamp: new Date().toISOString(),
        itemName: 'Stop Sign',
        quantity: 108,
        position: { row: 0, col: 2 }
      },
      {
        id: 2,
        username: 'GameMaster42',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        itemName: 'Copper Sheet',
        quantity: 210,
        position: { row: 1, col: 3 }
      },
      {
        id: 3,
        username: 'LootHunter',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        itemName: 'Medical Tape',
        quantity: 113,
        position: { row: 2, col: 2 }
      }
    ];
    
    setStats(mockStats);
    setRecentItems(mockRecentItems);
  }, [selectedDate]);
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleString();
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Items */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Item Detections</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map(item => (
                  <tr 
                    key={item.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{item.username}</td>
                    <td className="py-3 px-4">{item.itemName}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        x{item.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      Row {item.position.row + 1}, Col {item.position.col + 1}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {formatTime(item.timestamp)}
                    </td>
                  </tr>
                ))}
                {recentItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No items detected today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}