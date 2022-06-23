import * as React from 'react'
import { useState, useEffect } from 'react'

import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Alert, Linking, Text } from 'react-native'
import { Button, Card, Title, Avatar, Paragraph } from 'react-native-paper'
import { dismiss } from 'react-native/Libraries/LogBox/Data/LogBoxData'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import ShouldRender from '../../components/ShouldRender'

export default function ClientCard(props) {
    const navigation = useNavigation()
    const [CardModalVisibility, setCardModalVisibility] = useState(false)

    const callWhatsapp = () => {
        return Linking.openURL(
            `https://api.whatsapp.com/send?phone=${props.cell}&text=Olá, ${props.name}.`
        )
    }

    const phoneNumber = () => {
        Linking.openURL(`tel:${props.cell}`)
    }

    const editClient = () => {
        navigation.navigate('Clientes', {
            screen: 'EditClient',
            params: {
                clientToEdit: {
                    ClientID: props.id,
                    name: props.nome,
                    cpf: props.cpf,
                    email: props.email,
                    cell: props.cell,
                    address: props.address,
                    city: props.city,
                    district: props.district,
                    cnpj: props.cnpj,
                    entityType: props.entityType,
                    inscEstadual: props.inscEstadual
                }
            }
        })
    }
    const deleteClient = () => {
        Alert.alert('Excluir Cliente', 'O cliente será excluido permanentemente dos registros!', [
            {
                text: 'Excluir',
                onPress: () => db.collection('clients').doc(props.id).delete(),
                style: 'autodestructive'
            },
            {
                text: 'Cancelar',
                onPress: () => dismiss,
                style: 'cancel'
            }
        ])
    }

    const avatarIcon = () => {
        if (props.cnpj === '') {
            return <FontAwesome name="user" size={18} color="white" />
        } else {
            return <Ionicons name="ios-briefcase" size={18} color="white" />
        }
    }
    const LeftContent = (props) => <Avatar.Icon {...props} icon={avatarIcon} />

    return (
        <Card
            style={{
                marginBottom: 5,
                borderRadius: 8
            }}
        >
            <TouchableOpacity
                onPress={() => {
                    CardModalVisibility
                        ? setCardModalVisibility(false)
                        : setCardModalVisibility(true)
                }}
            >
                <Card.Title
                    title={props.nome.toUpperCase()}
                    subtitle={props.city}
                    left={LeftContent}
                />
                <Card.Content style={{ paddingHorizontal: 16 }}>
                    <ShouldRender if={CardModalVisibility}>
                        <ShouldRender if={props.cpf}>
                            <Paragraph style={{ fontSize: 14 }}>
                                CPF:{' '}
                                <Text style={{ fontWeight: 'bold' }}>
                                    {props.cpf
                                        .replace(/\D/g, '')
                                        .replace(/(\d{3})(\d)/, '$1.$2')
                                        .replace(/(\d{3})(\d)/, '$1.$2')
                                        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')}
                                </Text>
                            </Paragraph>
                        </ShouldRender>
                        <ShouldRender if={props.cnpj}>
                            <Paragraph style={{ fontSize: 14 }}>
                                CNPJ:{' '}
                                <Text style={{ fontWeight: 'bold' }}>
                                    {props.cnpj.replace(
                                        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                                        '$1.$2.$3/$4-$5'
                                    )}
                                </Text>
                            </Paragraph>
                            <Paragraph style={{ fontSize: 14 }}>
                                Tipo de Entidade:{' '}
                                <Text style={{ fontWeight: 'bold' }}>
                                    {props.entityType == 'sociedade' ? 'Sociedade Cooperativa' : ''}
                                    {props.entityType == 'orgaos'
                                        ? 'Órgãos/Autarquias/Fun. Federais'
                                        : ''}
                                    {props.entityType == 'admpublica' ? 'Adm. Pública Federal' : ''}
                                    {props.entityType == 'pjprivado' ? 'PJ Direito Privado' : ''}
                                    {props.entityType == 'fabricante'
                                        ? 'Fabricante de Máquinas e Veículos'
                                        : ''}
                                    {props.entityType == 'outros' ? 'Outros' : ''}
                                </Text>
                            </Paragraph>
                            <Paragraph style={{ fontSize: 14 }}>
                                Inscrição Estadual:{' '}
                                <Text style={{ fontWeight: 'bold' }}>{props.inscEstadual}</Text>
                            </Paragraph>
                        </ShouldRender>
                        <Paragraph>
                            Email: <Text style={{ fontWeight: 'bold' }}>{props.email}</Text>
                        </Paragraph>

                        <Paragraph>
                            Celular: <Text style={{ fontWeight: 'bold' }}>{props.cell}</Text>
                        </Paragraph>

                        <Paragraph>
                            Bairro: <Text style={{ fontWeight: 'bold' }}>{props.district}</Text>
                        </Paragraph>

                        <Paragraph>
                            Endereço: <Text style={{ fontWeight: 'bold' }}>{props.address}</Text>
                        </Paragraph>
                    </ShouldRender>
                </Card.Content>
                <ShouldRender if={CardModalVisibility}>
                    <Card.Actions
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            paddingVertical: '0%'
                        }}
                    >
                        <Button
                            onPress={() => {
                                callWhatsapp()
                            }}
                            icon="whatsapp"
                        >
                            Whatsapp
                        </Button>

                        <Button
                            onPress={() => {
                                phoneNumber()
                            }}
                            icon="phone"
                        >
                            Ligar
                        </Button>
                        <Button onPress={editClient} style={{ marginRight: 8 }} icon="pencil">
                            Editar
                        </Button>
                        <Button onPress={deleteClient}>
                            <FontAwesome name="trash" />
                        </Button>
                    </Card.Actions>
                </ShouldRender>
            </TouchableOpacity>
        </Card>
    )
}
