import React from 'react';
import { Settings } from './Settings';
import { ItemLibrary } from './ItemLibrary';
import { ResultsView } from './ResultsView';
import { LogsView } from './LogsView';
import { DashboardHome } from './DashboardHome';

interface DashboardProps {
  activeView: string;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  config: {
    isConfigured: boolean;
    discordChannelId: string;
    discordGuildId: string;
    botStatus: string;
  };
  setConfig: (config: any) => void;
}

export function Dashboard({ 
  activeView, 
  selectedDate,
  setSelectedDate,
  config,
  setConfig
}: DashboardProps) {
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardHome selectedDate={selectedDate} />;
      case 'items':
        return <ItemLibrary />;
      case 'results':
        return <ResultsView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />;
      case 'logs':
        return <LogsView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />;
      case 'settings':
        return <Settings config={config} setConfig={setConfig} />;
      default:
        return <DashboardHome selectedDate={selectedDate} />;
    }
  };

  return (
    <div className="w-full">
      {renderActiveView()}
    </div>
  );
}