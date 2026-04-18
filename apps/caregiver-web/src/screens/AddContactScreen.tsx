import React, { useState } from 'react';
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

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.preferredName || !formData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await addContact({
        ...formData,
        isPostLifeMessenger: true,
        createdAt: new Date(),
      });

      alert(`${formData.preferredName} has been added to your people!`);
      onClose();
    } catch (error) {
      alert('Failed to add contact');
    }
  };

  return (
    <div style={styles.modalContent}>
      <div style={styles.header}>
        <button type="button" onClick={onClose} style={styles.backButton}>← Back</button>
        <h1 style={styles.title}>Add Their People</h1>
        <button type="button" onClick={handleSubmit} style={styles.saveButton}>Save</button>
      </div>

      <div style={styles.form}>
        {/* Photo */}
        <div style={styles.photoContainer}>
          <img src={formData.photoUrl} alt="Contact" style={styles.photo} />
          <div style={styles.photoPlaceholder}>
            <span style={styles.photoPlaceholderText}>📸</span>
            <span style={styles.photoPlaceholderLabel}>Click to change photo</span>
          </div>
        </div>

        {/* Form Fields */}
        <div style={styles.field}>
          <label style={styles.label}>FULL NAME *</label>
          <input
            style={styles.input}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g., David Collins"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>PREFERRED NAME *</label>
          <input
            style={styles.input}
            value={formData.preferredName}
            onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
            placeholder="e.g., David"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>RELATIONSHIP</label>
          <input
            style={styles.input}
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            placeholder="e.g., Son, Daughter, Friend"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>PHONE NUMBER *</label>
          <input
            style={styles.input}
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="e.g., +1-555-0123"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>CITY</label>
          <input
            style={styles.input}
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g., Portland, OR"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>MEMORY CONTEXT</label>
          <textarea
            style={styles.textarea}
            value={formData.memoryContext}
            onChange={(e) => setFormData({ ...formData, memoryContext: e.target.value })}
            placeholder="Share memories, personality traits, or context that helps identify this person..."
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>VOICE INTRODUCTION</label>
          <textarea
            style={styles.textarea}
            value={formData.voiceIntro}
            onChange={(e) => setFormData({ ...formData, voiceIntro: e.target.value })}
            placeholder="What should this person say when calling? e.g., 'Hi Mom, this is David, your son.'"
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#06b6d4',
    fontSize: '18px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  form: {
    // No specific styles needed
  },
  photoContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginBottom: '32px',
    position: 'relative' as const,
  },
  photo: {
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    marginBottom: '16px',
  },
  photoPlaceholder: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
  },
  photoPlaceholderText: {
    fontSize: '32px',
    display: 'block',
  },
  photoPlaceholderLabel: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  field: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#06b6d4',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #374151',
    backgroundColor: '#1f2937',
    color: 'white',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #374151',
    backgroundColor: '#1f2937',
    color: 'white',
    fontSize: '16px',
    resize: 'vertical' as const,
  },
};