
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    padding: 20,
    paddingTop: 55,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4c005c',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    padding: 20,
    fontSize: 16,
    marginBottom: 20,
    color: '#222222',
  },
  addButton: {
    backgroundColor: '#243B64',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#243B64',
    marginBottom: 15,
  },
  emptyText: {
    color: '#888888',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
  },
  statusText: {
    color: '#8C83C6',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 17,
  },
});

export default styles;
