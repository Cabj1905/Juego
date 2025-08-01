import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';

// Este componente maneja la lógica de los intentos del juego, permitiendo al usuario ingresar números y compararlos con el número aleatorio generado.

function IntentosTable({
  randomNumber,
  setMostrarNumero,
  finalizar,
  intentos,
  setIntentos,
  numeroseleccionado,
  setBloquearSeleccion,
  bloquearSeleccion,
  mostrarMensaje,
  mensaje,
  reiniciarPartida,
}) {
  const [numero, setNumero] = useState('');

  const agregarIntento = () => {
    const nuevoIntento = {
      intento: intentos.length + 1,
      numero: parseInt(numero),
      resultado: Comparar(randomNumber, numero),
    };

    const nuevosIntentos = [...intentos, nuevoIntento];
    setIntentos(nuevosIntentos);

    setNumero('');

    if (parseInt(numero) === randomNumber) {
      mostrarMensaje('¡Felicidades, has acertado el número!');
      finalizar(true); 
      return;
    }

    if (nuevosIntentos.length >= 10) {
      mostrarMensaje('Has llegado a la cantidad máxima de intentos');
      finalizar(false); 
    }
  };

  const Comparar = (randomNumber, numero) => {
    let primeroRandom = randomNumber.toString();
    let primeronumero = numero.toString();

    let cantidadbien = 0;
    let cantidadregular = 0;
    let cantidadmal = 0;

    let usadosRandom = new Array(primeroRandom.length).fill(false);
    let usadosEntrada = new Array(primeronumero.length).fill(false);

    for (let i = 0; i < primeronumero.length; i++) {
      if (primeronumero[i] === primeroRandom[i]) {
        cantidadbien++;
        usadosRandom[i] = true;
        usadosEntrada[i] = true;
      }
    }

    for (let i = 0; i < primeronumero.length; i++) {
      if (!usadosEntrada[i]) {
        for (let j = 0; j < primeroRandom.length; j++) {
          if (!usadosRandom[j] && primeronumero[i] === primeroRandom[j]) {
            cantidadregular++;
            usadosRandom[j] = true;
            usadosEntrada[i] = true;
            break;
          }
        }
      }
    }

    cantidadmal = primeronumero.length - (cantidadbien + cantidadregular);
    return `${cantidadbien} B ${cantidadregular} R ${cantidadmal} M`;
  };

  const handleFinalizar = () => {
    setMostrarNumero(true);
    finalizar(false); 
    setBloquearSeleccion(true);
    mostrarMensaje('Juego finalizado. Presiona "Jugar otra vez" para reiniciar');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={numero}
        onChangeText={(text) => {
          if (/^\d{0,4}$/.test(text)) setNumero(text);
        }}
        placeholder="Ingresa un número"
        maxLength={4}
      />
      
      <TouchableOpacity
        style={[
          styles.button,
          numero.length !== 4 || !numeroseleccionado || bloquearSeleccion
            ? styles.buttonDisabled
            : {},
        ]}
        onPress={agregarIntento}
        disabled={
          numero.length !== 4 || !numeroseleccionado || bloquearSeleccion
        }
      >
        <Text style={styles.buttonText}>Agregar Intento</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.lista}
        data={intentos}
        keyExtractor={(item) => item.intento.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>#{item.intento}</Text>
            <Text style={styles.cell}>{item.numero}</Text>
            <Text style={styles.cell}>{item.resultado}</Text>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.cell}>Intento</Text>
            <Text style={styles.cell}>Número</Text>
            <Text style={styles.cell}>Resultado</Text>
          </View>
        }
      />

      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={reiniciarPartida}>
        <Text style={styles.buttonText}>Jugar otra vez</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleFinalizar}>
        <Text style={styles.buttonText}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default IntentosTable;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10, 
    minWidth: 150, 
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  lista: {
    width: '100%',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#eee',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  mensaje: {
    marginTop: 15,
    fontSize: 16,
    color: '#e91e63',
    textAlign: 'center',
  },
});