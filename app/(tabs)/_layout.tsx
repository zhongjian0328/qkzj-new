import React from "react";
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Tabs } from "expo-router";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


export default function Layout() {
  return (
    <Tabs 
      backBehavior="order"
      screenOptions={{ 
          tabBarActiveTintColor: "#3BCCA5",
          tabBarInactiveTintColor: "#6B7280",
          tabBarStyle: {
            backgroundColor: "#FFFFFF"
          }
      }}>

        <Tabs.Screen
            name="index"
            options={{href: null}}
        />

        <Tabs.Screen name="p-home_farmer_small" options={{
            title: '首页', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="house" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-ai_diagnosis" options={{
            title: 'AI诊断', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="stethoscope" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-user_profile" options={{
            title: '我的', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="user" size={20} color={color} />
            )
        }}/>
    </Tabs>
  );
}