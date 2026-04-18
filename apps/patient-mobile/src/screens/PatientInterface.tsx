import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useContacts } from '../context/ContactContext';
import { useLegacy } from '../context/LegacyContext';
import IncomingCallOverlay from '../components/IncomingCallOverlay';
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
    Alert.alert(
      'Call Connected',
      incomingCall?.contact?.voiceIntro || `This is ${incomingCall?.contact?.preferredName}, ${incomingCall?.contact?.relationship}.`,
      [{ text: 'End Call', onPress: () => setIncomingCall(null) }]
    );
  };

  const handleDeclineCall = () => {
    setIncomingCall(null);
  };

  if (showAddContact) {
    return <AddContactScreen onClose={() => setShowAddContact(false)} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, Margaret
          </Text>
          <Text style={styles.time}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.date}>
            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>

        {/* Daily Routine */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Routine</Text>
          <View style={styles.routineItem}>
            <Text style={styles.routineTime}>🌅 11:00 AM</Text>
            <Text style={styles.routineText}>Garden Walk</Text>
          </View>
          <View style={styles.routineItem}>
            <Text style={styles.routineTime}>🍽️ 06:00 PM</Text>
            <Text style={styles.routineText}>Dinner</Text>
          </View>
        </View>

        {/* Trigger Topics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Topics to Avoid</Text>
          <View style={styles.topicsContainer}>
            <View style={styles.topicTag}>
              <Text style={styles.topicText}>🔥 The 1960 Fire</Text>
            </View>
            <View style={[styles.topicTag, styles.topicTagWarning]}>
              <Text style={styles.topicText}>💳 Debt</Text>
            </View>
          </View>
        </View>

        {/* Contacts Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Your People</Text>
            <TouchableOpacity onPress={() => setShowAddContact(true)}>
              <Text style={styles.addButton}>+ Add</Text>
            </TouchableOpacity>
          </View>
          
          {contacts.map((contact) => (
            <TouchableOpacity key={contact.id} style={styles.contactCard}>
              <Image source={{ uri: contact.photoUrl }} style={styles.contactPhoto} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.preferredName}</Text>
                <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                <Text style={styles.contactContext}>{contact.memoryContext}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Post-Life Legacy Section */}
        {isPatientDeceased && legacyMessages.length > 0 && (
          <View style={[styles.card, styles.legacyCard]}>
            <Text style={styles.cardTitle}>💝 Messages From Beyond</Text>
            {legacyMessages.map((msg) => {
              const contact = contacts.find(c => c.id === msg.contactId);
              return (
                <View key={msg.id} style={styles.legacyMessage}>
                  <Text style={styles.legacyFrom}>From {contact?.preferredName}:</Text>
                  <Text style={styles.legacyText}>"{msg.message}"</Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Incoming Call Overlay */}
      {incomingCall && (
        <IncomingCallOverlay
          contact={incomingCall.contact}
          message={incomingCall.message}
          onAnswer={handleAnswerCall}
          onDecline={handleDeclineCall}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    color: 'white',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 8,
  },
  time: {
    color: '#06b6d4',
    fontSize: 48,
    fontWeight: '700',
  },
  date: {
    color: '#6b7280',
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  addButton: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '500',
  },
  routineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routineTime: {
    color: '#06b6d4',
    fontSize: 16,
    fontWeight: '600',
    width: 100,
  },
  routineText: {
    color: '#e5e7eb',
    fontSize: 16,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicTag: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  topicTagWarning: {
    backgroundColor: '#7f1d1d',
  },
  topicText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  contactPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  contactRelationship: {
    color: '#06b6d4',
    fontSize: 14,
    marginTop: 2,
  },
  contactContext: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  legacyCard: {
    backgroundColor: '#1e1b4b',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  legacyMessage: {
    backgroundColor: '#2e2a5e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  legacyFrom: {
    color: '#c4b5fd',
    fontSize: 14,
    marginBottom: 8,
  },
  legacyText: {
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
  },
});
