import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LegacyMessage {
  id: string;
  contactId: string;
  message: string;
  createdAt: Date;
}

interface LegacyContextType {
  legacyMessages: LegacyMessage[];
  isPatientDeceased: boolean;
  setPatientDeceased: (deceased: boolean) => void;
  addLegacyMessage: (contactId: string, message: string) => Promise<void>;
  loadLegacyMessages: () => Promise<void>;
}

const LegacyContext = createContext<LegacyContextType | undefined>(undefined);

export const useLegacy = () => {
  const context = useContext(LegacyContext);
  if (!context) {
    throw new Error('useLegacy must be used within a LegacyProvider');
  }
  return context;
};

interface LegacyProviderProps {
  children: ReactNode;
}

export const LegacyProvider: React.FC<LegacyProviderProps> = ({ children }) => {
  const [legacyMessages, setLegacyMessages] = useState<LegacyMessage[]>([]);
  const [isPatientDeceased, setIsPatientDeceased] = useState(false);

  const loadLegacyMessages = async () => {
    try {
      const stored = localStorage.getItem('memoria_legacy_messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        const messagesWithDates = parsed.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt)
        }));
        setLegacyMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Error loading legacy messages:', error);
    }
  };

  const addLegacyMessage = async (contactId: string, message: string) => {
    try {
      const newMessage: LegacyMessage = {
        id: Date.now().toString(),
        contactId,
        message,
        createdAt: new Date(),
      };
      const updatedMessages = [...legacyMessages, newMessage];
      setLegacyMessages(updatedMessages);
      localStorage.setItem('memoria_legacy_messages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error adding legacy message:', error);
      throw error;
    }
  };

  const handleSetPatientDeceased = (deceased: boolean) => {
    setIsPatientDeceased(deceased);
    localStorage.setItem('memoria_patient_deceased', JSON.stringify(deceased));
    if (deceased) {
      // In a real app, this would trigger delivery of legacy messages
      console.log('Patient marked as deceased - legacy messages would be delivered');
    }
  };

  useEffect(() => {
    loadLegacyMessages();
    const storedDeceased = localStorage.getItem('memoria_patient_deceased');
    if (storedDeceased) {
      setIsPatientDeceased(JSON.parse(storedDeceased));
    }
  }, []);

  return (
    <LegacyContext.Provider value={{
      legacyMessages,
      isPatientDeceased,
      setPatientDeceased: handleSetPatientDeceased,
      addLegacyMessage,
      loadLegacyMessages
    }}>
      {children}
    </LegacyContext.Provider>
  );
};