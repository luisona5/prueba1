import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../context/ExpensesContext';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ReportsScreen() {
  const { expenses } = useExpenses();
  const [startDate, setStartDate] = useState('01/10/2025');
  const [endDate, setEndDate] = useState('17/10/2025');

  // Categorizar gastos basado en descripción
  const categorizeExpense = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.includes('super') || desc.includes('mercado') || desc.includes('comida')) return 'Comida';
    if (desc.includes('restaurante') || desc.includes('cena') || desc.includes('café')) return 'Restaurantes';
    if (desc.includes('uber') || desc.includes('taxi') || desc.includes('transporte')) return 'Transporte';
    return 'Otros';
  };

  // Calcular gastos por categoría
  const categories: Record<string, number> = {};
  expenses.forEach(exp => {
    const cat = categorizeExpense(exp.description);
    categories[cat] = (categories[cat] || 0) + exp.amount;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgPerDay = expenses.length > 0 ? totalExpenses / 15 : 0; // Aproximadamente 15 días

  // Datos para el gráfico (últimos 5 meses simulados)
  const chartData = {
    labels: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct'],
    datasets: [
      {
        data: [300, 450, 280, 320, totalExpenses],
      },
    ],
  };

  const generatePDF = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #f72c7aff; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4285F4; color: white; }
            .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Reporte Mensual - Octubre 2025</h1>
          <p><strong>Período:</strong> ${startDate} - ${endDate}</p>
          <p class="total">Total Gastos: $${totalExpenses.toFixed(2)}</p>
          <p><strong>Promedio/día:</strong> $${avgPerDay.toFixed(2)}</p>
          
          <h2>Gastos por Categoría</h2>
          <table>
            <tr>
              <th>Categoría</th>
              <th>Monto</th>
              <th>%</th>
            </tr>
            ${Object.entries(categories).map(([cat, amount]) => `
              <tr>
                <td>${cat}</td>
                <td>$${amount.toFixed(2)}</td>
                <td>${((amount / totalExpenses) * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </table>
          
          <h2>Detalle de Gastos</h2>
          <table>
            <tr>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Pagado por</th>
              <th>Fecha</th>
            </tr>
            ${expenses.map(exp => `
              <tr>
                <td>${exp.description}</td>
                <td>$${exp.amount.toFixed(2)}</td>
                <td>${exp.paidBy}</td>
                <td>${new Date(exp.date).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el PDF');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reporte Mensual</Text>
        <Text style={styles.headerSubtitle}>Octubre 2025</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Resumen Principal */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Gastos</Text>
            <Text style={styles.summaryValue}>${totalExpenses.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Promedio/día</Text>
            <Text style={styles.summaryValue}>${avgPerDay.toFixed(2)}</Text>
          </View>
        </View>

        {/* Gráfico de tendencia */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gastos Mensuales</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 60}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#4285F4',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Gastos por Categoría */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gastos por Categoría</Text>
          
          {Object.entries(categories).length === 0 ? (
            <Text style={styles.emptyText}>No hay gastos para mostrar</Text>
          ) : (
            Object.entries(categories)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const percentage = (amount / totalExpenses) * 100;
                const barColor = 
                  category === 'Comida' ? '#4285F4' :
                  category === 'Restaurantes' ? '#9C27B0' :
                  category === 'Transporte' ? '#FF6B35' : '#2ecc71';
                
                return (
                  <View key={category} style={styles.categoryItem}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>{category}</Text>
                      <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { width: `${percentage}%`, backgroundColor: barColor }
                        ]} 
                      />
                    </View>
                  </View>
                );
              })
          )}
        </View>

        {/* Período del Reporte */}
        <View style={styles.card}>
          <View style={styles.periodHeader}>
            <Ionicons name="calendar" size={20} color="#666" />
            <Text style={styles.cardTitle}>Período del Reporte</Text>
          </View>
          
          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>Desde</Text>
              <Text style={styles.dateValue}>{startDate}</Text>
            </View>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>Hasta</Text>
              <Text style={styles.dateValue}>{endDate}</Text>
            </View>
          </View>
        </View>

        {/* Botones de Acción */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={generatePDF}
        >
          <Ionicons name="download" size={20} color="white" />
          <Text style={styles.buttonText}>Generar PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={generatePDF}
        >
          <Ionicons name="share-social" size={20} color="#f4f5f8ff" />
          <Text style={styles.secondaryButtonText}>Compartir </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#31c433ff',
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
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ea9330ff',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#3cd052ff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#6f74f4ff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#4285F4',
  },
  secondaryButtonText: {
    color: '#f1f3f7ff',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
});