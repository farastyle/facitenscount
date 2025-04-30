import React from 'react';
import { Bot, BarChart2 } from 'lucide-react';

export function Navbar() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Bot className="text-blue-400 h-7 w-7" />
          <h1 className="text-xl font-bold">Discord Item Tracker</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-sm space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Dashboard Active</span>
          </div>
          
          <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition-colors">
            <BarChart2 className="h-4 w-4" />
            <span>Stats</span>
          </button>
        </div>
      </div>
    </header>
  );
}