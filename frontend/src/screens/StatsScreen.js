import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import StatsCard from '../components/StatsCard';
import { fetchStats } from '../api/tasks';
import { colors } from '../theme/colors';

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, [loadStats]);

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.sectionTitle}>Resumen</Text>
      <View style={styles.statsRow}>
        <StatsCard label="Total" value={stats.total} color={colors.primary} />
        <StatsCard label="Completadas" value={stats.completed} color="#51CF66" />
        <StatsCard label="Pendientes" value={stats.pending} color="#FF6B6B" />
      </View>

      <Text style={styles.sectionTitle}>Por Prioridad</Text>
      <View style={styles.statsRow}>
        {stats.by_priority &&
          Object.entries(stats.by_priority).map(([key, value]) => (
            <StatsCard
              key={key}
              label={key}
              value={value}
              color={colors.priority[key]}
            />
          ))}
      </View>

      <Text style={styles.sectionTitle}>Por Categoría</Text>
      <View style={styles.statsRow}>
        {stats.by_category &&
          Object.entries(stats.by_category).map(([key, value]) => (
            <StatsCard
              key={key}
              label={key}
              value={value}
              color={colors.category[key]}
            />
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
