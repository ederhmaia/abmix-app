import * as React from 'react'
import { LogBox } from 'react-native'

import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

// import LoginContainer from './navigation/screens/Login'
import MainNavigation from './src/routes/MainContainer'

const Stack = createStackNavigator()

LogBox.ignoreLogs(['Warning: ...'])
LogBox.ignoreAllLogs()

export default function Main() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* <Stack.Screen
          name="Login"
          component={LoginContainer}
          options={{ title: 'Login', headerLeft: null }}
        /> */}
                <Stack.Screen
                    name="HomePage"
                    component={MainNavigation}
                    options={{
                        headerShown: false,
                        headerLeft: null
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
