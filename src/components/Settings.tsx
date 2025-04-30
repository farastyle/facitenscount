import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';

interface SettingsProps {
  config: {
    isConfigured: boolean;
    discordChannelId: string;
    discordGuildId: string;
    botStatus: string;
  };
  setConfig: (config: any) => void;
}

export function Settings({ config, setConfig }: SettingsProps) {
  const [form, setForm] = useState({
    discordToken: '',
    discordClientId: '',
    discordGuildId: config.discordGuildId || '',
    discordChannelId: config.discordChannelId || '',
    debugMode: false
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: string; text: string } | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // In a real application, this would save to a server or .env file
      // For this demo, we'll simulate a save
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setConfig({
        ...config,
        isConfigured: true,
        discordGuildId: form.discordGuildId,
        discordChannelId: form.discordChannelId
      });
      
      setSaveMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });
      
      // In a real app, you would now restart the bot
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleStartBot = async () => {
    // In a real application, this would start/restart the bot
    // For this demo, we'll simulate starting the bot
    setConfig({
      ...config,
      botStatus: 'starting'
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConfig({
      ...config,
      botStatus: 'online'
    });
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bot Settings</h2>
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSaveSettings}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Discord Bot Token
              </label>
              <input
                type="password"
                name="discordToken"
                value={form.discordToken}
                onChange={handleInputChange}
                placeholder="Enter your Discord bot token"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Create a bot at the Discord Developer Portal
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Discord Client ID
              </label>
              <input
                type="text"
                name="discordClientId"
                value={form.discordClientId}
                onChange={handleInputChange}
                placeholder="Enter your Discord application client ID"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Discord Guild ID
              </label>
              <input
                type="text"
                name="discordGuildId"
                value={form.discordGuildId}
                onChange={handleInputChange}
                placeholder="Enter your Discord server ID"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Enable Developer Mode in Discord to copy server IDs
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Discord Channel ID
              </label>
              <input
                type="text"
                name="discordChannelId"
                value={form.discordChannelId}
                onChange={handleInputChange}
                placeholder="Enter the channel ID to monitor"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="debugMode"
                name="debugMode"
                checked={form.debugMode}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
              />
              <label htmlFor="debugMode" className="ml-2 text-sm text-gray-300">
                Enable Debug Mode
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Provides more detailed logging for troubleshooting
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
            
            {config.isConfigured && (
              <button
                type="button"
                onClick={handleStartBot}
                disabled={config.botStatus === 'starting'}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {config.botStatus === 'starting' ? 'Starting Bot...' : 'Start Bot'}
              </button>
            )}
          </div>
          
          {saveMessage && (
            <div className={`mt-4 p-3 rounded-md ${
              saveMessage.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {saveMessage.text}
            </div>
          )}
        </form>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Item Recognition Settings</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Grid Configuration
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Rows</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="3">3</option>
                <option value="4" selected>4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Columns</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="4">4</option>
                <option value="5" selected>5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Recognition Threshold
          </label>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="70"
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low (more matches)</span>
            <span>High (precise matches)</span>
          </div>
        </div>
      </div>
    </div>
  );
}