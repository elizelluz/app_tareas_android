import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import TaskCard from '../components/TaskCard';
import { fetchTasks, updateTask, deleteTask } from '../api/tasks';
import { colors } from '../theme/colors';

export default function CompletedScreen() {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchTasks();
      setTasks(data.filter((t) => t.completed));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, [loadTasks]);

  const handleToggle = (task) => {
    Alert.alert(
      'Desmarcar tarea',
      `¿Estás seguro de mover "${task.title}" a pendientes?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, mover',
          onPress: async () => {
            try {
              await updateTask(task._id, { completed: false });
              await loadTasks();
            } catch (e) {
              console.error(e);
            }
          },
        },
      ]
    );
  };

  const handleDelete = (id) => {
    Alert.alert('Eliminar tarea', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(id);
            await loadTasks();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => {}}
            onComplete={handleToggle}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay tareas completadas</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingVertical: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
