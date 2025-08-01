
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import GameScreen from './Screens/GameScreen';
import NombreJugadorScreen from './components/NombreJugadorScreen';
import RankingScreen from './Screens/RankingScreen';

//Este es el componente principal de la aplicación, que maneja las diferentes pantallas del juego: ingreso de nombre, juego y ranking.

export default function App() {
  const [pantalla, setPantalla] = useState('nombre'); 
  const [playerName, setPlayerName] = useState('');
  const [historial, setHistorial] = useState({ total: 0, ganadas: 0, perdidas: 0 });

  const comenzarJuego = (nombre) => {
    const nombreFinal = nombre.trim() === '' ? 'Jugador Anónimo' : nombre.trim();
    setPlayerName(nombreFinal);
    setPantalla('juego');
  };

  const volverAInicio = () => {
    setPlayerName('');
    setHistorial({ total: 0, ganadas: 0, perdidas: 0 });
    setPantalla('nombre');
  };

  const mostrarRanking = () => {
    setPantalla('ranking');
  };

  const volverDeRanking = () => {
    setPantalla('juego');
  };

  const renderPantalla = () => {
    switch (pantalla) {
      case 'nombre':
        return <NombreJugadorScreen onComenzar={comenzarJuego} />;
      case 'juego':
        return (
          <GameScreen 
            playerName={playerName}
            onRestart={volverAInicio}
            historial={historial}
            setHistorial={setHistorial}
            onShowRanking={mostrarRanking}
          />
        );
      case 'ranking':
        return (
          <RankingScreen 
            playerName={playerName}
            onBack={volverDeRanking}
          />
        );
      default:
        return <NombreJugadorScreen onComenzar={comenzarJuego} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {renderPantalla()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});