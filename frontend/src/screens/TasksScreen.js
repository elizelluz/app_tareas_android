import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import FilterBar from '../components/FilterBar';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { colors } from '../theme/colors';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    let result = [...tasks];
    if (search) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (priorityFilter !== 'Todas') {
      result = result.filter((t) => t.priority === priorityFilter);
    }
    if (categoryFilter !== 'Todas') {
      result = result.filter((t) => t.category === categoryFilter);
    }
    result = result.filter((t) => !t.completed);
    setFilteredTasks(result);
  }, [tasks, search, priorityFilter, categoryFilter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, [loadTasks]);

  const handleCreate = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setModalVisible(false);
      setEditingTask(null);
      await loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: true });
      await loadTasks();
    } catch (e) {
      console.error(e);
    }
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

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={handleEdit}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay tareas pendientes</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingTask(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <TaskForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreate}
        initial={editingTask}
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
    paddingBottom: 80,
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: colors.white,
    lineHeight: 30,
  },
});
