/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, Image } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import LoginScreen from '../components/Login';
import RegisterScreen from '../components/Registration';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import BuyScreen from '../screens/BuyScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import MetalScreen from '../screens/MetalScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
        <Stack.Screen name="Metal" component={MetalScreen}/>
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].activeTint,
        tabBarActiveBackgroundColor: Colors[colorScheme].tint,
        tabBarInactiveBackgroundColor: Colors[colorScheme].tint
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: 'Портфель',
          tabBarIcon: ({ color, focused }) => focused ? <Image 
                                      source={require('../assets/images/briefcase.png')}
                                      style={{
                                        width: '30%',
                                        height: 50,
                                        resizeMode: 'contain',
                                        margin: 10,
                                      }} /> : <Image 
                                      source={require('../assets/images/briefcase-in.png')}
                                      style={{
                                        width: '30%',
                                        height: 50,
                                        resizeMode: 'contain',
                                        margin: 10,
                                      }} />,
        })}
      />
      <BottomTab.Screen
        name="Buy"
        component={BuyScreen}
        options={{
          title: 'Витрина',
          tabBarIcon: ({ color, focused }) => focused ? <Image 
          source={require('../assets/images/category.png')}
          style={{
            width: '30%',
            height: 50,
            resizeMode: 'contain',
            margin: 10,
          }} /> : <Image 
          source={require('../assets/images/category-in.png')}
          style={{
            width: '30%',
            height: 50,
            resizeMode: 'contain',
            margin: 10,
          }} />,
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Чат',
          tabBarIcon: ({ color, focused }) => focused ? <Image 
          source={require('../assets/images/chat.png')}
          style={{
            width: '30%',
            height: 50,
            resizeMode: 'contain',
            margin: 10,
          }} /> : <Image 
          source={require('../assets/images/chat-in.png')}
          style={{
            width: '30%',
            height: 50,
            resizeMode: 'contain',
            margin: 10,
          }} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, focused }) => focused ? <Image 
          source={require('../assets/images/profile.png')}
          style={{
            width: '30%',
            height: 30,
            resizeMode: 'contain',
            margin: 10,
          }} /> : <Image 
          source={require('../assets/images/profile-in.png')}
          style={{
            width: '30%',
            height: 25,
            resizeMode: 'contain',
            margin: 10,
          }} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
