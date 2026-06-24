import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function StatsCard({ label, value, color, icon, max }) {
  const barWidth = max ? (value / max) * 100 : 0;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <View style={styles.textSection}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.value, { color: color || colors.text }]}>{value}</Text>
        </View>
      </View>
      {max > 0 && (
        <View style={styles.barBg}>
          <View style={[styles.bar, { width: `${barWidth}%`, backgroundColor: color || colors.primary }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  textSection: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  barBg: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
});
