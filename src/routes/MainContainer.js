import * as React from 'react'
import { useTheme } from 'react-native-paper'

import Ionicons from 'react-native-vector-icons/Ionicons'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

//screens
import OrderScreen from '../screens/orders/Order'
import ClientStack from './ClientContainer'
import HomeStack from './HomeContainer'

//naming
const homeName = 'Início'
const orderName = 'Pedidos'
const clientName = 'Clientes'
// const adminName = 'Relatórios'

const Tab = createBottomTabNavigator()

export default function MainNavigation({ route, navigation }) {
    params = route.params
    return (
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
                tabBarLabelStyle: {
                    color: useTheme().colors.text
                },
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, size }) => {
                    let iconName
                    let rn = route.name
                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (rn === orderName) {
                        iconName = focused ? 'list' : 'list-outline'
                    } else if (rn === clientName) {
                        iconName = focused ? 'person-circle' : 'person-circle-outline'
                    } else if (rn === adminName) {
                        iconName = focused ? 'clipboard' : 'clipboard-outline'
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={useTheme().colors.primary} />
                    )
                }
            })}
        >
            <Tab.Screen
                name={homeName}
                component={HomeStack}
                options={{
                    headerShown: false,
                    headerLeft: () => null
                }}
            />
            <Tab.Screen
                name={orderName}
                component={OrderScreen}
                options={{
                    headerLeft: () => null
                }}
            />
            <Tab.Screen
                name={clientName}
                component={ClientStack}
                options={{
                    headerShown: false,
                    headerLeft: () => null
                }}
            />
            {/* <Tab.Screen name={adminName} component={AdminScreen} /> */}
        </Tab.Navigator>
    )
}
