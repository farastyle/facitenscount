import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download } from 'lucide-react';
import { format, parse } from 'date-fns';

interface ResultsViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export function ResultsView({ selectedDate, setSelectedDate }: ResultsViewProps) {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [filteredDeposits, setFilteredDeposits] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    username: '',
    itemName: '',
  });
  
  useEffect(() => {
    const mockDeposits = [
      {
        id: 1,
        username: 'Player1',
        timestamp: new Date().toISOString(),
        itemName: 'Stop Sign',
        quantity: 108
      },
      {
        id: 2,
        username: 'GameMaster42',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        itemName: 'Copper Sheet',
        quantity: 210
      }
    ];
    
    const dateObj = parse(selectedDate, 'yyyyMMdd', new Date());
    const nextDay = new Date(dateObj);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const depositsForDate = mockDeposits.filter(deposit => {
      const depositDate = new Date(deposit.timestamp);
      return depositDate >= dateObj && depositDate < nextDay;
    });
    
    setDeposits(depositsForDate);
    setFilteredDeposits(depositsForDate);
  }, [selectedDate]);
  
  useEffect(() => {
    let filtered = [...deposits];
    
    if (filters.username) {
      filtered = filtered.filter(deposit => 
        deposit.username.toLowerCase().includes(filters.username.toLowerCase())
      );
    }
    
    if (filters.itemName) {
      filtered = filtered.filter(deposit => 
        deposit.itemName.toLowerCase().includes(filters.itemName.toLowerCase())
      );
    }
    
    setFilteredDeposits(filtered);
  }, [filters, deposits]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    const formattedDate = date.replace(/-/g, '');
    setSelectedDate(formattedDate);
  };
  
  const displayDate = selectedDate ? 
    format(parse(selectedDate, 'yyyyMMdd', new Date()), 'yyyy-MM-dd') : 
    format(new Date(), 'yyyy-MM-dd');
  
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredDeposits, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `deposits-${selectedDate}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Deposits</h2>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="date"
              value={displayDate}
              onChange={handleDateChange}
              className="bg-gray-700 border border-gray-600 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleExportData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center mb-2">
            <Filter className="h-4 w-4 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={filters.username}
                onChange={handleFilterChange}
                placeholder="Filter by username"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Item Name
              </label>
              <input
                type="text"
                name="itemName"
                value={filters.itemName}
                onChange={handleFilterChange}
                placeholder="Filter by item name"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.map(deposit => (
                <tr 
                  key={deposit.id}
                  className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-400">
                    {format(new Date(deposit.timestamp), 'HH:mm:ss')}
                  </td>
                  <td className="py-3 px-4 font-medium">{deposit.username}</td>
                  <td className="py-3 px-4">{deposit.itemName}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      x{deposit.quantity}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredDeposits.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No deposits found for the selected filters and date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Total Deposits</h4>
            <p className="text-2xl font-bold">{filteredDeposits.length}</p>
          </div>
          
          <div className="bg-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Unique Players</h4>
            <p className="text-2xl font-bold">
              {new Set(filteredDeposits.map(d => d.username)).size}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Unique Items</h4>
            <p className="text-2xl font-bold">
              {new Set(filteredDeposits.map(d => d.itemName)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}