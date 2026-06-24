import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const priorityColors = {
  Alta: colors.priority.Alta,
  Media: colors.priority.Media,
  Baja: colors.priority.Baja,
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <TouchableOpacity
      style={[styles.card, task.completed && styles.completedCard]}
      onPress={() => onToggle(task)}
      onLongPress={() => onEdit(task)}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.priorityDot,
            { backgroundColor: priorityColors[task.priority] },
          ]}
        />
        <View style={styles.textSection}>
          <Text
            style={[
              styles.title,
              task.completed && styles.completedText,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {task.description}
            </Text>
          ) : null}
          <View style={styles.tags}>
            <View
              style={[
                styles.tag,
                { backgroundColor: colors.category[task.category] + '20' },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
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
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(task._id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.6,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  date: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B15',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 14,
    color: colors.priority.Alta,
    fontWeight: '700',
  },
});
