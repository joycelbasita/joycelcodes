
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AppProvider } from './AppContext';
import HomeTab from './HomeTab';
import SettingsTab from './SettingsTab';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    // Share the Context API data with all screens
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#243B64',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarActiveTintColor: '#8C83C6',
            tabBarInactiveTintColor: '#888888',
            tabBarStyle: {
              height: 65,
              paddingBottom: 10,
              paddingTop: 8,
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeTab}
          />

          <Tab.Screen
            name="Settings"
            component={SettingsTab}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
