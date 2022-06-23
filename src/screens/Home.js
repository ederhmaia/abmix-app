import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import { Button, useTheme, List } from 'react-native-paper'
// services
import firebase from '../services/firebase-config'
// components
import OrderCard from './orders/components/OrderCard'
import ShouldRender from './components/ShouldRender'
import monthMap from './components/MonthMapping'
// ext imports
import DateTimePicker from '@react-native-community/datetimepicker'
import DefaultLoader from './components/Loader/DefaultLoader'
// import AnimatedLoader from 'react-native-animated-loader'

export default function Home({ navigation }) {
  // loader
  const [visible, setVisible] = useState(true)

  const [currentFilter, setCurrent] = useState(0)
  const filterList = ['Pendente', 'Entregue', 'Cancelado']

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true)
          }}
          style={{ marginRight: 15 }}
        >
          <Button icon="filter">Filtrar</Button>
        </TouchableOpacity>
      )
    })
  }, [currentFilter, orders, filterDate])

  //datetimepicker
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)

  const [allOrders, setAllOrders] = useState(false)

  const styles = StyleSheet.create({
    lottie: {
      width: 100,
      height: 100
    }
  })

  ///orderStatus
  const [StatusListing, setStatusListing] = useState('pending')
  const [modalVisible, setModalVisible] = useState(false)

  ///date
  const initialFilter = {
    day: undefined,
    month: undefined,
    year: undefined
  }
  const [filterDate, setFilter] = useState(initialFilter)

  const clearFilter = () => {
    setFilter(initialFilter)
    setStatusListing('pending')
    setCurrent(0)
  }

  //dateTimePicker Params
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
    setFilter({
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    })
  }

  //Visible DateTimePicker
  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    setModalVisible(!modalVisible)
    showMode('date')
  }

  const [orders, setOrders] = useState([])
  const [clients, setClients] = useState([])

  const ordersDateArr = []

  orders.map((order) => {
    const date = order.date.toDate()
    const formated = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    ordersDateArr.push(formated)
  })

  const reducedOrdersDate = [...new Set(ordersDateArr)]

  const renderOrder = (order) => {
    const client = clients.find((client) => client?.id === order?.clientId)
    const time = new Date(order.date.toDate())
    const formatedDate = `${time.getDate()} de ${
      monthMap[time.getMonth() + 1]
    } de ${time.getFullYear()}`
    const formatedTime = `${time.getHours().toString().padStart(2, '0')}:${time
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
    return (
      <OrderCard
        key={order.id}
        order={order.id}
        clientId={client?.id}
        clientNome={client?.nome}
        orderDate={formatedDate}
        orderTime={formatedTime}
        clientAddr={order.address}
        productType={order.product}
        isPumped={order.pumped}
        volume={order.volume}
        price={order.price}
        timeStamp={order.date}
        resistance={order.resistance}
        orderStatus={order.status}
        pumpAddr={order.pumpAddr}
        pumpFee={order.pumpFee}
        orderContact={order.contact}
        paymentMethod={order.paymentMethod}
        provider={order.provider}
        paymentPrize={order.paymentPrize}
        listingMode={filterDate.day === undefined ? 'homescreen' : 'filtering'}
      ></OrderCard>
    )
  }
  useEffect(() => {
    const unsubscribe = firebase.db
      .collection('orders')
      .orderBy('date')
      .onSnapshot((querySnapshot) => {
        const openOrders = []
        querySnapshot.docs.forEach((doc) => {
          openOrders.push({
            id: doc.id,
            ...doc.data()
          })
        })
        setOrders(openOrders)
        setVisible(false)
      })

    firebase.db.collection('clients').onSnapshot((querySnapshot) => {
      const clientsArr = []
      querySnapshot.docs.forEach((doc) => {
        const { cell, nome } = doc.data()
        clientsArr.push({
          id: doc.id,
          nome,
          cell
        })
      })
      setClients(clientsArr)
    })
  }, [StatusListing, filterDate, currentFilter])

  return (
    <ScrollView style={{ backgroundColor: '#f2f2f2' }}>
      <View
        style={{
          marginTop: '1%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* <AnimatedLoader
               visible={visible}
               overlayColor="rgba(255,255,255,0.75)"
               animationStyle={styles.lottie}
               speed={1}
               source={require('../../assets/loader.json')}
            ></AnimatedLoader> */}

        <DefaultLoader visible={visible}></DefaultLoader>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            display="default"
            onChange={onChange}
          />
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255, 255, 255, .6)',
              height: '100%'
            }}
            activeOpacity={1}
            delayPressIn={1}
            onPress={() => {
              setModalVisible(!modalVisible)
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 1)',
                marginTop: '4%',
                marginLeft: '25%',
                alignSelf: 'center',
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                overflow: 'hidden',
                borderColor: useTheme().colors.primary,
                borderWidth: 0.7
              }}
            >
              <ShouldRender if={allOrders === false}>
                <Button
                  onPress={showDatepicker}
                  style={{ alignSelf: 'flex-start' }}
                  icon="calendar"
                >
                  <Text style={{ fontSize: 16, marginLeft: 12 }}>
                    {filterDate.day == undefined
                      ? 'Filtrar por data'
                      : `Filtrando: ${date.getDate().toString().padStart(2, '0')}/${(
                          date.getMonth() + 1
                        )
                          .toString()
                          .padStart(2, '0')}`}
                  </Text>
                </Button>

                <Button
                  icon="filter-variant"
                  mode="text"
                  onPress={() => {
                    if (currentFilter >= 2) {
                      setCurrent(0)
                    } else {
                      setCurrent(currentFilter + 1)
                    }
                    if (currentFilter == 0) {
                      setStatusListing('done')
                    } else if (currentFilter == 1) {
                      setStatusListing('cancel')
                    } else if (currentFilter == 2) {
                      setStatusListing('pending')
                    }
                  }}
                  style={{
                    marginVertical: 1,
                    alignSelf: 'flex-start'
                  }}
                >
                  <Text style={{ fontSize: 16 }}>Filtrando: {filterList[currentFilter]}</Text>
                </Button>
                <Button
                  mode="text"
                  icon="clipboard-outline"
                  onPress={() => {
                    clearFilter()
                    setAllOrders(true)
                    setModalVisible(!modalVisible)
                  }}
                  style={{
                    marginVertical: 1,
                    alignSelf: 'flex-start'
                  }}
                >
                  <Text style={{ fontSize: 16 }}>Todos os Pedidos</Text>
                </Button>
              </ShouldRender>

              <Button
                mode="text"
                icon="cancel"
                onPress={() => {
                  clearFilter()
                  setAllOrders(false)
                  setModalVisible(!modalVisible)
                }}
                style={{
                  marginVertical: 1,
                  alignSelf: 'flex-start'
                }}
              >
                <Text style={{ fontSize: 16 }}>Limpar Filtros</Text>
              </Button>
            </View>
          </TouchableOpacity>
        </Modal>

        <List.Section
          style={{
            width: '100%'
          }}
        >
          <ShouldRender if={filterDate.day == undefined && allOrders == false}>
            {orders.map((order) => {
              const date = new Date(order.date.toDate())

              // remove hours, minutes, seconds and milliseconds from date
              const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate())

              const todayDate = new Date()
              // remove hours, minutes, seconds and milliseconds from todayDate
              const todayDateWithoutTime = new Date(
                todayDate.getFullYear(),
                todayDate.getMonth(),
                todayDate.getDate()
              )
              if (order.status == StatusListing) {
                if (dateWithoutTime >= todayDateWithoutTime) {
                  return renderOrder(order)
                }
              }
            })}
          </ShouldRender>
          <ShouldRender if={filterDate.day == undefined && allOrders == true}>
            {reducedOrdersDate.map((dateFromList) => {
              const formatedFromList = dateFromList.split('-')
              return (
                <List.Accordion
                  key={dateFromList}
                  title={`${formatedFromList[0]} de ${monthMap[formatedFromList[1]]} de ${
                    formatedFromList[2]
                  }`}
                  left={(props) => <List.Icon {...props} icon="truck-check" />}
                  description={`Pedidos: ${
                    orders.filter(
                      (order) =>
                        `${new Date(order.date.toDate()).getDate()}-${
                          new Date(order.date.toDate()).getMonth() + 1
                        }-${new Date(order.date.toDate()).getFullYear()}` == dateFromList
                    ).length
                  }`}
                >
                  {orders.map((order) => {
                    const date = new Date(order.date.toDate())
                    const day = date.getDate()
                    const month = date.getMonth()
                    const year = date.getFullYear()
                    if (
                      day == formatedFromList[0] &&
                      month == formatedFromList[1] - 1 &&
                      year == formatedFromList[2]
                    ) {
                      return renderOrder(order)
                    }
                  })}
                </List.Accordion>
              )
            })}
          </ShouldRender>
          <ShouldRender if={filterDate.day != undefined}>
            <View style={{ marginTop: 5 }}>
              {orders.map((order) => {
                if (order.status == StatusListing && filterDate.day == undefined) {
                  // const ts = order.date.toDate()
                  // const todayDate = new Date()
                  // if (
                  //   ts.getMonth() == todayDate.getMonth() &&
                  //   ts.getDate() == todayDate.getDate() &&
                  //   ts.getFullYear() == todayDate.getFullYear()
                  // ) {
                  return renderOrder(order)
                }

                if (order.status == StatusListing && filterDate.day != undefined) {
                  const ts = order.date.toDate()
                  if (
                    ts.getMonth() == filterDate.month &&
                    ts.getDate() == filterDate.day &&
                    ts.getFullYear() == filterDate.year
                  ) {
                    return renderOrder(order)
                  }
                }
              })}
            </View>
          </ShouldRender>
        </List.Section>
      </View>
    </ScrollView>
  )
}
