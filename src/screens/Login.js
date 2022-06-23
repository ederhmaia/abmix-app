import * as React from 'react'
import { View, Image } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import Logo from '../../assets/icon.png'

export default function LoginContainer({ navigation }) {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')

    const Login = () => {
        const auth = getAuth()

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                navigation.navigate('HomePage', {
                    user: user
                })
            })
            .catch((error) => {
                setError(error.message)
            })
    }

    return (
        <View
            style={{
                backgroundColor: '#f1f1f1',
                height: '100%'
            }}
        >
            <View style={{ alignSelf: 'center' }}>
                <Card
                    style={{
                        paddingHorizontal: 30,
                        height: 320,
                        marginTop: '25%'
                    }}
                >
                    <Image
                        source={Logo}
                        style={{
                            alignSelf: 'center',
                            width: 100,
                            height: 100
                        }}
                    />

                    <View style={{ marginTop: 5, width: 300 }}>
                        <TextInput
                            style={{ height: 50, marginTop: 5 }}
                            placeholder="Email"
                            mode="outlined"
                            onChangeText={(value) => {
                                setEmail(value)
                            }}
                        />
                        <TextInput
                            secureTextEntry={true}
                            mode="outlined"
                            style={{ height: 50, marginTop: 5 }}
                            placeholder="Senha"
                            onChangeText={(value) => {
                                setPassword(value)
                            }}
                        />
                        <Button
                            style={{ marginTop: 10, paddingVertical: 10 }}
                            mode="contained"
                            onPress={() => {
                                Login()
                            }}
                        >
                            Entrar
                        </Button>
                    </View>
                </Card>
            </View>
        </View>
    )
}
