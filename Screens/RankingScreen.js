import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { obtenerHistorialCompleto, limpiarTodosLosDatos } from '../components/utils/storage';

// Esta pantalla muestra el ranking global de jugadores, ordenado por porcentaje de victorias y permite refrescar el ranking.

export default function RankingScreen({ playerName, onBack }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarRanking();
  }, []);

  const cargarRanking = async () => {
    try {
      setLoading(true);
      const historialCompleto = await obtenerHistorialCompleto();
      
      const jugadoresArray = Object.entries(historialCompleto)
        .filter(([nombre, historial]) => historial.total > 0) 
        .map(([nombre, historial], index) => ({
          posicion: index + 1,
          nombre,
          total: historial.total,
          ganadas: historial.ganadas,
          perdidas: historial.perdidas,
          porcentaje: historial.total > 0 ? ((historial.ganadas / historial.total) * 100) : 0
        }))
        .sort((a, b) => {
         
          if (b.porcentaje === a.porcentaje) {
            return b.ganadas - a.ganadas;
          }
          return b.porcentaje - a.porcentaje;
        })
        .map((jugador, index) => ({
          ...jugador,
          posicion: index + 1
        }));

      setRanking(jugadoresArray);
    } catch (error) {
      console.error('Error al cargar ranking:', error);
      Alert.alert('Error', 'No se pudo cargar el ranking');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarRanking();
    setRefreshing(false);
  };

  

  const renderJugador = ({ item }) => {
    const esJugadorActual = item.nombre === playerName;
    
    return (
      <View style={[
        styles.jugadorContainer,
        esJugadorActual && styles.jugadorActual
      ]}>
        <View style={styles.posicionContainer}>
          <Text style={[
            styles.posicion,
            item.posicion <= 3 && styles.topTres
          ]}>
            {item.posicion === 1 ? '🏆' : item.posicion === 2 ? '🥈' : item.posicion === 3 ? '🥉' : `#${item.posicion}`}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={[
            styles.nombre,
            esJugadorActual && styles.nombreActual
          ]}>
            {item.nombre} {esJugadorActual && '(Tú)'}
          </Text>
          <View style={styles.estadisticasContainer}>
            <Text style={styles.estadistica}>
              {item.porcentaje.toFixed(1)}% victorias
            </Text>
            <Text style={styles.estadisticaSecundaria}>
              {item.ganadas}G / {item.perdidas}P / {item.total}T
            </Text>
          </View>
        </View>
        
        <View style={styles.porcentajeContainer}>
          <Text style={[
            styles.porcentajePrincipal,
            esJugadorActual && styles.porcentajeActual
          ]}>
            {item.porcentaje.toFixed(1)}%
          </Text>
        </View>
      </View>
    );
  };

  const renderEncabezado = () => (
    <View style={styles.encabezadoContainer}>
      <Text style={styles.titulo}>🏆 Ranking Global 🏆</Text>
      <Text style={styles.subtitulo}>
        Ordenado por porcentaje de victorias
      </Text>
      {ranking.length > 0 && (
        <Text style={styles.totalJugadores}>
          Total de jugadores: {ranking.length}
        </Text>
      )}
    </View>
  );

  const renderVacio = () => (
    <View style={styles.vacioContainer}>
      <Text style={styles.vacioTexto}>
        No hay jugadores en el ranking aún
      </Text>
      <Text style={styles.vacioSubtexto}>
        ¡Juega algunas partidas para aparecer aquí!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando ranking...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ranking}
        renderItem={renderJugador}
        keyExtractor={(item) => item.nombre}
        ListHeaderComponent={renderEncabezado}
        ListEmptyComponent={renderVacio}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.botonesContainer}>
        <TouchableOpacity style={styles.botonRefresh} onPress={onRefresh}>
          <Text style={styles.textoBoton}>🔄 Actualizar</Text>
        </TouchableOpacity>
        
        
        <TouchableOpacity style={styles.botonVolver} onPress={onBack}>
          <Text style={styles.textoBoton}>← Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  encabezadoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  totalJugadores: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  jugadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  jugadorActual: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 2,
  },
  posicionContainer: {
    width: 50,
    alignItems: 'center',
  },
  posicion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  topTres: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  nombreActual: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  estadisticasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  estadistica: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4caf50',
    marginRight: 10,
  },
  estadisticaSecundaria: {
    fontSize: 12,
    color: '#777',
  },
  porcentajeContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  porcentajePrincipal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  porcentajeActual: {
    color: '#1976d2',
  },
  vacioContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  vacioTexto: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  vacioSubtexto: {
    fontSize: 14,
    color: '#999',
  },
  botonesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  botonRefresh: {
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  botonLimpiar: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  botonVolver: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});