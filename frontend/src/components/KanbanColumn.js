import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import TaskCard from './TaskCard';
import { colors } from '../theme/colors';

export default function KanbanColumn({ title, tasks, color, onEdit, onMove, onDelete, emptyMessage }) {
  return (
    <View style={styles.column}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: color + '20' }]}>
          <Text style={[styles.badgeText, { color }]}>{tasks.length}</Text>
        </View>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TaskCard
              task={item}
              onPress={onEdit}
              onComplete={onMove}
              onDelete={onDelete}
            />
            <View style={styles.cardFooter}>
              <Text style={styles.cardDate}>
                {item.due_date
                  ? new Date(item.due_date).toLocaleDateString()
                  : 'Sin fecha'}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{title === 'Pendientes' ? '📋' : '✅'}</Text>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 300,
    backgroundColor: '#F0F2F5',
    borderRadius: 16,
    marginHorizontal: 6,
    maxHeight: '100%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    padding: 10,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  cardFooter: {
    paddingHorizontal: 4,
    paddingTop: 2,
  },
  cardDate: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
