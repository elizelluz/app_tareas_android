import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { fetchProjects, createProject, updateProject, deleteProject } from '../api/projects';
import { colors } from '../theme/colors';

const presetColors = ['#6C63FF', '#FF6B6B', '#51CF66', '#FFB347', '#4ECDC4', '#FF85A1', '#845EC2', '#FF9671'];

export default function ProjectsScreen({ selectedProject, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(presetColors[0]);

  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  }, [loadProjects]);

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      if (editing) {
        await updateProject(editing._id, { name: name.trim(), color });
      } else {
        await createProject({ name: name.trim(), color });
      }
      setModalVisible(false);
      setEditing(null);
      setName('');
      setColor(presetColors[0]);
      await loadProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Eliminar proyecto', 'Las tareas asociadas pasarán a "Sin proyecto"', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProject(id);
            await loadProjects();
          } catch (e) {
            console.error(e);
          }
        },
      },
    ]);
  };

  const openEdit = (project) => {
    setEditing(project);
    setName(project.name);
    setColor(project.color || presetColors[0]);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Proyectos</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setEditing(null);
            setName('');
            setColor(presetColors[0]);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addBtnText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.projectCard,
              { borderLeftColor: item.color || colors.primary },
              selectedProject === item._id && styles.selectedCard,
            ]}
            onPress={() => {
              Alert.alert(item.name, 'Selecciona una acción', [
                {
                  text: 'Editar',
                  onPress: () => openEdit(item),
                },
                {
                  text: 'Eliminar',
                  style: 'destructive',
                  onPress: () => handleDelete(item._id),
                },
                { text: 'Cancelar', style: 'cancel' },
              ]);
            }}
            onLongPress={() => openEdit(item)}
          >
            <View style={styles.projectInfo}>
              <View style={[styles.projectDot, { backgroundColor: item.color || colors.primary }]} />
              <View style={styles.projectText}>
                <Text style={styles.projectName}>{item.name}</Text>
                {item.description ? (
                  <Text style={styles.projectDesc} numberOfLines={1}>{item.description}</Text>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📁</Text>
            <Text style={styles.emptyText}>No hay proyectos aún</Text>
            <Text style={styles.emptySubtext}>Crea uno para organizar tus tareas</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  setModalVisible(false);
                  setEditing(null);
                }}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nombre del proyecto"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorsRow}>
              {presetColors.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: c },
                    color === c && styles.colorBtnSelected,
                  ]}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setEditing(null);
                }}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>{editing ? 'Guardar' : 'Crear'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
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
  list: {
    padding: 16,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: '#F0EEFF',
  },
  projectInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  projectText: {
    flex: 1,
  },
  projectName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  projectDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B6B15',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 12,
    color: colors.priority.Alta,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  colorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorBtnSelected: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});
