import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import KanbanColumn from '../components/KanbanColumn';
import TaskForm from '../components/TaskForm';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { colors } from '../theme/colors';

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

  const pending = tasks.filter((t) => t.status === 'pending');
  const inProgress = tasks.filter((t) => t.status === 'in_progress');
  const completed = tasks.filter((t) => t.status === 'completed');

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

  const handleMoveNext = async (task) => {
    const nextStatus =
      task.status === 'pending'
        ? 'in_progress'
        : task.status === 'in_progress'
          ? 'completed'
          : 'pending';
    try {
      await updateTask(task._id, { status: nextStatus });
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
          nextLabel="→ En Proceso"
          onEdit={handleEdit}
          onMove={handleMoveNext}
          onDelete={handleDelete}
          emptyMessage="No hay tareas pendientes"
        />
        <KanbanColumn
          title="En Proceso"
          tasks={inProgress}
          color="#FFB347"
          nextLabel="→ Completada"
          onEdit={handleEdit}
          onMove={handleMoveNext}
          onDelete={handleDelete}
          emptyMessage="No hay tareas en proceso"
        />
        <KanbanColumn
          title="Completadas"
          tasks={completed}
          color="#51CF66"
          nextLabel="→ Pendiente"
          onEdit={handleEdit}
          onMove={handleMoveNext}
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
  },
});
