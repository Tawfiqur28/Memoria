import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Contact {
  id: string;
  fullName: string;
  preferredName: string;
  relationship: string;
  phoneNumber: string;
  city: string;
  memoryContext: string;
  voiceIntro: string;
  photoUrl: string;
  isPostLifeMessenger: boolean;
  createdAt: Date;
}

interface ContactContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  loadContacts: () => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};

interface ContactProviderProps {
  children: ReactNode;
}

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const loadContacts = async () => {
    try {
      const stored = localStorage.getItem('memoria_contacts');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert createdAt back to Date
        const contactsWithDates = parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt)
        }));
        setContacts(contactsWithDates);
      } else {
        // Load demo contacts
        const demoContacts: Contact[] = [
          {
            id: '1',
            fullName: 'David Collins',
            preferredName: 'David',
            relationship: 'Son',
            phoneNumber: '+1-555-0123',
            city: 'Portland, OR',
            memoryContext: 'My wonderful son who visits every Sunday. Loves fishing and tells the best jokes.',
            voiceIntro: 'Hi Mom, this is David, your son. I love you very much.',
            photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
            isPostLifeMessenger: true,
            createdAt: new Date(),
          },
          {
            id: '2',
            fullName: 'Sarah Collins',
            preferredName: 'Sarah',
            relationship: 'Daughter',
            phoneNumber: '+1-555-0456',
            city: 'Seattle, WA',
            memoryContext: 'My beautiful daughter who sings like an angel. Always brings flowers.',
            voiceIntro: 'Hello Grandma, this is Sarah. I miss our baking days.',
            photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
            isPostLifeMessenger: true,
            createdAt: new Date(),
          },
        ];
        setContacts(demoContacts);
        localStorage.setItem('memoria_contacts', JSON.stringify(demoContacts));
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const addContact = async (contactData: Omit<Contact, 'id' | 'createdAt'>) => {
    try {
      const newContact: Contact = {
        ...contactData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      const updatedContacts = [...contacts, newContact];
      setContacts(updatedContacts);
      localStorage.setItem('memoria_contacts', JSON.stringify(updatedContacts));
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const updatedContacts = contacts.filter(c => c.id !== id);
      setContacts(updatedContacts);
      localStorage.setItem('memoria_contacts', JSON.stringify(updatedContacts));
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <ContactContext.Provider value={{ contacts, addContact, deleteContact, loadContacts }}>
      {children}
    </ContactContext.Provider>
  );
};