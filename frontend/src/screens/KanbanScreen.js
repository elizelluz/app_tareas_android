import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import KanbanColumn from '../components/KanbanColumn';
import TaskForm from '../components/TaskForm';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = Math.min(300, SCREEN_WIDTH * 0.8);

export default function KanbanScreen() {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
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

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

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

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleMove = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
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

  return (
    <View style={styles.container}>
      <View style={styles.boardHeader}>
        <View>
          <Text style={styles.boardTitle}>Kanban</Text>
          <Text style={styles.boardSubtitle}>{tasks.length} tareas totales</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setEditingTask(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addBtnText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.board}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={-100}
          />
        }
      >
        <KanbanColumn
          title="Pendientes"
          tasks={pending}
          color="#FF6B6B"
          onEdit={handleEdit}
          onMove={handleMove}
          onDelete={handleDelete}
          emptyMessage="No hay tareas pendientes"
        />
        <KanbanColumn
          title="Completadas"
          tasks={completed}
          color="#51CF66"
          onEdit={handleEdit}
          onMove={handleMove}
          onDelete={handleDelete}
          emptyMessage="No hay tareas completadas"
        />
      </ScrollView>

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
  boardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  boardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  boardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  board: {
    padding: 12,
    gap: 0,
  },
});
