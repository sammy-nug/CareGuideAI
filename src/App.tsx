import React, { useState } from 'react';
import { AboutSafetyView } from './components/AboutSafetyView';
import { AiInsightsView } from './components/AiInsightsView';
import { ChatView } from './components/ChatView';
import { EmergencyModal } from './components/EmergencyModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HealthLibraryView } from './components/HealthLibraryView';
import { HomeView } from './components/HomeView';
import { ThemeProvider } from './context/ThemeContext';
import { ActiveTab, Language, PipelineStage } from './types';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [initialChatQuery, setInitialChatQuery] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');

  const handleStartHealthCheck = (query?: string) => {
    if (query) {
      setInitialChatQuery(query);
    }
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {activeTab === 'home' && (
          <HomeView
            language={language}
            onStartHealthCheck={handleStartHealthCheck}
            onExploreTopic={handleExploreTopic}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView
            language={language}
            initialQuery={initialChatQuery}
            onClearInitialQuery={() => setInitialChatQuery('')}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onPipelineUpdate={(stage) => setPipelineStage(stage)}
          />
        )}

        {activeTab === 'library' && (
          <HealthLibraryView
            language={language}
            selectedTopicId={selectedTopicId}
            onStartHealthCheck={handleStartHealthCheck}
          />
        )}

        {activeTab === 'insights' && (
          <AiInsightsView
            language={language}
            currentStage={pipelineStage}
            onStartHealthCheck={() => handleStartHealthCheck()}
          />
        )}

        {activeTab === 'about' && (
          <AboutSafetyView
            language={language}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}
      </main>

      {/* Persistent Global Footer */}
      <Footer
        setActiveTab={setActiveTab}
        language={language}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Emergency Guidance Protocol Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        language={language}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

