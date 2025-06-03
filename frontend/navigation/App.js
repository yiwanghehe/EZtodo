import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../pages/HomeScreen';
import TodayScreen from '../pages/TodayScreen';
import ImportantScreen from '../pages/ImportantScreen';
import PlanScreen from '../pages/PlanScreen';
import AssignedScreen from '../pages/AssignedScreen';
import TaskScreen from '../pages/TaskScreen';

import {navigationRef} from "../utils/RootNavigation";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer ref={navigationRef}>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        const icons = {
                            Home: focused ? 'home' : 'home-outline',
                            Today: focused ? 'sunny' : 'sunny-outline',
                            Important: focused ? 'star' : 'star-outline',
                            Plan: focused ? 'calendar' : 'calendar-outline',
                            Assigned: focused ? 'people' : 'people-outline',
                            Task: focused ? 'documents' : 'documents-outline',
                        };
                        return <Ionicons name={icons[route.name]} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#007AFF',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} options={{ title: '主页' }} />
                <Tab.Screen name="Today" component={TodayScreen} options={{ title: '今天' }} />
                <Tab.Screen name="Important" component={ImportantScreen} options={{ title: '重要' }} />
                <Tab.Screen name="Plan" component={PlanScreen} options={{ title: '计划内' }} />
                <Tab.Screen name="Assigned" component={AssignedScreen} options={{ title: '已分配给我' }} />
                <Tab.Screen name="Task" component={TaskScreen} options={{ title: '任务' }} />
            </Tab.Navigator>
        </NavigationContainer>


    );
}
