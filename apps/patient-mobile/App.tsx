import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, TouchableOpacity, Text } from 'react-native';
import { ContactProvider } from './src/context/ContactContext';
import { LegacyProvider } from './src/context/LegacyContext';
import PatientInterface from './src/screens/PatientInterface';
import CaregiverPortal from './src/screens/CaregiverPortal';

export default function App() {
  const [activeInterface, setActiveInterface] = useState<'patient' | 'caregiver'>('patient');

  return (
    <ContactProvider>
      <LegacyProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#030712" />
          
          {/* Interface Toggle */}
          <View style={styles.toggleBar}>
            <TouchableOpacity 
              style={[styles.toggleButton, activeInterface === 'patient' && styles.activeToggle]}
              onPress={() => setActiveInterface('patient')}
            >
              <Text style={[styles.toggleText, activeInterface === 'patient' && styles.activeToggleText]}>
                Patient
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, activeInterface === 'caregiver' && styles.activeToggle]}
              onPress={() => setActiveInterface('caregiver')}
            >
              <Text style={[styles.toggleText, activeInterface === 'caregiver' && styles.activeToggleText]}>
                Caregiver
              </Text>
            </TouchableOpacity>
          </View>

          {activeInterface === 'patient' ? <PatientInterface /> : <CaregiverPortal />}
        </SafeAreaView>
      </LegacyProvider>
    </ContactProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  toggleBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1f2937',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 32,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 28,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#06b6d4',
  },
  toggleText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  activeToggleText: {
    color: '#0f172a',
  },
});
