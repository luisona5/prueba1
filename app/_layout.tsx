import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ExpensesProvider } from '../context/ExpensesContext';

export default function AppLayout() {
  return (
    <ExpensesProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: { 
            backgroundColor: '#2c2b2bff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#f7f3f0ff',
          tabBarInactiveTintColor: '#f3efebff',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerStyle: { 
            backgroundColor: '#4285F4',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="balance"
          options={{
            title: 'Balance',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="pie-chart" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="received"
          options={{
            title: 'Recibos',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reporte',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
         
        {/* Pantallas ocultas del tab bar agregar gasto */} 
        <Tabs.Screen
          name="addExpense"
          options={{
            href: null, // Esto oculta la pantalla del tab bar
            title: 'Agregar Gasto',
            headerShown: true,
            headerStyle: { backgroundColor: '#fce959ff'},
            headerTintColor: '#656161ff',
          }}
        />

        <Tabs.Screen
          name="expenseDetail"
          options={{
            href: null, // Esto oculta la pantalla del tab bar
            title: 'Detalle del Gasto',
            headerShown: true,
            headerStyle: { backgroundColor: '#fce959ff' },
            headerTintColor: '#656161ff',
            
          }}
        />
      </Tabs>
    </ExpensesProvider>
  );
}