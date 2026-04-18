import React, { useState } from 'react';
import { useContacts } from '../context/ContactContext';
import { useLegacy } from '../context/LegacyContext';
import AddContactScreen from './AddContactScreen';

export default function CaregiverPortal() {
  const { contacts, deleteContact } = useContacts();
  const { isPatientDeceased, setPatientDeceased, addLegacyMessage } = useLegacy();
  const [selectedTab, setSelectedTab] = useState<'contacts' | 'facts' | 'logs'>('contacts');
  const [showLegacyModal, setShowLegacyModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [legacyMessage, setLegacyMessage] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  const handleMarkDeceased = () => {
    const confirmed = window.confirm(
      'Mark as Deceased\nAre you sure? This will deliver all post-life messages to family members.'
    );
    if (confirmed) {
      setPatientDeceased(true);
    }
  };

  const handleAddLegacyMessage = async () => {
    if (!legacyMessage.trim()) {
      alert('Please enter a message');
      return;
    }
    try {
      await addLegacyMessage(selectedContact.id, legacyMessage);
      alert('Legacy message saved. It will be delivered after the patient passes.');
      setShowLegacyModal(false);
      setLegacyMessage('');
    } catch (error) {
      alert('Error saving legacy message');
    }
  };

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabBar}>
        <button
          style={[styles.tab, selectedTab === 'contacts' && styles.activeTab]}
          onClick={() => setSelectedTab('contacts')}
        >
          CONTACTS
        </button>
        <button
          style={[styles.tab, selectedTab === 'facts' && styles.activeTab]}
          onClick={() => setSelectedTab('facts')}
        >
          FACTS
        </button>
        <button
          style={[styles.tab, selectedTab === 'logs' && styles.activeTab]}
          onClick={() => setSelectedTab('logs')}
        >
          LOGS
        </button>
      </div>

      <div style={styles.content}>
        {selectedTab === 'contacts' && (
          <div>
            <div style={styles.header}>
              <h1 style={styles.title}>Contact Management</h1>
              <div style={styles.headerButtons}>
                <button
                  type="button"
                  style={styles.addButton}
                  onClick={() => setShowAddContact(true)}
                >
                  + Add Contact
                </button>
                <button
                  style={styles.deceasedButton}
                  onClick={handleMarkDeceased}
                >
                  {isPatientDeceased ? 'Deceased ✓' : 'Mark as Deceased'}
                </button>
              </div>
            </div>

            {contacts.map((contact) => (
              <div key={contact.id} style={styles.contactCard}>
                <div style={styles.contactInfo}>
                  <div style={styles.contactName}>{contact.fullName}</div>
                  <div style={styles.contactDetail}>{contact.relationship}</div>
                  <div style={styles.contactDetail}>📞 {contact.phoneNumber}</div>
                  <div style={styles.contactDetail}>📍 {contact.city}</div>
                </div>
                <div style={styles.contactActions}>
                  <button
                    style={styles.legacyButton}
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowLegacyModal(true);
                    }}
                  >
                    💝
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => deleteContact(contact.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'facts' && (
          <div>
            <h1 style={styles.title}>Life Context & Memory Facts</h1>

            <div style={styles.factCard}>
              <h2 style={styles.factTitle}>📝 Important Memories</h2>
              <p style={styles.factText}>• Loves gardening, especially roses</p>
              <p style={styles.factText}>• Former school teacher for 35 years</p>
              <p style={styles.factText}>• Favorite song: "Somewhere Over the Rainbow"</p>
              <p style={styles.factText}>• Allergic to penicillin</p>
              <button style={styles.addFactButton}>+ Add Memory Fact</button>
            </div>

            <div style={styles.factCard}>
              <h2 style={styles.factTitle}>⚠️ Trigger Topics to Avoid</h2>
              <div style={styles.triggerTag}>
                <span style={styles.triggerText}>The 1960 fire</span>
              </div>
              <div style={styles.triggerTag}>
                <span style={styles.triggerText}>Debt</span>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'logs' && (
          <div>
            <h1 style={styles.title}>Activity Logs</h1>

            <div style={styles.logCard}>
              <div style={styles.logDate}>Today, 10:45 AM</div>
              <div style={styles.logText}>📞 Incoming call from David - Answered</div>
            </div>
            <div style={styles.logCard}>
              <div style={styles.logDate}>Yesterday, 06:30 PM</div>
              <div style={styles.logText}>💬 Voice memo recorded - Mood: Content</div>
            </div>
            <div style={styles.logCard}>
              <div style={styles.logDate}>Yesterday, 11:00 AM</div>
              <div style={styles.logText}>🌅 Daily routine: Garden walk completed</div>
            </div>
            <div style={styles.logCard}>
              <div style={styles.logDate}>2 days ago, 06:00 PM</div>
              <div style={styles.logText}>🍽️ Dinner taken with assistance</div>
            </div>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div style={styles.modalOverlay}>
          <AddContactScreen onClose={() => setShowAddContact(false)} />
        </div>
      )}

      {/* Legacy Message Modal */}
      {showLegacyModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Add Legacy Message</h2>
            <p style={styles.modalSubtitle}>
              For {selectedContact?.preferredName}
            </p>
            <p style={styles.modalDescription}>
              This message will be delivered to {selectedContact?.preferredName} after the patient passes away.
            </p>

            <textarea
              style={styles.legacyInput}
              placeholder="Write your legacy message..."
              value={legacyMessage}
              onChange={(e) => setLegacyMessage(e.target.value)}
            />

            <div style={styles.modalButtons}>
              <button
                style={[styles.modalButton, styles.cancelButton]}
                onClick={() => setShowLegacyModal(false)}
              >
                Cancel
              </button>
              <button
                style={[styles.modalButton, styles.saveButton]}
                onClick={handleAddLegacyMessage}
              >
                Save Legacy
              </button>
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
  },
  tabBar: {
    display: 'flex',
    backgroundColor: '#1f2937',
    marginHorizontal: '16px',
    marginTop: '16px',
    borderRadius: '12px',
    padding: '4px',
  },
  tab: {
    flex: 1,
    paddingVertical: '12px',
    textAlign: 'center' as const,
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  activeTab: {
    backgroundColor: '#06b6d4',
    color: '#0f172a',
  },
  content: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerButtons: {
    display: 'flex',
    gap: '12px',
  },
  addButton: {
    backgroundColor: '#06b6d4',
    color: '#0f172a',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deceasedButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '20px',
  },
  contactCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
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
  contactDetail: {
    fontSize: '14px',
    color: '#9ca3af',
    marginTop: '2px',
  },
  contactActions: {
    display: 'flex',
    gap: '8px',
  },
  legacyButton: {
    backgroundColor: '#8b5cf6',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  factCard: {
    backgroundColor: '#1f2937',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
  },
  factTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '12px',
  },
  factText: {
    color: '#e5e7eb',
    fontSize: '14px',
    marginBottom: '8px',
  },
  addFactButton: {
    backgroundColor: '#06b6d4',
    color: '#0f172a',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '12px',
  },
  triggerTag: {
    display: 'inline-block',
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    marginRight: '8px',
    marginBottom: '8px',
  },
  triggerText: {
    color: 'white',
  },
  logCard: {
    backgroundColor: '#1f2937',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
  },
  logDate: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  logText: {
    fontSize: '16px',
    color: 'white',
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
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px',
  },
  modalSubtitle: {
    fontSize: '18px',
    color: '#06b6d4',
    marginBottom: '16px',
  },
  modalDescription: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '20px',
  },
  legacyInput: {
    width: '100%',
    minHeight: '120px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #374151',
    backgroundColor: '#111827',
    color: 'white',
    fontSize: '16px',
    marginBottom: '20px',
    resize: 'vertical' as const,
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#374151',
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#10b981',
    color: 'white',
  },
};