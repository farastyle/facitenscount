import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { format, parse } from 'date-fns';

interface LogsViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export function LogsView({ selectedDate, setSelectedDate }: LogsViewProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load logs for the selected date
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would come from your API
        const mockLogs = [
          {
            id: 1,
            timestamp: new Date().toISOString(),
            type: 'info',
            message: 'Bot started successfully',
            data: { botVersion: '1.0.0' }
          },
          {
            id: 2,
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            type: 'item_detected',
            message: 'Item detected in image',
            data: { username: 'Player1', itemName: 'Stop Sign', quantity: 108 }
          },
          {
            id: 3,
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            type: 'item_detected',
            message: 'Item detected in image',
            data: { username: 'GameMaster42', itemName: 'Copper Sheet', quantity: 210 }
          },
          {
            id: 4,
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            type: 'error',
            message: 'Failed to process image',
            data: { username: 'BrokenImage', error: 'Invalid image format' }
          },
          {
            id: 5,
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            type: 'item_detected',
            message: 'Item detected in image',
            data: { username: 'LootHunter', itemName: 'Medical Tape', quantity: 113 }
          }
        ];
        
        // Only show logs from the selected date
        const dateObj = parse(selectedDate, 'yyyyMMdd', new Date());
        const nextDay = new Date(dateObj);
        nextDay.setDate(nextDay.getDate() + 1);
        
        const logsForDate = mockLogs.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= dateObj && logDate < nextDay;
        });
        
        setLogs(logsForDate);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, [selectedDate]);
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    const formattedDate = date.replace(/-/g, '');
    setSelectedDate(formattedDate);
  };
  
  const displayDate = selectedDate ? 
    format(parse(selectedDate, 'yyyyMMdd', new Date()), 'yyyy-MM-dd') : 
    format(new Date(), 'yyyy-MM-dd');
  
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'success':
      case 'item_detected':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };
  
  const getLogClass = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'success':
      case 'item_detected':
        return 'border-green-500/50 bg-green-500/10';
      case 'info':
      default:
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };
  
  const formatLogDetails = (log: any) => {
    if (log.type === 'item_detected') {
      return (
        <div>
          <span className="font-medium">{log.data.username}</span> posted an image containing{' '}
          <span className="font-medium">{log.data.itemName}</span>{' '}
          <span className="font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs">
            x{log.data.quantity}
          </span>
        </div>
      );
    }
    
    if (log.type === 'error') {
      return (
        <div>
          <span className="font-medium text-red-400">Error:</span> {log.message}
          {log.data.error && <div className="text-sm mt-1 text-gray-400">{log.data.error}</div>}
        </div>
      );
    }
    
    return <div>{log.message}</div>;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">System Logs</h2>
        
        <div className="flex items-center space-x-4">
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
            onClick={() => setSelectedDate(format(new Date(), 'yyyyMMdd'))}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Today</span>
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-medium">Log Entries</h3>
          
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Success</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>Info</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span>Error</span>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
            <p>Loading logs...</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {logs.map(log => (
              <div 
                key={log.id}
                className={`border rounded-lg p-4 ${getLogClass(log.type)}`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">
                        {format(new Date(log.timestamp), 'HH:mm:ss')}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-700">
                        {log.type}
                      </span>
                    </div>
                    {formatLogDetails(log)}
                  </div>
                </div>
              </div>
            ))}
            
            {logs.length === 0 && (
              <div className="text-center py-10 bg-gray-700/30 rounded-lg">
                <p className="text-gray-400">No logs found for the selected date</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}