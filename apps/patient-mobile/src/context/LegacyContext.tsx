import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LegacyMessage = {
  id: string;
  contactId: string;
  message: string;
  videoUrl?: string;
  scheduledDate?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
};

type LegacyContextType = {
  legacyMessages: LegacyMessage[];
  addLegacyMessage: (contactId: string, message: string, videoUrl?: string) => Promise<void>;
  isPatientDeceased: boolean;
  setPatientDeceased: (value: boolean) => Promise<void>;
  deliverLegacyMessages: () => Promise<void>;
};

const LegacyContext = createContext<LegacyContextType | undefined>(undefined);

export const useLegacy = () => {
  const context = useContext(LegacyContext);
  if (!context) throw new Error('useLegacy must be used within LegacyProvider');
  return context;
};

export const LegacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [legacyMessages, setLegacyMessages] = useState<LegacyMessage[]>([]);
  const [isPatientDeceased, setIsPatientDeceasedState] = useState(false);

  useEffect(() => {
    loadLegacyData();
  }, []);

  const loadLegacyData = async () => {
    try {
      const messages = await AsyncStorage.getItem('memoria_legacy_messages');
      const deceased = await AsyncStorage.getItem('memoria_patient_deceased');
      if (messages) setLegacyMessages(JSON.parse(messages));
      if (deceased) setIsPatientDeceasedState(JSON.parse(deceased));
    } catch (error) {
      console.error('Failed to load legacy data:', error);
    }
  };

  const addLegacyMessage = async (contactId: string, message: string, videoUrl?: string) => {
    const newMessage: LegacyMessage = {
      id: Date.now().toString(),
      contactId,
      message,
      videoUrl,
      isDelivered: false,
    };
    const updated = [...legacyMessages, newMessage];
    setLegacyMessages(updated);
    await AsyncStorage.setItem('memoria_legacy_messages', JSON.stringify(updated));
  };

  const setPatientDeceased = async (value: boolean) => {
    setIsPatientDeceasedState(value);
    await AsyncStorage.setItem('memoria_patient_deceased', JSON.stringify(value));
    if (value) {
      await deliverLegacyMessages();
    }
  };

  const deliverLegacyMessages = async () => {
    const updated = legacyMessages.map(msg => ({
      ...msg,
      isDelivered: true,
      deliveredAt: new Date(),
    }));
    setLegacyMessages(updated);
    await AsyncStorage.setItem('memoria_legacy_messages', JSON.stringify(updated));
  };

  return (
    <LegacyContext.Provider value={{ legacyMessages, addLegacyMessage, setPatientDeceased, isPatientDeceased, deliverLegacyMessages }}>
      {children}
    </LegacyContext.Provider>
  );
};
