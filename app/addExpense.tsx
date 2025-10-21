import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useExpenses } from '../context/ExpensesContext';

export default function AddExpense() {
  const { addExpense } = useExpenses(); //Función agregar gasto en Context
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('Juan');
  const [participants, setParticipants] = useState<string[]>(['Juan', 'María']);
  const [image, setImage] = useState<string | undefined>(undefined);

  const PEOPLE = ['Juan', 'María', 'Pedro'];

  const pickImage = async () => {
    // Solicitar permisos
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Solicitar permisos
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso denegado', 'Necesitas dar permiso para usar la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const validateAndSave = async () => {
    if (!description.trim()) {
      Alert.alert('Validación', 'La descripción es requerida');
      return;
    }
    
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      Alert.alert('Validación', 'El monto debe ser mayor a 0');
      return;
    }
    
    if (!image) {
      Alert.alert('Validación', 'Debes adjuntar la foto del recibo');
      return;
    }

    const participantsList = participants.filter(Boolean);

    if (participantsList.length === 0) {
      Alert.alert('Validación', 'Debes agregar al menos un participante');
      return;
    }

    await addExpense({
      description,
      amount: numAmount,
      paidBy,
      participants: participantsList,
      date: new Date().toISOString(),
      receiptImage: image,
      verified: true,
    });

    Alert.alert('Éxito', 'Gasto agregado correctamente', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Descripción del gasto</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Ej: Supermercado"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Monto ($)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Pagado por</Text>
        <View style={styles.optionsRow}>
          {PEOPLE.map((name) => (
            <TouchableOpacity
              key={name}
              style={[styles.optionButton, paidBy === name && styles.optionButtonActive]}
              onPress={() => setPaidBy(name)}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionText, paidBy === name && styles.optionTextActive]}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Participantes</Text>
        <Text style={styles.hint}>Selecciona quiénes participan en este gasto</Text>
        <View style={styles.chipsRow}>
          {PEOPLE.map((name) => {
            const selected = participants.includes(name);
            return (
              <TouchableOpacity
                key={name}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => {
                  setParticipants((prev) =>
                    prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
                  );
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
      </View>

      <View style={styles.section}>
        <Text style={styles.label}> Recibo</Text>
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.imageButtonText}>Tomar foto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.imageButton, styles.imageButtonSecondary]} onPress={pickImage}>
            <Ionicons name="images" size={20} color="#4285F4" />
            <Text style={[styles.imageButtonText, styles.imageButtonTextSecondary]}>
              Galería
            </Text>
          </TouchableOpacity>
        </View>

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.preview} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setImage(undefined)}
            >
              <Ionicons name="close-circle" size={32} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
        <Ionicons name="checkmark-circle" size={24} color="white" />
        <Text style={styles.saveButtonText}>Guardar gasto</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#333',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    fontStyle: 'italic',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  optionText: {
    color: '#333',
    fontWeight: '600',
  },
  optionTextActive: {
    color: 'white',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  chipText: {
    color: '#333',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: 'white',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: '#4285F4',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  imageButtonSecondary: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4285F4',
  },
  imageButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  imageButtonTextSecondary: {
    color: '#4285F4',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginTop: 12,
  },
  preview: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#45ad70ff',
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    padding: 16,
    backgroundColor: '#fd0730ff',
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fffdfdff',
    fontWeight: '600',
    fontSize: 16,
    
  },
  bottomSpacer: {
    height: 30,
  },
});