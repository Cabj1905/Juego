import AsyncStorage from '@react-native-async-storage/async-storage';

//Este archivo maneja el almacenamiento de datos relacionados con los jugadores y sus historiales de partidas.
//Utiliza AsyncStorage para guardar y recuperar datos de manera persistente.

const HISTORIAL_PREFIX = 'historial_';
const JUGADORES_KEY = 'jugadores_lista';

const esJugadorAnonimo = (nombreJugador) => {
  return !nombreJugador || 
         nombreJugador.trim() === '' || 
         nombreJugador === 'Jugador Anónimo' || 
         nombreJugador.toLowerCase().includes('anónimo') ||
         nombreJugador.toLowerCase().includes('anonimo');
};

export const cargarHistorialJugador = async (nombreJugador) => {
  try {
    if (esJugadorAnonimo(nombreJugador)) {
      return { total: 0, ganadas: 0, perdidas: 0 };
    }
    
    const historialGuardado = await AsyncStorage.getItem(`${HISTORIAL_PREFIX}${nombreJugador}`);
    if (historialGuardado) {
      return JSON.parse(historialGuardado);
    }
    return { total: 0, ganadas: 0, perdidas: 0 };
  } catch (error) {
    console.error('Error al cargar historial del jugador:', error);
    return { total: 0, ganadas: 0, perdidas: 0 };
  }
};

export const guardarHistorialJugador = async (nombreJugador, historial) => {
  try {
    if (esJugadorAnonimo(nombreJugador)) {
      console.log('Jugador anónimo - no se guarda historial');
      return false;
    }
    
    await AsyncStorage.setItem(`${HISTORIAL_PREFIX}${nombreJugador}`, JSON.stringify(historial));
    
    await agregarJugadorALista(nombreJugador);
    
    console.log('Historial guardado para:', nombreJugador, historial);
    return true;
  } catch (error) {
    console.error('Error al guardar historial del jugador:', error);
    return false;
  }
};


export const obtenerListaJugadores = async () => {
  try {
    const jugadoresGuardados = await AsyncStorage.getItem(JUGADORES_KEY);
    if (jugadoresGuardados) {
      return JSON.parse(jugadoresGuardados);
    }
    return [];
  } catch (error) {
    console.error('Error al obtener lista de jugadores:', error);
    return [];
  }
};

export const obtenerTodosLosJugadoresConHistorial = async () => {
  try {
    const todasLasClaves = await AsyncStorage.getAllKeys();
    
    const clavesHistorial = todasLasClaves.filter(clave => 
      clave.startsWith(HISTORIAL_PREFIX)
    );
    

    const jugadores = clavesHistorial.map(clave => 
      clave.replace(HISTORIAL_PREFIX, '')
    );
    
    return jugadores;
  } catch (error) {
    console.error('Error al obtener jugadores con historial:', error);
    return [];
  }
};

const agregarJugadorALista = async (nombreJugador) => {
  try {
    if (esJugadorAnonimo(nombreJugador)) {
      return;
    }
    
    const jugadores = await obtenerListaJugadores();
    if (!jugadores.includes(nombreJugador)) {
      jugadores.push(nombreJugador);
      await AsyncStorage.setItem(JUGADORES_KEY, JSON.stringify(jugadores));
    }
  } catch (error) {
    console.error('Error al agregar jugador a la lista:', error);
  }
};

export const obtenerHistorialCompleto = async () => {
  try {
    const jugadores = await obtenerTodosLosJugadoresConHistorial();
    const historialCompleto = {};
    
    for (const jugador of jugadores) {
      if (!esJugadorAnonimo(jugador)) {
        const historial = await cargarHistorialJugador(jugador);
        if (historial.total > 0) {
          historialCompleto[jugador] = historial;
        }
      }
    }
    
    return historialCompleto;
  } catch (error) {
    console.error('Error al obtener historial completo:', error);
    return {};
  }
};

export const sincronizarListaJugadores = async () => {
  try {
    const jugadoresConHistorial = await obtenerTodosLosJugadoresConHistorial();
    const jugadoresConPartidas = [];
    
    for (const jugador of jugadoresConHistorial) {
      if (!esJugadorAnonimo(jugador)) {
        const historial = await cargarHistorialJugador(jugador);
        if (historial.total > 0) {
          jugadoresConPartidas.push(jugador);
        }
      }
    }
    
    await AsyncStorage.setItem(JUGADORES_KEY, JSON.stringify(jugadoresConPartidas));
    return jugadoresConPartidas;
  } catch (error) {
    console.error('Error al sincronizar lista de jugadores:', error);
    return [];
  }
};

