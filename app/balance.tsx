import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useExpenses } from '../context/ExpensesContext';

export default function BalanceScreen() {
  const { expenses, computeBalances } = useExpenses();
  const balances = computeBalances();

  // Calcular quién debe a quién
  const debts: { from: string; to: string; amount: number }[] = [];
  const people = Object.keys(balances);
  
  // Algoritmo de simplificación de deudas
  const positive = people.filter(p => balances[p] > 0.01); //acrredores
  const negative = people.filter(p => balances[p] < -0.01);//deudores

  negative.forEach(debtor => {
    let remaining = Math.abs(balances[debtor]);
    positive.forEach(creditor => {
      if (remaining > 0.01 && balances[creditor] > 0.01) {
        const payment = Math.min(remaining, balances[creditor]);
        debts.push({
          from: debtor,
          to: creditor,
          amount: payment
        });
        remaining -= payment;
        balances[creditor] -= payment;
      }
    });
  });

  // Calcula cuánto gastó  cada persona
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const myExpenses = expenses
    .filter(e => e.paidBy === 'Juan')
    .reduce((sum, e) => sum + e.amount, 0);
  const avgPerPerson = totalExpenses / Math.max(1, people.length); //promedio

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Balance de Cuentas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Resumen de Deudas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}> Resumen de Deudas</Text>
          </View>

          {debts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No hay deudas pendientes</Text>
              <Text style={styles.emptySubtext}>¡Todas las cuentas están saldadas!</Text>
            </View>
          ) : (
            debts.map((debt, index) => (
              <View key={index} style={styles.debtCard}>
                <View style={styles.debtLeft}>
                  <View style={[styles.avatar, { backgroundColor: '#FFE5E5' }]}>
                    <Text style={[styles.avatarText, { color: '#e74c3c' }]}>
                      {debt.from[0]?.toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.debtName}>{debt.from}</Text>
                    <Text style={styles.debtDetail}>debe a {debt.to}</Text>
                  </View>
                </View>
                <View style={styles.debtRight}>
                  <Text style={styles.debtAmount}>${debt.amount.toFixed(2)}</Text>
                  <TouchableOpacity style={styles.markPaidButton}>
                    <Text style={styles.markPaidText}>Marcar pagado</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Algoritmo de División */}
        <View style={styles.algorithmCard}>
          <Text style={styles.algorithmTitle}>Algoritmo de División</Text>
          <Text style={styles.algorithmSubtitle}>Método: Simplificación de deudas</Text>
          
          <View style={styles.divider} />
          
          {people.map((person, index) => (
            <Text key={index} style={styles.algorithmLine}>
              {person} gastó: ${expenses
                .filter(e => e.paidBy === person)
                .reduce((s, e) => s + e.amount, 0)
                .toFixed(2)}
            </Text>
          ))}
          
          <View style={styles.divider} />
          
          <Text style={styles.algorithmLine}>
            Promedio por persona: ${avgPerPerson.toFixed(2)}
          </Text>
        </View>

        {/* Estadísticas adicionales */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Gastos</Text>
            <Text style={styles.statValue}>${totalExpenses.toFixed(2)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Mis Gastos</Text>
            <Text style={styles.statValue}>${myExpenses.toFixed(2)}</Text>
          </View>
        </View>

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
    backgroundColor: '#f56518ff',
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
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  debtCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  debtLeft: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  debtName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  debtDetail: {
    fontSize: 13,
    color: '#666',
  },
  debtRight: {
    alignItems: 'flex-end',
  },
  debtAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 6,
  },
  markPaidButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  markPaidText: {
    fontSize: 12,
    color: '#4285F4',
    fontWeight: '600',
  },
  algorithmCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  algorithmTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b1c1dff',
    marginBottom: 4,
  },
  algorithmSubtitle: {
    fontSize: 14,
    color: '#26292aff',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#C8E6C9',
    marginVertical: 12,
  },
  algorithmLine: {
    fontSize: 14,
    color: '#264d9aff',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
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
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  bottomSpacer: {
    height: 20,
  },
});