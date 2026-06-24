import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet } from 'react-native';
import TasksScreen from '../screens/TasksScreen';
import CompletedScreen from '../screens/CompletedScreen';
import StatsScreen from '../screens/StatsScreen';
import { colors } from '../theme/colors';

const Tab = createMaterialTopTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarIndicatorStyle: styles.indicator,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'none',
  },
  indicator: {
    backgroundColor: colors.primary,
    height: 3,
    borderRadius: 3,
  },
});
