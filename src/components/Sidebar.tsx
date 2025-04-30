import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Database, 
  Image, 
  FileText, 
  AlertCircle 
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  botStatus: string;
}

export function Sidebar({ activeView, setActiveView, botStatus }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { id: 'items', label: 'Items Library', icon: <Image /> },
    { id: 'results', label: 'Results', icon: <Database /> },
    { id: 'logs', label: 'Logs', icon: <FileText /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-4">
        <div className="mb-8 pt-2">
          <div className="flex items-center mb-2">
            <div className={`w-3 h-3 rounded-full mr-3 ${botStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">Bot Status: {botStatus === 'online' ? 'Online' : 'Offline'}</span>
          </div>
          
          {botStatus !== 'online' && (
            <div className="bg-gray-700 rounded-md p-2 flex items-center text-sm">
              <AlertCircle className="text-yellow-400 w-4 h-4 mr-2" />
              <span>Bot is not running</span>
            </div>
          )}
        </div>
        
        <nav>
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    activeView === item.id 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}