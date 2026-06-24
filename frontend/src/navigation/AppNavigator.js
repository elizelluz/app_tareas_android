import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import TasksScreen from '../screens/TasksScreen';
import CompletedScreen from '../screens/CompletedScreen';
import StatsScreen from '../screens/StatsScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }) {
  const icons = {
    Tareas: '📋',
    Completadas: '✅',
    Estadísticas: '📊',
  };
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {icons[label]}
      </Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Tab.Screen name="Tareas" component={TasksScreen} />
      <Tab.Screen name="Completadas" component={CompletedScreen} />
      <Tab.Screen name="Estadísticas" component={StatsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    paddingBottom: 4,
    height: 60,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  header: {
    backgroundColor: colors.white,
    shadowColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    opacity: 0.4,
  },
  iconFocused: {
    opacity: 1,
  },
});
