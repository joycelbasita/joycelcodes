
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key used to identify the saved notes in device storage
const STORAGE_KEY = '@my_notes';


// Save the notes array to AsyncStorage
export const saveNotes = async (notes) => {
  try {
    // Convert the array into a JSON string
    const jsonValue = JSON.stringify(notes);

    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.log('Error saving notes:', error);
    throw error;
  }
};


// Retrieve saved notes from AsyncStorage
export const loadNotes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);

    // Return an empty array if there are no saved notes
    if (jsonValue === null) {
      return [];
    }

    // Convert the JSON string back into an array
    return JSON.parse(jsonValue);
  } catch (error) {
    console.log('Error loading notes:', error);
    throw error;
  }
};
