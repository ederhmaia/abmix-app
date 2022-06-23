import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import HomeClients from '../screens/clients/HomeClients'
import AddClient from '../screens/clients/AddClient'
import EditClient from '../screens/clients/EditClient'

const Stack = createStackNavigator()

export default function ClientStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeClients"
                component={HomeClients}
                options={{ title: 'Clientes', headerLeft: () => null }}
            />
            <Stack.Screen
                name="AddClient"
                component={AddClient}
                options={{ title: 'Adicionar Cliente' }}
            />
            <Stack.Screen
                name="EditClient"
                component={EditClient}
                options={{ title: 'Editar Cliente' }}
            />
        </Stack.Navigator>
    )
}
