import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
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
    Alert.alert(
      'Mark as Deceased',
      'Are you sure? This will deliver all post-life messages to family members.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          style: 'destructive',
          onPress: () => setPatientDeceased(true)
        },
      ]
    );
  };

  const handleAddLegacyMessage = async () => {
    if (!legacyMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }
    await addLegacyMessage(selectedContact.id, legacyMessage);
    Alert.alert('Success', 'Legacy message saved. It will be delivered after the patient passes.');
    setShowLegacyModal(false);
    setLegacyMessage('');
  };

  if (showAddContact) {
    return <AddContactScreen onClose={() => setShowAddContact(false)} />;
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'contacts' && styles.activeTab]}
          onPress={() => setSelectedTab('contacts')}
        >
          <Text style={[styles.tabText, selectedTab === 'contacts' && styles.activeTabText]}>
            CONTACTS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'facts' && styles.activeTab]}
          onPress={() => setSelectedTab('facts')}
        >
          <Text style={[styles.tabText, selectedTab === 'facts' && styles.activeTabText]}>
            FACTS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'logs' && styles.activeTab]}
          onPress={() => setSelectedTab('logs')}
        >
          <Text style={[styles.tabText, selectedTab === 'logs' && styles.activeTabText]}>
            LOGS
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'contacts' && (
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Contact Management</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowAddContact(true)}
                >
                  <Text style={styles.addButtonText}>+ Add Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deceasedButton}
                  onPress={handleMarkDeceased}
                >
                  <Text style={styles.deceasedButtonText}>
                    {isPatientDeceased ? 'Deceased ✓' : 'Mark as Deceased'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {contacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.fullName}</Text>
                  <Text style={styles.contactDetail}>{contact.relationship}</Text>
                  <Text style={styles.contactDetail}>📞 {contact.phoneNumber}</Text>
                  <Text style={styles.contactDetail}>📍 {contact.city}</Text>
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity 
                    style={styles.legacyButton}
                    onPress={() => {
                      setSelectedContact(contact);
                      setShowLegacyModal(true);
                    }}
                  >
                    <Text style={styles.legacyButtonText}>💝</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteContact(contact.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'facts' && (
          <View>
            <Text style={styles.title}>Life Context & Memory Facts</Text>
            
            <View style={styles.factCard}>
              <Text style={styles.factTitle}>📝 Important Memories</Text>
              <Text style={styles.factText}>• Loves gardening, especially roses</Text>
              <Text style={styles.factText}>• Former school teacher for 35 years</Text>
              <Text style={styles.factText}>• Favorite song: "Somewhere Over the Rainbow"</Text>
              <Text style={styles.factText}>• Allergic to penicillin</Text>
              <TouchableOpacity style={styles.addFactButton}>
                <Text style={styles.addFactText}>+ Add Memory Fact</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.factCard}>
              <Text style={styles.factTitle}>⚠️ Trigger Topics to Avoid</Text>
              <View style={styles.triggerTag}>
                <Text style={styles.triggerText}>The 1960 fire</Text>
              </View>
              <View style={styles.triggerTag}>
                <Text style={styles.triggerText}>Debt</Text>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'logs' && (
          <View>
            <Text style={styles.title}>Activity Logs</Text>
            
            <View style={styles.logCard}>
              <Text style={styles.logDate}>Today, 10:45 AM</Text>
              <Text style={styles.logText}>📞 Incoming call from David - Answered</Text>
            </View>
            <View style={styles.logCard}>
              <Text style={styles.logDate}>Yesterday, 06:30 PM</Text>
              <Text style={styles.logText}>💬 Voice memo recorded - Mood: Content</Text>
            </View>
            <View style={styles.logCard}>
              <Text style={styles.logDate}>Yesterday, 11:00 AM</Text>
              <Text style={styles.logText}>🌅 Daily routine: Garden walk completed</Text>
            </View>
            <View style={styles.logCard}>
              <Text style={styles.logDate}>2 days ago, 06:00 PM</Text>
              <Text style={styles.logText}>🍽️ Dinner taken with assistance</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Legacy Message Modal */}
      <Modal visible={showLegacyModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Legacy Message</Text>
            <Text style={styles.modalSubtitle}>
              For {selectedContact?.preferredName}
            </Text>
            <Text style={styles.modalDescription}>
              This message will be delivered to {selectedContact?.preferredName} after the patient passes away.
            </Text>
            
            <TextInput
              style={styles.legacyInput}
              multiline
              numberOfLines={6}
              placeholder="Write your legacy message..."
              placeholderTextColor="#6b7280"
              value={legacyMessage}
              onChangeText={setLegacyMessage}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLegacyModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddLegacyMessage}
              >
                <Text style={styles.saveButtonText}>Save Legacy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#06b6d4',
  },
  tabText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  deceasedButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deceasedButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDetail: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  legacyButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  legacyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  factCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  factTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  factText: {
    color: '#e5e7eb',
    fontSize: 14,
    marginBottom: 8,
  },
  addFactButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  addFactText: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '500',
  },
  triggerTag: {
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  triggerText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  logCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  logDate: {
    color: '#06b6d4',
    fontSize: 12,
    marginBottom: 4,
  },
  logText: {
    color: '#e5e7eb',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: 24,
    padding: 24,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#06b6d4',
    fontSize: 16,
    marginBottom: 16,
  },
  modalDescription: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 20,
  },
  legacyInput: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 150,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  cancelButtonText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#8b5cf6',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
