
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { AppContext } from './AppContext';

const SettingsTab = () => {
  // Get shared data and update function from Context API
  const { username, updateUsername, isSaving } =
    useContext(AppContext);

  const [newName, setNewName] = useState(username);
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmedName = newName.trim();

    if (trimmedName === '') {
      setError('Please enter a username.');
      return;
    }

    setError('');
    updateUsername(trimmedName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Username</Text>
        <Text style={styles.currentName}>{username}</Text>

        <Text style={styles.label}>Enter New Username</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={newName}
          onChangeText={setNewName}
          editable={!isSaving}
        />

        {error !== '' && (
          <Text style={styles.error}>{error}</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        {isSaving && (
          <Text style={styles.savingText}>
            Please wait while your profile is being saved.
          </Text>
        )}
      </View>
    </View>
  );
};

export default SettingsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#243B64',
    textAlign: 'center',
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 8,
  },
  currentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8C83C6',
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 13,
    fontSize: 16,
    marginBottom: 15,
    color: '#222222',
  },
  button: {
    backgroundColor: '#243B64',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savingText: {
    color: '#7f76bb',
    textAlign: 'center',
    marginTop: 15,
  },
  error: {
    color: '#D93025',
    marginBottom: 12,
  },
});
