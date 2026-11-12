
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const NoteItem = ({ note, onEdit, onDelete }) => {
  return (
    <View style={styles.noteCard}>
      <View style={styles.noteContent}>
        <Text style={styles.noteTitle}>{note.title}</Text>
        <Text style={styles.noteDate}>{note.date}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(note)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(note.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoteItem;

const styles = StyleSheet.create({
  noteCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  noteContent: {
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#243B64',
  },
  noteDate: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#8C83C6',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 7,
  },
  deleteButton: {
    backgroundColor: '#E45B64',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
