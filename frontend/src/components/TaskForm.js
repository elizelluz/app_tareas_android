import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';

const PRIORITIES = ['Alta', 'Media', 'Baja'];
const CATEGORIES = ['Trabajo', 'Personal', 'Compras', 'Otros'];

export default function TaskForm({ visible, onClose, onSubmit, initial, projects, defaultProjectId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Media');
  const [category, setCategory] = useState('Otros');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '');
      setDescription(initial.description || '');
      setPriority(initial.priority || 'Media');
      setCategory(initial.category || 'Otros');
      setDueDate(initial.due_date ? initial.due_date.split('T')[0] : '');
      setProjectId(initial.project_id || null);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Media');
      setCategory('Otros');
      setDueDate('');
      setProjectId(defaultProjectId || null);
    }
  }, [initial, visible, defaultProjectId]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      due_date: dueDate || null,
      status: initial?.status || 'pending',
      project_id: projectId || null,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {initial ? 'Editar Tarea' : 'Nueva Tarea'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="¿Qué necesitas hacer?"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Añade más detalles..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Prioridad</Text>
            <View style={styles.optionsRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.optionBtn,
                    priority === p && {
                      backgroundColor: colors.priority[p],
                    },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      priority === p && styles.optionTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Categoría</Text>
            <View style={styles.optionsRow}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.optionBtn,
                    category === c && {
                      backgroundColor: colors.category[c],
                    },
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      category === c && styles.optionTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {Array.isArray(projects) && projects.length > 0 && (
              <>
                <Text style={styles.label}>Proyecto</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectsRow}>
                  <TouchableOpacity
                    style={[styles.projectChip, !projectId && styles.projectChipActive]}
                    onPress={() => setProjectId(null)}
                  >
                    <Text style={[styles.projectChipText, !projectId && styles.projectChipTextActive]}>Sin proyecto</Text>
                  </TouchableOpacity>
                  {projects.map((p) => (
                    <TouchableOpacity
                      key={p._id}
                      style={[
                        styles.projectChip,
                        projectId === p._id && { backgroundColor: p.color || colors.primary },
                      ]}
                      onPress={() => setProjectId(p._id)}
                    >
                      <View style={[styles.projectChipDot, { backgroundColor: p.color || colors.primary }]} />
                      <Text
                        style={[
                          styles.projectChipText,
                          projectId === p._id && styles.projectChipTextActive,
                        ]}
                      >
                        {p.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <Text style={styles.label}>Fecha de vencimiento</Text>
            <TextInput
              style={styles.input}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  !title.trim() && styles.submitBtnDisabled,
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitText}>
                  {initial ? 'Guardar' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  projectsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  projectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  projectChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  projectChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  projectChipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  projectChipTextActive: {
    color: colors.white,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  optionTextActive: {
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
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
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});
