
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { saveNotes, loadNotes } from './StorageService';
import NoteItem from './NoteItem';
import styles from './styles';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // READ: Load saved notes when the app first opens
  useEffect(() => {
    const getSavedNotes = async () => {
      try {
        const savedNotes = await loadNotes();
        setNotes(savedNotes);
      } catch (err) {
        setError('Unable to load saved notes.');
      } finally {
        setIsLoading(false);
      }
    };

    getSavedNotes();
  }, []);

  // CREATE and UPDATE: Add a new note or save an edited note
  const handleSaveNote = async () => {
    const trimmedTitle = noteTitle.trim();

    if (trimmedTitle === '') {
      Alert.alert('Empty Note', 'Please enter a note first.');
      return;
    }

    let updatedNotes;

    if (editingId !== null) {
      // UPDATE an existing note
      updatedNotes = notes.map((note) =>
        note.id === editingId
          ? { ...note, title: trimmedTitle }
          : note
      );
    } else {
      // CREATE a new note
      const newNote = {
        id: Date.now().toString(),
        title: trimmedTitle,
        date: new Date().toLocaleString(),
      };

      updatedNotes = [newNote, ...notes];
    }

    try {
      // Save the updated array to device storage
      await saveNotes(updatedNotes);

      // Update the screen after saving succeeds
      setNotes(updatedNotes);
      setNoteTitle('');
      setEditingId(null);
      setError('');
    } catch (err) {
      setError('Unable to save note. Please try again.');
    }
  };

  // Load a note into the input field for editing
  const handleEditNote = (note) => {
    setNoteTitle(note.title);
    setEditingId(note.id);
  };

  const handleDeleteNote = (id) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedNotes = notes.filter(
              (note) => note.id !== id
            );

            try {
              await saveNotes(updatedNotes);
              setNotes(updatedNotes);

              if (editingId === id) {
                setNoteTitle('');
                setEditingId(null);
              }

              setError('');
            } catch (err) {
              setError('Unable to delete note. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setNoteTitle('');
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#243B64" />
        <Text style={styles.statusText}>Loading saved notes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Notes</Text>

      <Text style={styles.subtitle}>
        Keep your important thoughts in one place.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Write your note here..."
        value={noteTitle}
        onChangeText={setNoteTitle}
        multiline
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleSaveNote}
      >
        <Text style={styles.addButtonText}>
          {editingId !== null ? 'Update Note' : 'Add Note'}
        </Text>
      </TouchableOpacity>

      {editingId !== null && (
        <TouchableOpacity onPress={handleCancelEdit}>
          <Text style={styles.statusText}>Cancel Editing</Text>
        </TouchableOpacity>
      )}

      {error !== '' && (
        <Text style={{ color: 'red', marginBottom: 12 }}>
          {error}
        </Text>
      )}

      <Text style={styles.sectionTitle}>
        My Saved Notes ({notes.length})
      </Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No notes yet. Add your first note!
          </Text>
        }
      />
    </View>
  );
};

export default App;
