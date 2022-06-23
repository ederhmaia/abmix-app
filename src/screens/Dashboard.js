import * as React from 'react'
import { useState, useEffect } from 'react'
import { ScrollView, View, Text, Dimensions } from 'react-native'
import firebase from '../../services/firebase-config'
import { List, Button } from 'react-native-paper'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from 'react-native-chart-kit'
import { Picker } from '@react-native-picker/picker'

const screenWidth = Dimensions.get('window').width

export default function Dashboard(props) {
    const [clients, setClients] = useState([])
    const [orders, setOrders] = useState([])

    const [expanded, setExpanded] = React.useState(true)
    const handlePress = () => setExpanded(!expanded)

    const [selectedLanguage, setSelectedLanguage] = useState()

    useEffect(() => {
        firebase.db
            .collection('orders')
            .orderBy('date')
            .onSnapshot((querySnapshot) => {
                const allOrders = []
                querySnapshot.docs.forEach((doc) => {
                    allOrders.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                setOrders(allOrders)
            })

        firebase.db
            .collection('clients')
            .orderBy('nome')
            .onSnapshot((querySnapshot) => {
                const clientsArr = []
                querySnapshot.docs.forEach((doc) => {
                    clientsArr.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                setClients(clientsArr)
            })
    }, [])

    const averagePrice = () => {
        let total = 0
        orders.forEach((order) => {
            total += order.price
        })
        return total / orders.length
    }

    const countOrders = () => {
        let done = 0
        let open = 0
        orders.forEach((order) => {
            if (order.isDone == true) {
                done++
            } else {
                open++
            }
        })
        return { done, open }
    }

    const averageVolume = () => {
        let total = 0
        orders.forEach((order) => {
            total += Number(order.volume)
        })
        return total / orders.length
    }

    const averageVolumePending = () => {
        let total = 0
        orders.forEach((order) => {
            if (order.isDone == false) {
                total += Number(order.volume)
            }
        })
        return total / countOrders().open
    }

    const totalVolumePending = () => {
        let total = 0
        orders.forEach((order) => {
            if (order.isDone == false) {
                total += Number(order.volume)
            }
        })
        return total
    }

    const averageVolumeDone = () => {
        let total = 0
        orders.forEach((order) => {
            if (order.isDone == true) {
                total += Number(order.volume)
            }
        })
        return total / countOrders().open
    }

    const totalVolumeDone = () => {
        let total = 0
        orders.forEach((order) => {
            if (order.isDone == true) {
                total += Number(order.volume)
            }
        })
        return total
    }

    //count how many orders was created in the last month
    const countOrdersLastMonth = () => {
        let count = 0
        orders.forEach((order) => {
            if (
                order.date.toDate().getMonth() == new Date().getMonth() &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                count++
            }
        })
        return count
    }

    //count how many orders was created in the past month
    const countOrdersPastMonth = () => {
        let count = 0
        orders.forEach((order) => {
            if (
                order.date.toDate().getMonth() == new Date().getMonth() - 1 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                count++
            }
        })
        return count
    }

    //count how many orders was created in the next month
    const countOrdersNextMonth = () => {
        let count = 0
        orders.forEach((order) => {
            if (
                order.date.toDate().getMonth() == new Date().getMonth() + 1 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                count++
            }
        })
        return count
    }

    //count how many products "argamassa" status isDone
    const countProducts = () => {
        let argamassa = { done: 0, pending: 0 }
        let concreto = { done: 0, pending: 0 }
        orders.forEach((order) => {
            if (order.product == 'argamassa' && order.isDone == true) {
                argamassa.done++
            } else if (order.product == 'argamassa' && order.isDone == false) {
                argamassa.pending++
            }
            argamassa.total = argamassa.done + argamassa.pending
            if (order.product == 'concreto' && order.isDone == true) {
                concreto.done++
            } else if (order.product == 'concreto' && order.isDone == false) {
                concreto.pending++
            }
            concreto.total = concreto.done + concreto.pending
        })
        return { argamassa, concreto }
    }

    //count how many clients cpf length is more than 11
    const countClientsCpf = () => {
        let pj = 0
        let pf = 0
        clients.forEach((client) => {
            if (client.cpf.length > 11) {
                pj++
            } else {
                pf++
            }
        })
        return { pj, pf }
    }

    //count how many orders was created in every month of the year
    const countOrdersByMonth = () => {
        let jan = 0
        let fev = 0
        let mar = 0
        let abr = 0
        let mai = 0
        let jun = 0
        let jul = 0
        let ago = 0
        let set = 0
        let out = 0
        let nov = 0
        let dez = 0

        orders.forEach((order) => {
            if (
                order.date.toDate().getMonth() == 0 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                jan++
            } else if (
                order.date.toDate().getMonth() == 1 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                fev++
            } else if (
                order.date.toDate().getMonth() == 2 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                mar++
            } else if (
                order.date.toDate().getMonth() == 3 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                abr++
            } else if (
                order.date.toDate().getMonth() == 4 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                mai++
            } else if (
                order.date.toDate().getMonth() == 5 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                jun++
            } else if (
                order.date.toDate().getMonth() == 6 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                jul++
            } else if (
                order.date.toDate().getMonth() == 7 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                ago++
            } else if (
                order.date.toDate().getMonth() == 8 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                set++
            } else if (
                order.date.toDate().getMonth() == 9 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                out++
            } else if (
                order.date.toDate().getMonth() == 10 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                nov++
            } else if (
                order.date.toDate().getMonth() == 11 &&
                order.date.toDate().getFullYear() == new Date().getFullYear()
            ) {
                dez++
            }
        })
        return [jan, fev, mar, abr, mai, jun, jul, ago, set, out, nov, dez]
    }

    const data = {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        datasets: [
            {
                data: countOrdersByMonth(),
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // optional
                strokeWidth: 1
            }
        ]
    }

    const chartConfig = {
        backgroundGradientFrom: '#333C83',
        backgroundGradientFromOpacity: 1,
        decimalPlaces: 0,
        backgroundGradientTo: '#F24A72',
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 1, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: true,
        propsForDots: {
            r: '2'
        }
    }

    return (
        <ScrollView style={{ backgroundColor: '#f2f2f2' }}>
            <View style={{}}>
                <View style={{ marginHorizontal: '5%', marginTop: 15 }}>
                    {/* <Button style={{ marginTop: 3 }} mode="contained">
            Adicionar Produtos
          </Button> */}
                </View>
                <List.Section title="Informações Gerais">
                    <List.Accordion
                        title={`Pedidos Totais: ${orders.length}`}
                        left={(props) => <List.Icon {...props} icon="truck-check" />}
                        description={`Pendentes: ${countOrders().open}\nEntregues: ${
                            countOrders().done
                        }`}
                    >
                        <List.Item
                            left={(props) => <List.Icon {...props} icon="alpha-a-box" />}
                            title={`Argamassa: ${countProducts().argamassa.total}`}
                            description={`Pendentes: ${
                                countProducts().argamassa.pending
                            }\nEntregues: ${countProducts().argamassa.done}`}
                        />
                        <List.Item
                            title={`Concreto: ${countProducts().concreto.total}`}
                            left={(props) => <List.Icon {...props} icon="alpha-c-box" />}
                            description={`Pendentes: ${
                                countProducts().concreto.pending
                            }\nEntregues: ${countProducts().concreto.done}`}
                        />
                    </List.Accordion>

                    <List.Accordion
                        title={`Clientes Totais: ${clients.length}`}
                        description={``}
                        left={(props) => <List.Icon {...props} icon="account-details" />}
                    >
                        <List.Item
                            title={`Físicos: ${countClientsCpf().pf}`}
                            left={(props) => <List.Icon {...props} icon="account-tie" />}
                        />
                        <List.Item
                            title={`Juridicos: ${countClientsCpf().pj}`}
                            description=""
                            left={(props) => <List.Icon {...props} icon="office-building" />}
                        />
                    </List.Accordion>
                </List.Section>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    {/* <Text>Pedidos em Aberto: {countOrders().open}</Text>
    <Text>Pedidos em Concluídos: {countOrders().done}</Text>
    <Text>Média de Preço por Pedido: R$ {averagePrice()}</Text>
    <Text>Volume Médio de Pedido (Todos): {averageVolume()}m³</Text>
    <Text>Volume Total de Pedidos Abertos: {totalVolumePending()}</Text>
    <Text>Volume Médio de Pedidos Abertos: {averageVolumePending()}</Text>
    <Text>Volume Total de Pedidos Entregues: {totalVolumeDone()}</Text>
    <Text>Volume Médio de Pedidos Entregues: {averageVolumeDone()}</Text>
    <Text>Pedidos mês anterior: {countOrdersPastMonth()}</Text>
    <Text>Pedidos deste mês: {countOrdersLastMonth()}</Text>
    <Text>Pedidos próximo mês: {countOrdersNextMonth()}</Text> 
    <Text>Argamassa: {countProducts().argamassa}</Text>
    <Text>Concreto: {countProducts().concreto}</Text> */}
                </View>
            </View>
        </ScrollView>
    )
}
