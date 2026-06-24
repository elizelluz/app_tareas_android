import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const PRIORITIES = ['Todas', 'Alta', 'Media', 'Baja'];
const CATEGORIES = ['Todas', 'Trabajo', 'Personal', 'Compras', 'Otros'];

export default function FilterBar({ search, onSearchChange, priority, onPriorityChange, category, onCategoryChange }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={onSearchChange}
        placeholder="Buscar tareas..."
        placeholderTextColor={colors.textSecondary}
      />
      <View style={styles.filterRow}>
        <View style={styles.filterGroup}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.filterBtn, priority === p && styles.filterBtnActive]}
              onPress={() => onPriorityChange(p)}
            >
              <Text style={[styles.filterText, priority === p && styles.filterTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.filterRow}>
        <View style={styles.filterGroup}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.filterBtn, category === c && styles.filterBtnActive]}
              onPress={() => onCategoryChange(c)}
            >
              <Text style={[styles.filterText, category === c && styles.filterTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  filterRow: {
    marginBottom: 4,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },
});
