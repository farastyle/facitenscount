import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { format } from 'date-fns';

function App() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyyMMdd'));
  const [activeView, setActiveView] = useState('dashboard');
  const [config, setConfig] = useState({
    isConfigured: false,
    discordChannelId: '',
    discordGuildId: '',
    botStatus: 'offline',
  });

  // Check if bot is configured
  useEffect(() => {
    const checkConfig = async () => {
      try {
        // This would normally fetch from an API
        // For demo, we'll simulate the check
        setTimeout(() => {
          setConfig({
            isConfigured: false,
            discordChannelId: '',
            discordGuildId: '',
            botStatus: 'offline',
          });
        }, 1000);
      } catch (error) {
        console.error('Failed to check configuration:', error);
      }
    };

    checkConfig();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          botStatus={config.botStatus}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {!config.isConfigured && activeView === 'dashboard' && (
            <div className="bg-gray-800 border border-blue-500 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Welcome to Discord Item Tracker</h2>
              <p className="mb-4">
                This application monitors Discord channels for images containing game items and extracts item quantities.
              </p>
              <p className="mb-4">
                To get started, you need to configure your Discord bot settings.
              </p>
              <button 
                onClick={() => setActiveView('settings')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Configure Settings
              </button>
            </div>
          )}
          
          <Dashboard 
            activeView={activeView}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            config={config}
            setConfig={setConfig}
          />
        </main>
      </div>
    </div>
  );
}

export default App;