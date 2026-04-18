import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
} from 'react-native';
import { Contact } from '../context/ContactContext';

interface Props {
  contact: Contact;
  message: string;
  onAnswer: () => void;
  onDecline: () => void;
}

export default function IncomingCallOverlay({ contact, message, onAnswer, onDecline }: Props) {
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ring animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim1, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim1, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(scaleAnim2, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim2, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Modal transparent visible={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Animation rings */}
          <Animated.View
            style={[
              styles.ring1,
              {
                transform: [{ scale: scaleAnim1 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.ring2,
              {
                transform: [{ scale: scaleAnim2 }],
              },
            ]}
          />
          
          {/* Contact Photo */}
          <Image source={{ uri: contact.photoUrl }} style={styles.avatar} />
          
          {/* Caller Info */}
          <Text style={styles.callerName}>{contact.fullName}</Text>
          <Text style={styles.relationship}>{contact.relationship}</Text>
          
          {/* Explanation Message */}
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>"{message}"</Text>
          </View>
          
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
              <Text style={styles.declineText}>DECLINE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.answerButton} onPress={onAnswer}>
              <Text style={styles.answerText}>ANSWER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    alignItems: 'center',
    padding: 32,
  },
  ring1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: '#06b6d4',
    opacity: 0.3,
  },
  ring2: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: '#06b6d4',
    opacity: 0.1,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: '#06b6d4',
    marginBottom: 24,
  },
  callerName: {
    color: 'white',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 8,
  },
  relationship: {
    color: '#06b6d4',
    fontSize: 20,
    marginBottom: 24,
  },
  messageBox: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    maxWidth: '90%',
  },
  messageText: {
    color: '#e5e7eb',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  declineButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
  },
  declineText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  answerButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
  },
  answerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
