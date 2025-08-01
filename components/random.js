import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Este componente permite al usuario seleccionar una opción para generar un número aleatorio, ya sea con o sin repeticiones.

export default function RandomNumberGenerator({
  randomNumber,
  generateRandomNumber,
  generarNumeroUnico,
  mostrarNumero,
  mostrarOpciones,
  setMostrarOpciones,
  setNumeroSeleccionado,
}) {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [bloquearSeleccion, setBloquearSeleccion] = useState(false);

  useEffect(() => {
    if (mostrarOpciones) {
      setOpcionSeleccionada('');
      setBloquearSeleccion(false);
    }
  }, [mostrarOpciones]);

  const handleGenerarNumero = () => {
    if (opcionSeleccionada === 'con-repeticiones') {
      generateRandomNumber();
    } else if (opcionSeleccionada === 'sin-repeticiones') {
      generarNumeroUnico();
    }

    setBloquearSeleccion(true);
    setMostrarOpciones(false);
    setNumeroSeleccionado(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Número Aleatorio</Text>

      {randomNumber !== null && (
        <Text style={styles.numero}>
          {mostrarNumero ? randomNumber : 'NÚMERO: XXXX'}
        </Text>
      )}

      {mostrarOpciones && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={opcionSeleccionada}
            onValueChange={(itemValue) => setOpcionSeleccionada(itemValue)}
            enabled={!bloquearSeleccion}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona una opción" value="" />
            <Picker.Item label="Con Repeticiones" value="con-repeticiones" />
            <Picker.Item label="Sin Repeticiones" value="sin-repeticiones" />
          </Picker>

          <TouchableOpacity
            style={[
              styles.button,
              (!opcionSeleccionada || bloquearSeleccion) && styles.buttonDisabled,
            ]}
            onPress={handleGenerarNumero}
            disabled={!opcionSeleccionada || bloquearSeleccion}
          >
            <Text style={styles.buttonText}>Generar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  numero: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});