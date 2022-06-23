import * as React from 'react'
import { useState, useEffect } from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Alert, View, Modal, TouchableOpacity } from 'react-native'
import { Text, Avatar, Button, Card, Title, useTheme } from 'react-native-paper'
import { dismiss } from 'react-native/Libraries/LogBox/Data/LogBoxData'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import ShouldRender from '../../components/ShouldRender'
import { AntDesign } from '@expo/vector-icons'

export default function OrderCard(props) {
    const LeftContentIcon =
        props.orderStatus == 'pending'
            ? 'truck-delivery-outline'
            : props.orderStatus == 'done'
            ? 'truck-check'
            : 'tow-truck'

    const CardColor =
        props.orderStatus == 'pending'
            ? useTheme().colors.primary
            : props.orderStatus == 'done'
            ? useTheme().colors.accent
            : props.orderStatus == 'cancel'
            ? useTheme().colors.error
            : useTheme().colors.primary

    const LeftContent = (props) => (
        <Avatar.Icon {...props} icon={LeftContentIcon} style={{ backgroundColor: CardColor }} />
    )

    const navigation = useNavigation()
    const [orderToSent, setOrderToSent] = useState(null)
    const [CardModalVisibility, setCardModalVisibility] = useState(false)
    const [actionsVisibility, setActionsVisible] = useState(false)
    useFocusEffect(
        React.useCallback(() => {
            setOrderToSent(props.order)
        }, [])
    )

    const getProductInfo = () => {
        if (props.productType === 'concreto' && props.isPumped === true) {
            if (props.pumpAddr == 1) {
                return 'Bombeado (P1000)'
            }
            if (props.pumpAddr == 2) {
                return 'Bombeado (P500)'
            }
        }
        if (props.productType === 'concreto' && props.isPumped === false) {
            return 'Não Bombeado'
        }
        if (props.productType === 'argamassa') {
            return ''
        }
    }

    const checkIsDone = () => {
        if (props.orderStatus === 'done') {
            Alert.alert('Marcar Pendente', 'O pedido será restaurado como pendente!', [
                {
                    text: 'Confirmar',
                    onPress: () =>
                        db.collection('orders').doc(props.order).update({ status: 'pending' }),
                    style: 'default'
                },
                {
                    text: 'Cancelar',
                    onPress: () => dismiss,
                    style: 'cancel'
                }
            ])
        } else if (props.orderStatus == 'pending') {
            Alert.alert('Concluir Pedido', 'O pedido será marcado como entregue!', [
                {
                    text: 'Confirmar',
                    onPress: () =>
                        db.collection('orders').doc(props.order).update({ status: 'done' }),
                    style: 'default'
                },
                {
                    text: 'Cancelar',
                    onPress: () => dismiss,
                    style: 'cancel'
                }
            ])
        } else {
            Alert.alert('Restaurar Pedido', 'O pedido será marcado como pendente.', [
                {
                    text: 'Confirmar',
                    onPress: () =>
                        db.collection('orders').doc(props.order).update({ status: 'pending' }),
                    style: 'default'
                },
                {
                    text: 'Cancelar',
                    onPress: () => dismiss,
                    style: 'cancel'
                }
            ])
        }
    }
    const editOrder = () => {
        navigation.navigate('Início', {
            screen: 'Editar',
            params: { docToEdit: orderToSent }
        })
    }
    const cancelOrder = () => {
        Alert.alert(
            'Cancelar Pedido',
            'O pedido será definido como cancelado!\nPedidos cancelados são automaticamente removidos após 30 dias.',
            [
                {
                    text: 'Confirmar',
                    onPress: () =>
                        db.collection('orders').doc(props.order).update({ status: 'cancel' }),
                    style: 'autodestructive'
                },
                {
                    text: 'Cancelar',
                    onPress: () => dismiss,
                    style: 'cancel'
                }
            ]
        )
    }

    const deleteOrder = () => {
        Alert.alert(
            'Excluir Pedido',
            'O pedido será apagado para sempre!\nPedidos apagados não podem ser restaurados.',
            [
                {
                    text: 'Confirmar',
                    onPress: () => db.collection('orders').doc(props.order).delete(),
                    style: 'destructive'
                },
                {
                    text: 'Cancelar',
                    onPress: () => dismiss,
                    style: 'cancel'
                }
            ]
        )
    }
    const CheckisDoneIcon =
        props.orderStatus == 'done'
            ? 'undo'
            : props.orderStatus == 'pending'
            ? 'check'
            : props.orderStatus == 'cancel'
            ? 'undo'
            : 'check'

    return (
        <>
            <Card
                style={{
                    marginBottom: 5,
                    width: '95%',
                    borderRadius: 10,
                    marginLeft: 10
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        setActionsVisible(!actionsVisibility)

                        CardModalVisibility
                            ? setCardModalVisibility(false)
                            : setCardModalVisibility(true)
                    }}
                >
                    <Card.Title
                        title={props.clientNome}
                        titleStyle={{ fontSize: 20 }}
                        subtitleStyle={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: useTheme().colors.text
                        }}
                        subtitle={`${props.orderTime} - ${props.orderDate}`}
                        left={LeftContent}
                        style={{ marginVertical: '-1%' }}
                    />
                    <Card.Content style={{ paddingHorizontal: 16 }}>
                        {/* icons */}
                        <View style={{ marginTop: 3 }}>
                            <Title
                                style={{
                                    fontSize: 18,
                                    marginBottom: 5
                                }}
                            >
                                <AntDesign
                                    name="exclamationcircle"
                                    size={16}
                                    color={useTheme().colors.primary}
                                />
                                {'  '}
                                {props.productType === 'concreto' ? 'Concreto - ' : 'Argamassa'}
                                {getProductInfo()}
                            </Title>
                            <ShouldRender if={CardModalVisibility}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View
                                        style={{
                                            width: '8%',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text>
                                            <FontAwesome name="clipboard" />
                                            <Text> </Text>
                                        </Text>
                                        <Text>
                                            <FontAwesome name="map-marker" />
                                            <Text> </Text>
                                        </Text>
                                        <Text>
                                            <FontAwesome name="users" />
                                            <Text> </Text>
                                        </Text>
                                        <Text>
                                            <FontAwesome name="tasks" />
                                            <Text> </Text>
                                        </Text>
                                        <Text>
                                            <FontAwesome name="truck" />
                                            <Text> </Text>
                                        </Text>
                                        <Text>
                                            <Ionicons name="pricetags-outline" />
                                            <Text> </Text>
                                        </Text>

                                        <ShouldRender
                                            if={props.productType === 'concreto' && props.isPumped}
                                        >
                                            <Text>
                                                <Ionicons name="pricetags" />
                                                <Text> </Text>
                                            </Text>
                                        </ShouldRender>
                                        <Text>
                                            <FontAwesome name="usd" />
                                            <Text> </Text>
                                        </Text>
                                        <Text>
                                            <FontAwesome name="bank" />
                                            <Text> </Text>
                                        </Text>
                                        <ShouldRender if={props.paymentMethod === 'boleto'}>
                                            <Text>
                                                <Ionicons name="calendar" />
                                                <Text> </Text>
                                            </Text>
                                        </ShouldRender>
                                    </View>

                                    {/* text */}
                                    <View>
                                        <Text>
                                            Vendedor:{' '}
                                            <Text
                                                style={{
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {props.provider}
                                            </Text>
                                        </Text>

                                        <Text>
                                            Endereço:{' '}
                                            <Text
                                                style={{
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {props.clientAddr}
                                            </Text>
                                        </Text>

                                        <Text>
                                            Responsável:{' '}
                                            <Text
                                                style={{
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {props.orderContact}
                                            </Text>
                                        </Text>

                                        <Text>
                                            MPa:{' '}
                                            <Text
                                                style={{
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {props.resistance}
                                            </Text>
                                        </Text>

                                        <Text>
                                            Volume:{' '}
                                            <Text
                                                style={{
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {props.volume} m³
                                            </Text>
                                        </Text>

                                        <Text>
                                            Preço M³:{' '}
                                            <Text
                                                style={{
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                R${' '}
                                                {props.price
                                                    .replace('.', ',')
                                                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
                                            </Text>
                                        </Text>

                                        <ShouldRender
                                            if={props.productType === 'concreto' && props.isPumped}
                                        >
                                            <Text>
                                                Taxa da Bomba:{' '}
                                                <Text style={{ fontWeight: 'bold' }}>
                                                    R${' '}
                                                    {props.pumpFee
                                                        .replace('.', ',')
                                                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
                                                </Text>
                                            </Text>
                                        </ShouldRender>

                                        <Text>
                                            Preço Total:{' '}
                                            <Text style={{ fontWeight: 'bold' }}>
                                                R${' '}
                                                {Number(
                                                    Number(
                                                        Number(props.price) *
                                                            Number(props.volume?.replace(',', '.'))
                                                    ) + Number(props.pumpFee)
                                                )
                                                    .toFixed(2)
                                                    .replace('.', ',')
                                                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
                                            </Text>
                                        </Text>
                                        <Text>
                                            Pagamento:{' '}
                                            <Text
                                                style={{
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {props.paymentMethod === 'deposito'
                                                    ? 'Depósito / Pix'
                                                    : ''}
                                                {props.paymentMethod === 'boleto' ? 'Boleto' : ''}
                                                {props.paymentMethod === 'cheque' ? 'Cheque' : ''}
                                            </Text>
                                        </Text>
                                        <ShouldRender if={props.paymentMethod === 'boleto'}>
                                            <Text>
                                                Prazo:{' '}
                                                <Text style={{ fontWeight: 'bold' }}>
                                                    {props.paymentPrize === 'avista'
                                                        ? 'À vista'
                                                        : ''}
                                                    {props.paymentPrize === '7dias' ? '7 dias' : ''}
                                                    {props.paymentPrize === '15dias'
                                                        ? '15 dias'
                                                        : ''}
                                                    {props.paymentPrize === '30dias'
                                                        ? '30 dias'
                                                        : ''}
                                                </Text>
                                            </Text>
                                        </ShouldRender>
                                    </View>
                                </View>
                            </ShouldRender>
                        </View>
                    </Card.Content>
                </TouchableOpacity>
                <ShouldRender if={actionsVisibility}>
                    <Card.Actions
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            paddingVertical: '0%'
                        }}
                    >
                        <Button icon="pencil" labelStyle={{ fontSize: 12 }} onPress={editOrder}>
                            Editar
                        </Button>
                        <Button
                            labelStyle={{ fontSize: 12 }}
                            onPress={checkIsDone}
                            icon={CheckisDoneIcon}
                        >
                            {props.orderStatus == 'done'
                                ? 'Marcar Pendente'
                                : props.orderStatus == 'pending'
                                ? 'Entregue'
                                : props.orderStatus == 'cancel'
                                ? 'Restaurar Pedido'
                                : 'Concluir Pedido'}
                        </Button>
                        <ShouldRender if={props.orderStatus == 'pending'}>
                            <Button labelStyle={{ fontSize: 12 }} onPress={cancelOrder}>
                                <FontAwesome name="trash" /> Cancelar
                            </Button>
                        </ShouldRender>
                        <ShouldRender if={props.orderStatus == 'cancel'}>
                            <Button labelStyle={{ fontSize: 12 }} onPress={deleteOrder}>
                                <FontAwesome name="trash" /> Apagar
                            </Button>
                        </ShouldRender>
                    </Card.Actions>
                </ShouldRender>
            </Card>
        </>
    )
}
