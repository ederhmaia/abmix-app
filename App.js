import * as React from 'react'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import Main from './Main'

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'blue',
        backdrop: 'red'
    }
}

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <Main />
        </PaperProvider>
    )
}
