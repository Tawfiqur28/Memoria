import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Contact = {
  id: string;
  fullName: string;
  preferredName: string;
  relationship: string;
  phoneNumber: string;
  photoUrl: string;
  city: string;
  memoryContext: string;
  voiceIntro: string;
  isPostLifeMessenger: boolean;
  postLifeMessage?: string;
  postLifeVideo?: string;
  createdAt: Date;
};

type ContactContextType = {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  getContactById: (id: string) => Contact | undefined;
  getContactByPhone: (phone: string) => Contact | undefined;
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) throw new Error('useContacts must be used within ContactProvider');
  return context;
};

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const stored = await AsyncStorage.getItem('memoria_contacts');
      if (stored) {
        setContacts(JSON.parse(stored));
      } else {
        // Demo contacts
        const demoContacts: Contact[] = [
          {
            id: '1',
            fullName: 'David Collins',
            preferredName: 'David',
            relationship: 'Eldest Son',
            phoneNumber: '+1234567890',
            photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
            city: 'London',
            memoryContext: 'Calls every Sunday to check on your garden',
            voiceIntro: 'This is David, your eldest son. He lives in London with his family.',
            isPostLifeMessenger: true,
            postLifeMessage: 'Dad, I hope you found peace. Thank you for everything. I\'ll always remember our fishing trips.',
            createdAt: new Date(),
          },
          {
            id: '2',
            fullName: 'Sarah Johnson',
            preferredName: 'Sarah',
            relationship: 'Daughter',
            phoneNumber: '+1234567891',
            photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
            city: 'New York',
            memoryContext: 'Your daughter who became a doctor just like you wanted',
            voiceIntro: 'This is Sarah, your daughter. She became a doctor, just like you dreamed.',
            isPostLifeMessenger: true,
            postLifeMessage: 'Mom, you inspired me every day. I love you forever.',
            createdAt: new Date(),
          },
        ];
        setContacts(demoContacts);
        await AsyncStorage.setItem('memoria_contacts', JSON.stringify(demoContacts));
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const saveContacts = async (newContacts: Contact[]) => {
    try {
      await AsyncStorage.setItem('memoria_contacts', JSON.stringify(newContacts));
    } catch (error) {
      console.error('Failed to save contacts:', error);
    }
  };

  const addContact = async (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updated = [...contacts, newContact];
    setContacts(updated);
    await saveContacts(updated);
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    const updated = contacts.map(c => c.id === id ? { ...c, ...updates } : c);
    setContacts(updated);
    await saveContacts(updated);
  };

  const deleteContact = async (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    await saveContacts(updated);
  };

  const getContactById = (id: string) => contacts.find(c => c.id === id);
  const getContactByPhone = (phone: string) => contacts.find(c => c.phoneNumber === phone);

  return (
    <ContactContext.Provider value={{ contacts, addContact, updateContact, deleteContact, getContactById, getContactByPhone }}>
      {children}
    </ContactContext.Provider>
  );
};
