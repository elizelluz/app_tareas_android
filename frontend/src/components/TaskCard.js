import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const priorityColors = {
  Alta: colors.priority.Alta,
  Media: colors.priority.Media,
  Baja: colors.priority.Baja,
};

const statusColors = {
  pending: '#FF6B6B',
  in_progress: '#FFB347',
  completed: '#51CF66',
};

export default function TaskCard({ task, onPress, onMove, onDelete, moveLabel, compact }) {
  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compactCard, task.completed && styles.completedCard]}
      onPress={() => onPress(task)}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.priorityDot,
            { backgroundColor: priorityColors[task.priority] },
          ]}
        />
        <Text
          style={[styles.title, task.completed && styles.completedText]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <View style={styles.actionBtns}>
          {moveLabel && (
            <TouchableOpacity
              style={styles.moveBtn}
              onPress={() => onMove(task)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.moveText}>{'>'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(task._id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
      {task.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}
      <View style={styles.footerRow}>
        <View
          style={[
            styles.categoryTag,
            { backgroundColor: colors.category[task.category] + '20' },
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              { color: colors.category[task.category] },
            ]}
          >
            {task.category}
          </Text>
        </View>
        {task.due_date ? (
          <Text style={styles.date}>
            {new Date(task.due_date).toLocaleDateString()}
          </Text>
        ) : null}
        <View style={styles.spacer} />
        {task.status && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: (statusColors[task.status] || '#999') + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: statusColors[task.status] || '#999' },
              ]}
            >
              {task.status === 'pending' ? 'Pendiente' : task.status === 'in_progress' ? 'En curso' : 'Lista'}
            </Text>
          </View>
        )}
        {moveLabel && (
          <Text style={styles.moveLabel}>{moveLabel}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compactCard: {
    marginHorizontal: 0,
  },
  completedCard: {
    opacity: 0.55,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    flexShrink: 0,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 6,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  date: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  spacer: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  moveBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  moveLabel: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B6B15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 12,
    color: colors.priority.Alta,
    fontWeight: '700',
  },
});
