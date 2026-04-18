import React, { useState, useEffect } from 'react';
import { useContacts } from '../context/ContactContext';
import { useLegacy } from '../context/LegacyContext';
import AddContactScreen from './AddContactScreen';

export default function PatientInterface() {
  const { contacts } = useContacts();
  const { isPatientDeceased, legacyMessages } = useLegacy();
  const [showAddContact, setShowAddContact] = useState(false);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate incoming call (for demo)
  useEffect(() => {
    const timer = setTimeout(() => {
      const demoContact = contacts[0];
      if (demoContact) {
        setIncomingCall({
          contact: demoContact,
          message: `"${demoContact.memoryContext}"`,
        });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [contacts]);

  const handleAnswerCall = () => {
    alert(`Call Connected\nThis is ${incomingCall?.contact?.preferredName}, ${incomingCall?.contact?.relationship}.`);
    setIncomingCall(null);
  };

  const handleDeclineCall = () => {
    setIncomingCall(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.scrollView}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.greeting}>Hello, Margaret</h1>
          <div style={styles.time}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div style={styles.date}>
            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Daily Routine */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Daily Routine</h2>
          <div style={styles.routineItem}>
            <span style={styles.routineTime}>🌅 11:00 AM</span>
            <span style={styles.routineText}>Garden Walk</span>
          </div>
          <div style={styles.routineItem}>
            <span style={styles.routineTime}>🍽️ 06:00 PM</span>
            <span style={styles.routineText}>Dinner</span>
          </div>
        </div>

        {/* Trigger Topics */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Topics to Avoid</h2>
          <div style={styles.topicsContainer}>
            <div style={styles.topicTag}>
              <span style={styles.topicText}>🔥 The 1960 Fire</span>
            </div>
            <div style={{...styles.topicTag, ...styles.topicTagWarning}}>
              <span style={styles.topicText}>💳 Debt</span>
            </div>
          </div>
        </div>

        {/* Contacts Section */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Your People</h2>
            <button type="button" onClick={() => setShowAddContact(true)} style={styles.addButton}>
              Add Their People
            </button>
          </div>

          {contacts.map((contact) => (
            <div key={contact.id} style={styles.contactCard}>
              <img src={contact.photoUrl} alt={contact.preferredName} style={styles.contactPhoto} />
              <div style={styles.contactInfo}>
                <div style={styles.contactName}>{contact.preferredName}</div>
                <div style={styles.contactRelationship}>{contact.relationship}</div>
                <div style={styles.contactContext}>{contact.memoryContext}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Post-Life Legacy Section */}
        {isPatientDeceased && legacyMessages.length > 0 && (
          <div style={{...styles.card, ...styles.legacyCard}}>
            <h2 style={styles.cardTitle}>💝 Messages From Beyond</h2>
            {legacyMessages.map((msg) => {
              const contact = contacts.find(c => c.id === msg.contactId);
              return (
                <div key={msg.id} style={styles.legacyMessage}>
                  <div style={styles.legacyFrom}>From {contact?.preferredName}:</div>
                  <div style={styles.legacyText}>"{msg.message}"</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div style={styles.modalOverlay}>
          <AddContactScreen onClose={() => setShowAddContact(false)} />
        </div>
      )}

      {/* Incoming Call Overlay */}
      {incomingCall && (
        <div style={styles.overlay}>
          <div style={styles.callModal}>
            <h2 style={styles.callTitle}>Incoming Call</h2>
            <img src={incomingCall.contact.photoUrl} alt={incomingCall.contact.preferredName} style={styles.callPhoto} />
            <h3 style={styles.callName}>{incomingCall.contact.preferredName}</h3>
            <p style={styles.callRelationship}>{incomingCall.contact.relationship}</p>
            <p style={styles.callMessage}>{incomingCall.message}</p>
            <div style={styles.callButtons}>
              <button onClick={handleDeclineCall} style={styles.declineButton}>Decline</button>
              <button onClick={handleAnswerCall} style={styles.answerButton}>Answer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#030712',
    color: 'white',
    minHeight: '100vh',
    padding: '20px',
  },
  scrollView: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  greeting: {
    fontSize: '34px',
    fontWeight: '700',
    marginBottom: '8px',
    color: 'white',
  },
  time: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#06b6d4',
  },
  date: {
    fontSize: '16px',
    color: '#6b7280',
    marginTop: '4px',
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'white',
    margin: '0',
  },
  addButton: {
    backgroundColor: '#06b6d4',
    color: '#0f172a',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  routineItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  routineTime: {
    color: '#06b6d4',
    fontSize: '16px',
  },
  routineText: {
    color: 'white',
    fontSize: '16px',
  },
  topicsContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const,
  },
  topicTag: {
    backgroundColor: '#374151',
    padding: '8px 12px',
    borderRadius: '20px',
  },
  topicTagWarning: {
    backgroundColor: '#dc2626',
  },
  topicText: {
    color: 'white',
    fontSize: '14px',
  },
  contactCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#374151',
    borderRadius: '16px',
    marginBottom: '12px',
  },
  contactPhoto: {
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    marginRight: '16px',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '4px',
  },
  contactRelationship: {
    fontSize: '14px',
    color: '#06b6d4',
    marginBottom: '4px',
  },
  contactContext: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  legacyCard: {
    borderLeft: '4px solid #8b5cf6',
  },
  legacyMessage: {
    marginBottom: '16px',
    padding: '16px',
    backgroundColor: '#374151',
    borderRadius: '12px',
  },
  legacyFrom: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#06b6d4',
    marginBottom: '8px',
  },
  legacyText: {
    fontSize: '16px',
    color: '#e5e7eb',
    fontStyle: 'italic',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  callModal: {
    backgroundColor: '#1f2937',
    borderRadius: '20px',
    padding: '32px',
    textAlign: 'center' as const,
    maxWidth: '400px',
    width: '90%',
  },
  callTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '24px',
  },
  callPhoto: {
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    marginBottom: '16px',
  },
  callName: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px',
  },
  callRelationship: {
    fontSize: '18px',
    color: '#06b6d4',
    marginBottom: '16px',
  },
  callMessage: {
    fontSize: '16px',
    color: '#9ca3af',
    marginBottom: '32px',
    fontStyle: 'italic',
  },
  callButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  },
  declineButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  answerButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};