
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { AppContext } from './AppContext';

const HomeTab = () => {
  // Get shared username from Context API
  const { username } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Annyeong! Welcome!</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Your Current Username</Text>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.message}>
          Your profile information is shared across tabs.
        </Text>
      </View>
    </View>
  );
};

export default HomeTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#243B64',
    marginBottom: 25,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 3,
  },
  label: {
    fontSize: 15,
    color: '#777777',
    marginBottom: 10,
  },
  username: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#857eb3',
    marginBottom: 15,
  },
  message: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
  },
});
