import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../context/ExpensesContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { expenses, computeBalances } = useExpenses();
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const balances = computeBalances();

  const navigateToExpenseDetail = (id: string) => {
    router.push({ pathname: '/expenseDetail', params: { id } });
  };

  const navigateToAddExpense = () => {
    router.push('/addExpense');
  };

  return (
    <View style={styles.container}>
      {/* Header con total gastado */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Gastos Compartidos</Text>
            <Ionicons name="people" size={24} color="white" />
          </View>
          <Text style={styles.totalLabel}>Total gastado</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          <Text style={styles.date}>Octubre 2025</Text>
        </View>
      </View>

      <ScrollView style={styles.expensesList} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Gastos</Text>
        
        {expenses.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay gastos registrados</Text>
            <Text style={styles.emptySubtext}>Toca el botón + para agregar uno</Text>
          </View>
        )}

        {expenses.map((expense) => (
          <TouchableOpacity 
            key={expense.id} 
            style={styles.expenseItem}
            onPress={() => navigateToExpenseDetail(expense.id)}
          >
            <View style={styles.expenseLeft}>
              <Text style={styles.expenseDescription}>{expense.description}</Text>
              <Text style={styles.expenseDetails}>
                Pagado por {expense.paidBy} • {new Date(expense.date).toLocaleDateString()}
              </Text>
              <View style={styles.participantsList}>
                {expense.participants.map((p, i) => (
                  <View key={i} style={styles.participantBadge}>
                    <Text style={styles.participantInitial}>{p[0]?.toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.expenseRight}>
              <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
              {expense.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                  <Text style={styles.verifiedText}>Recibo verificado</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {expenses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Balances</Text>
            {Object.keys(balances).length === 0 && (
              <Text style={styles.noBalances}>Sin balances aún</Text>
            )}
            {Object.entries(balances).map(([person, val]) => (
              <View key={person} style={styles.balanceRow}>
                <View style={styles.balanceLeft}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{person[0]?.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.balanceName}>{person}</Text>
                </View>
                <Text style={[
                  styles.balanceAmount,
                  { color: val >= 0 ? '#27ae60' : '#e74c3c' }
                ]}>
                  {val >= 0 ? `+$${val.toFixed(2)}` : `-$${Math.abs(val).toFixed(2)}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={navigateToAddExpense}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4285F4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    padding: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  totalLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  expensesList: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
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
  },
  expenseItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  expenseLeft: {
    flex: 1,
    marginRight: 12,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  expenseDetails: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  participantsList: {
    flexDirection: 'row',
    gap: 4,
  },
  participantBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantInitial: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4285F4',
  },
  expenseRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#27ae60',
  },
  section: {
    marginTop: 20,
  },
  noBalances: {
    color: '#666',
    fontSize: 14,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e74c3c',
  },
  balanceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});