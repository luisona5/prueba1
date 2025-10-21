import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../context/ExpensesContext';
import { useLocalSearchParams, router } from 'expo-router';

export default function ExpenseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { expenses, deleteExpense } = useExpenses();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorText}>Gasto no encontrado</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar gasto',
      '¿Estás seguro de que deseas eliminar este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteExpense(expense.id);
            router.back();
          },
        },
      ]
    );
  };

  const sharePerPerson = expense.amount / expense.participants.length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Monto Total</Text>
            <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
          </View>
          {expense.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
              <Text style={styles.verifiedText}>Verificado</Text>
            </View>
          )}
        </View>

        {/* Información principal */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información del Gasto</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="pricetag" size={20} color=" #4285F4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Descripción</Text>
              <Text style={styles.infoValue}>{expense.description}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar" size={20} color="#4285F4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>
                {new Date(expense.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="person" size={20} color="#4285F4" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Pagado por</Text>
              <Text style={styles.infoValue}>{expense.paidBy}</Text>
            </View>
          </View>
        </View>

        {/* Participantes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Participantes</Text>
          <Text style={styles.shareInfo}>
            Cada persona debe: ${sharePerPerson.toFixed(2)}
          </Text>
          
          <View style={styles.participantsList}>
            {expense.participants.map((participant, index) => (
              <View key={index} style={styles.participantItem}>
                <View style={styles.participantAvatar}>
                  <Text style={styles.participantInitial}>
                    {participant[0]?.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.participantInfo}>
                  <Text style={styles.participantName}>{participant}</Text>
                  <Text style={styles.participantShare}>
                    {participant === expense.paidBy 
                      ? 'Pagó el total' 
                      : `Debe: $${sharePerPerson.toFixed(2)}`}
                  </Text>
                </View>
                {participant === expense.paidBy && (
                  <View style={styles.paidBadge}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Recibo */}
        {expense.receiptImage && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recibo</Text>
            <TouchableOpacity 
              style={styles.receiptContainer}
              onPress={() => setImageModalVisible(true)}
            >
              <Image 
                source={{ uri: expense.receiptImage }} 
                style={styles.receiptImage}
                resizeMode="cover"
              />
              <View style={styles.zoomOverlay}>
                <Ionicons name="expand" size={32} color="white" />
                <Text style={styles.zoomText}> Ampliar</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Botón de eliminar */}
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.deleteText}>Eliminar gasto</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </View>

      {/* Modal para ver imagen ampliada */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setImageModalVisible(false)}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
              
              {expense.receiptImage && (
                <Image 
                  source={{ uri: expense.receiptImage }} 
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  headerCard: {
    backgroundColor: '#4285F4',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  amountContainer: {
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  amount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  shareInfo: {
    fontSize: 14,
    color: '#4285F4',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  participantsList: {
    gap: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  participantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  participantInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  participantShare: {
    fontSize: 13,
    color: '#666',
  },
  paidBadge: {
    backgroundColor: '#27ae60',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptContainer: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  zoomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  zoomText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 10,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  deleteText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalBackground: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
});