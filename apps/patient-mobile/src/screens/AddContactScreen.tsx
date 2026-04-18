import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useContacts } from '../context/ContactContext';

interface Props {
  onClose: () => void;
}

export default function AddContactScreen({ onClose }: Props) {
  const { addContact } = useContacts();
  const [formData, setFormData] = useState({
    fullName: '',
    preferredName: '',
    relationship: '',
    phoneNumber: '',
    city: '',
    memoryContext: '',
    voiceIntro: '',
    photoUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      
      if (!result.canceled) {
        setFormData({ ...formData, photoUrl: result.assets[0].uri });
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.preferredName || !formData.phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await addContact({
        ...formData,
        isPostLifeMessenger: true,
        createdAt: new Date(),
      });

      Alert.alert('Success', `${formData.preferredName} has been added to your people!`);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add contact');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Their People</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* Photo */}
        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
          {formData.photoUrl ? (
            <Image source={{ uri: formData.photoUrl }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>📸</Text>
              <Text style={styles.photoPlaceholderLabel}>Click to add photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.field}>
          <Text style={styles.label}>FULL NAME *</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="e.g., David Collins"
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>PREFERRED NAME *</Text>
          <TextInput
            style={styles.input}
            value={formData.preferredName}
            onChangeText={(text) => setFormData({ ...formData, preferredName: text })}
            placeholder="e.g., David"
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>RELATIONSHIP</Text>
          <TextInput
            style={styles.input}
            value={formData.relationship}
            onChangeText={(text) => setFormData({ ...formData, relationship: text })}
            placeholder="e.g., Eldest Son"
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>PHONE NUMBER *</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            placeholder="+1234567890"
            placeholderTextColor="#6b7280"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>CITY</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholder="e.g., London"
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>MEMORY CONTEXT</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.memoryContext}
            onChangeText={(text) => setFormData({ ...formData, memoryContext: text })}
            placeholder="e.g., Calls every Sunday to check on your garden"
            placeholderTextColor="#6b7280"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>VOICE INTRODUCTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.voiceIntro}
            onChangeText={(text) => setFormData({ ...formData, voiceIntro: text })}
            placeholder="e.g., This is David, your eldest son. He lives in London..."
            placeholderTextColor="#6b7280"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
          <Text style={styles.nextButtonText}>Add their people →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  backButton: {
    color: '#06b6d4',
    fontSize: 18,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  saveButton: {
    color: '#06b6d4',
    fontSize: 18,
    fontWeight: '600',
  },
  form: {
    padding: 20,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    fontSize: 40,
  },
  photoPlaceholderLabel: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 14,
    color: 'white',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  nextButton: {
    backgroundColor: '#06b6d4',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
});
