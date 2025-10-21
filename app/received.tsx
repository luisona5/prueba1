import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../context/ExpensesContext';

export default function ReceivedScreen() {
  const { expenses } = useExpenses();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const receipts = expenses.filter(e => e.receiptImage);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Galería de Recibos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Resumen */}
        {receipts.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{receipts.length}</Text>
            <Text style={styles.summaryLabel}>Total Recibos</Text>
          </View>
        )}

        {/* Grid de recibos */}
        {receipts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay recibos registrados</Text>
            <Text style={styles.emptySubtext}>Los recibos aparecerán aquí cuando agregues gastos</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {receipts.map((receipt) => (
              <TouchableOpacity
                key={receipt.id}
                style={styles.receiptCard}
                onPress={() => setSelectedImage(receipt.receiptImage || null)}
              >
                <View style={styles.imageContainer}>
                  {receipt.receiptImage ? (
                    <Image 
                      source={{ uri: receipt.receiptImage }} 
                      style={styles.receiptImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Ionicons name="document-text" size={40} color="#999" />
                    </View>
                  )}
                  <TouchableOpacity 
                    style={styles.zoomIcon}
                    onPress={() => setSelectedImage(receipt.receiptImage || null)}
                  >
                    <Ionicons name="search" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.receiptInfo}>
                  <Text style={styles.receiptTitle} numberOfLines={1}>
                    {receipt.description}
                  </Text>
                  <Text style={styles.receiptDate}>
                    {new Date(receipt.date).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </Text>
                  <Text style={styles.receiptAmount}>${receipt.amount.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal para ver imagen ampliada */}
      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setSelectedImage(null)}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
              
              {selectedImage && (
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5ff',
  },
  header: {
    backgroundColor: '#FF6B35',
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 13,
    color: '#1976D2',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 12,
    

  },
  receiptCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  receiptImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
  },
  zoomIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptInfo: {
    padding: 12,
  },
  receiptTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  receiptDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  receiptAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0c0c0cff',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  bottomSpacer: {
    height: 20,
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