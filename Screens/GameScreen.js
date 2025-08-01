import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IntentosTable from '../components/columna';
import RandomNumberGenerator from '../components/random';
import { cargarHistorialJugador, guardarHistorialJugador } from '../components/utils/storage';

// Este pantalla maneja la lógica del juego, permitiendo al usuario jugar, ver su historial y reiniciar el juego.

export default function GameScreen({ playerName, onRestart, historial, setHistorial, onShowRanking }) {
  const [randomNumber, setRandomNumber] = useState(null);
  const [mostrarNumero, setMostrarNumero] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(true);
  const [intentos, setIntentos] = useState([]);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [bloquearSeleccion, setBloquearSeleccion] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [numeroSeleccionado, setNumeroSeleccionado] = useState(false);

  const esJugadorAnonimo = () => {
    return !playerName || playerName.trim() === '' || playerName === 'Jugador Anónimo';
  };

  useEffect(() => {
    if (!esJugadorAnonimo()) {
      cargarHistorial();
    }
  }, [playerName]);

    const cargarHistorial = async () => {
      const historial = await cargarHistorialJugador(playerName);
      setHistorial(historial);
    };

  const guardarHistorial = async (nuevoHistorial) => {
    await guardarHistorialJugador(playerName, nuevoHistorial);
  };

  
  const mostrarMensaje = (nuevoMensaje) => {
    setMensaje(nuevoMensaje);
    setTimeout(() => setMensaje(''), 10000);
  };

  const reiniciarJuego = () => {
    if (randomNumber !== null && !juegoTerminado && numeroSeleccionado && !esJugadorAnonimo()) {
      const yaAdivino = intentos.some(intento => intento.numero === randomNumber);
      
      const nuevoHistorial = {
        total: historial.total + 1,
        ganadas: historial.ganadas + (yaAdivino ? 1 : 0),
        perdidas: historial.perdidas + (yaAdivino ? 0 : 1),
      };
      
      setHistorial(nuevoHistorial);
      guardarHistorial(nuevoHistorial);
    }

    setIntentos([]);
    setRandomNumber(null);
    setMostrarNumero(false);
    setMostrarOpciones(true);
    setJuegoTerminado(false);
    setBloquearSeleccion(false);
    setNumeroSeleccionado(false);
    setMensaje('');
  };

  const generateRandomNumber = () => {
    const number = Math.floor(1000 + Math.random() * 9000);
    setRandomNumber(number);
    setMostrarNumero(false);
    setJuegoTerminado(false);
    setNumeroSeleccionado(true);
  };

  const generarNumeroUnico = () => {
    let number;
    do {
      number = Math.floor(1000 + Math.random() * 9000);
    } while (new Set(number.toString()).size !== 4);
    setRandomNumber(number);
    setMostrarNumero(false);
    setJuegoTerminado(false);
    setNumeroSeleccionado(true);
  };

  const finalizar = (ganado = false) => {
    setMostrarNumero(true);
    setBloquearSeleccion(true);
    
    if (!esJugadorAnonimo()) {
      const nuevoHistorial = {
        total: historial.total + 1,
        ganadas: historial.ganadas + (ganado ? 1 : 0),
        perdidas: historial.perdidas + (ganado ? 0 : 1),
      };
      
      setHistorial(nuevoHistorial);
      guardarHistorial(nuevoHistorial);
    }
    
    setJuegoTerminado(true);
  };

  const limpiarHistorial = async () => {
    try {
      if (playerName && playerName.trim() !== '') {
        await AsyncStorage.removeItem(`historial_${playerName}`);
        const historialLimpio = { total: 0, ganadas: 0, perdidas: 0 };
        setHistorial(historialLimpio);
        mostrarMensaje('Historial limpiado');
        console.log('Historial limpiado para', playerName);
      }
    } catch (error) {
      console.error('Error al limpiar historial:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RandomNumberGenerator
        randomNumber={randomNumber}
        generateRandomNumber={generateRandomNumber}
        generarNumeroUnico={generarNumeroUnico}
        mostrarNumero={mostrarNumero}
        mostrarOpciones={mostrarOpciones}
        setMostrarOpciones={setMostrarOpciones}
        finish={() => finalizar(false)}
        bloquearSeleccion={bloquearSeleccion}
        setBloquearSeleccion={setBloquearSeleccion}
        setJuegoTerminado={setJuegoTerminado}
        setNumeroSeleccionado={setNumeroSeleccionado}
      />
      
      <IntentosTable
        randomNumber={randomNumber}
        mostrarNumero={mostrarNumero}
        setMostrarNumero={setMostrarNumero}
        intentos={intentos}
        setIntentos={setIntentos}
        finalizar={finalizar}
        setJuegoTerminado={setJuegoTerminado}
        numeroseleccionado={numeroSeleccionado}
        setNumeroSeleccionado={setNumeroSeleccionado}
        setBloquearSeleccion={setBloquearSeleccion}
        bloquearSeleccion={bloquearSeleccion}
        mostrarMensaje={mostrarMensaje}
        mensaje={mensaje}
        reiniciarPartida={reiniciarJuego}
      />

      {!esJugadorAnonimo() && (
        <View style={styles.historialContainer}>
          <Text style={styles.historialTitulo}>Historial de {playerName}</Text>
          <Text style={styles.estadistica}>Total de partidas: {historial.total}</Text>
          <Text style={styles.estadistica}>Ganadas: {historial.ganadas}</Text>
          <Text style={styles.estadistica}>Perdidas: {historial.perdidas}</Text>
          {historial.total > 0 && (
            <Text style={styles.estadistica}>
              Porcentaje de victorias: {((historial.ganadas / historial.total) * 100).toFixed(1)}%
            </Text>
          )}
          
          <TouchableOpacity style={styles.botonLimpiar} onPress={limpiarHistorial}>
            <Text style={styles.textoBotonLimpiar}>Limpiar Historial</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.botonesContainer}>
        <TouchableOpacity style={styles.botonRanking} onPress={onShowRanking}>
          <Text style={styles.textoBotonRanking}>🏆 Ver Ranking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botonReiniciar} onPress={onRestart}>
          <Text style={styles.textoBotonReiniciar}>🔄 Nueva Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  historialContainer: {
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  historialTitulo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  estadistica: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  botonLimpiar: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  textoBotonLimpiar: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  botonesContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  botonRanking: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonRanking: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonReiniciar: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonReiniciar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});