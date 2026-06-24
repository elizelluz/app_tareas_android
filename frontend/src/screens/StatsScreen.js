import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import StatsCard from '../components/StatsCard';
import { fetchStats } from '../api/tasks';
import { colors } from '../theme/colors';

const priorityIcons = { Alta: '🔴', Media: '🟠', Baja: '🟢' };
const categoryIcons = { Trabajo: '💼', Personal: '👤', Compras: '🛒', Otros: '📦' };

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

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const maxPriority = Math.max(...Object.values(stats.by_priority || {}), 1);
  const maxCategory = Math.max(...Object.values(stats.by_category || {}), 1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Resumen de productividad</Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerNumber}>{stats.total}</Text>
            <Text style={styles.headerLabel}>Total</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={[styles.headerNumber, { color: '#FFB347' }]}>{stats.in_progress}</Text>
            <Text style={styles.headerLabel}>En Proceso</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={[styles.headerNumber, { color: '#51CF66' }]}>{stats.completed}</Text>
            <Text style={styles.headerLabel}>Completadas</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={[styles.headerNumber, { color: '#FF6B6B' }]}>{stats.pending}</Text>
            <Text style={styles.headerLabel}>Pendientes</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.sectionTitle}>Progreso</Text>
          <Text style={styles.progressPercent}>{completionRate}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: `${completionRate}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {stats.completed} de {stats.total} tareas completadas
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Por Prioridad</Text>
      <View style={styles.sectionCard}>
        {Object.entries(stats.by_priority || {}).map(([key, value]) => (
          <StatsCard
            key={key}
            label={key}
            value={value}
            color={colors.priority[key]}
            icon={priorityIcons[key]}
            max={maxPriority}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Por Categoría</Text>
      <View style={styles.sectionCard}>
        {Object.entries(stats.by_category || {}).map(([key, value]) => (
          <StatsCard
            key={key}
            label={key}
            value={value}
            color={colors.category[key]}
            icon={categoryIcons[key]}
            max={maxCategory}
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
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: colors.textSecondary,
  },
  headerCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 20,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerStat: {
    flex: 1,
    alignItems: 'center',
  },
  headerNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressPercent: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: colors.background,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
});
