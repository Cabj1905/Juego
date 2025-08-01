import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

//Esta pantalla muestra la pantalla de inicio del juego, donde el usuario puede ingresar su nombre y comenzar el juego.

export default function StartScreen({ playerName, setPlayerName, onStart }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido al Juego</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre (opcional)"
        value={playerName}
        onChangeText={setPlayerName}
      />
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>Comenzar Juego</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '10%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

