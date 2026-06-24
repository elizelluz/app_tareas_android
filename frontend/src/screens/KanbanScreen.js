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
import { fetchProjects } from '../api/projects';
import { colors } from '../theme/colors';

export default function KanbanScreen() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [tasksData, projectsData] = await Promise.all([
        fetchTasks('', '', '', selectedProject || ''),
        fetchProjects(),
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (e) {
      console.error(e);
    }
  }, [selectedProject]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

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
      await loadData();
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
      await loadData();
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
            await loadData();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  const currentProject = projects.find((p) => p._id === selectedProject);

  return (
    <View style={styles.container}>
      <View style={styles.boardHeader}>
        <View>
          <Text style={styles.boardTitle}>
            {currentProject ? currentProject.name : 'Kanban'}
          </Text>
          <Text style={styles.boardSubtitle}>
            {currentProject
              ? `${tasks.length} tareas · ${projects.length} proyectos`
              : `${tasks.length} tareas totales`}
          </Text>
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
        style={styles.projectFilter}
        contentContainerStyle={styles.projectFilterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, !selectedProject && styles.filterChipActive]}
          onPress={() => setSelectedProject(null)}
        >
          <Text style={[styles.filterChipText, !selectedProject && styles.filterChipTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        {projects.map((p) => (
          <TouchableOpacity
            key={p._id}
            style={[
              styles.filterChip,
              selectedProject === p._id && { backgroundColor: p.color || colors.primary },
            ]}
            onPress={() => setSelectedProject(p._id)}
          >
            <View style={[styles.filterDot, { backgroundColor: p.color || colors.primary }]} />
            <Text
              style={[
                styles.filterChipText,
                selectedProject === p._id && styles.filterChipTextActive,
              ]}
            >
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
        projects={projects}
        defaultProjectId={selectedProject}
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
  projectFilter: {
    maxHeight: 48,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  projectFilterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  board: {
    padding: 12,
  },
});
