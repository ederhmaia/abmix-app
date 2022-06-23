// import HomeScreen from './screens/Home'
import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/Home'
import EditScreen from '../screens/orders/EditOrder'

const Stack = createStackNavigator()

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerTitle: 'Início',
                    headerLeft: () => null
                }}
            />
            <Stack.Screen name="Editar" component={EditScreen} />
        </Stack.Navigator>
    )
}
