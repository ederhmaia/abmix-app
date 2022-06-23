import * as React from 'react'
import { useState, useEffect } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Button, TextInput, Text, Card, useTheme } from 'react-native-paper'
// navigation
import { useFocusEffect } from '@react-navigation/native'
// services
import firebase from '../../services/firebase-config'
// components
import monthMap from './../components/MonthMapping'
import ShouldRender from '../components/ShouldRender'
// 3rds
import DateTimePicker from '@react-native-community/datetimepicker'
import DropDownPicker from 'react-native-dropdown-picker'
import { TextInputMask } from 'react-native-masked-text'
import { Picker } from '@react-native-picker/picker'
import DefaultLoader from '../components/Loader/DefaultLoader'

export default function Edit({ route, navigation }) {
  const initalState = {
    orderAddress: '',
    orderDeliverPrize: '',
    orderResistance: '',
    orderVolume: '',
    price: '',
    orderStatus: '',
    orderContact: '',
    pumpFee: '',
    paymentMethod: '',
    paymentPrize: '',
    provider: ''
    //   selectedValue,
    //   product,
    //   volumeRef,
    //   pumpRef,
    //   oldDate,
  }

  const [state, setState] = useState(initalState)

  const [selectedValue, setSelectedValue] = useState('') //pass to state
  const [product, setProduct] = useState('argamassa') //pass to state
  const [pumped, setPumped] = useState(true) //pass to state
  const [priceRef, setPriceRef] = useState() //pass to state
  const [volumeRef, setVolumeRef] = useState() //pass to state
  const [pumpRef, setPumpRef] = useState() //pass to state
  const [oldDate, setOldDate] = useState(new Date()) //pass to state

  //    loader
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const unsubscribe = firebase.db.collection('clients').onSnapshot((querySnapshot) => {
      const clientsArr = []
      querySnapshot.docs.forEach((doc) => {
        const { cell, cpf, email, nome } = doc.data()
        clientsArr.push({
          id: doc.id,
          nome,
          email,
          cell,
          cpf
        })
      })
      setItems(
        clientsArr.map((client) => {
          return {
            label: client.nome,
            value: client.id,
            containerStyle: {
              backgroundColor: 'rgb(246, 248, 250)',
              marginVertical: 5
            }
          }
        })
      )
      unsubscribe()
    })
  }, [])
  useFocusEffect(
    React.useCallback(() => {
      if (!!route.params.docToEdit) {
        const fetchData = firebase.db
          .collection('orders')
          .doc(route.params.docToEdit)
          .get()
          .then((snapshot) => {
            const data = snapshot.data()
            setSelectedValue(data.clientId)
            setProduct(data.product)
            setPumped(data.pumped)
            setState({
              orderAddress: data.address,
              orderDeliverPrize: data.date.seconds,
              orderResistance: data.resistance,
              orderVolume: data.volume,
              orderStatus: data.status,
              price: data.price,
              orderContact: data.contact,
              pumpFee: data.pumpFee,
              paymentMethod: data.paymentMethod,
              paymentPrize: data.paymentPrize,
              orderProvider: data.provider
            })
            setPumpID(data.pumpAddr)
            setPriceRef(data.price)
            setVolumeRef(data.volume)
            setPumpRef(data.pumpFee)
            setOldDate(data.date.toDate())
            setDate(data.date.toDate())
            setVisible(false)
          })
          .catch((e) => console.log(e))
        return () => fetchData
      }
    }, [])
  )
  const handleChangeText = (value, name) => {
    setState({ ...state, [name]: value })
  }

  const orderEdit = async () => {
    setVisible(true)
    await db
      .collection('orders')
      .doc(route.params.docToEdit)
      .update({
        clientId: selectedValue,
        product: product,
        pumped: pumped,
        address: state.orderAddress,
        resistance: state.orderResistance,
        volume: state.orderVolume,
        price: state.price,
        date: date,
        status: state.orderStatus,
        pumpAddr: pumpID,
        contact: state.orderContact,
        pumpFee: state.pumpFee,
        paymentMethod: state.paymentMethod,
        paymentPrize: state.paymentPrize,
        provider: state.orderProvider
      })
      .then(() => {
        setSelectedValue('')
        setProduct('argamassa')
        setState(initalState)
        setVisible(false)
        navigation.navigate('Início', { screen: 'Home' })
      })
  }

  const totalAmount = Number(
    Number(Number(Number(state.price) * Number(state.orderVolume?.replace(',', '.'))).toFixed(2)) +
      Number(state.pumpFee)
  )
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)

  const [pumpID, setPumpID] = useState(1)

  const [open, setOpen] = useState(false)

  const [items, setItems] = useState([])

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === '')
    setDate(currentDate)
  }

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode('date')
  }

  const showTimepicker = () => {
    showMode('time')
  }

  return (
    <ScrollView>
      <DefaultLoader visible={visible} />
      <View
        style={{
          alignContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            marginTop: '5%',
            width: '85%'
          }}
        >
          <DropDownPicker
            showArrowIcon={false}
            style={{
              borderRadius: 5,
              borderWidth: 0,
              backgroundColor: 'rgba(0,0,0,0)'
            }}
            textStyle={{
              fontSize: 16
            }}
            modalProps={{
              animationType: 'slide'
            }}
            modalContentContainerStyle={{
              backgroundColor: 'rgb(246, 248, 250)',
              borderWidth: 0
            }}
            searchTextInputStyle={{
              borderRadius: 0,
              borderWidth: 0
            }}
            searchContainerStyle={{
              backgroundColor: 'rgb(246, 248, 250)',
              borderWidth: 0
            }}
            listMode="MODAL"
            placeholder="Selecione um cliente"
            searchable={true}
            searchPlaceholder="Procure por um nome..."
            open={open}
            value={selectedValue}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedValue}
            setItems={setItems}
          />
          <ShouldRender if={selectedValue != ''}>
            <Picker
              selectedValue={product}
              onValueChange={(itemValue) => {
                setProduct(itemValue)
              }}
            >
              <Picker.Item label="Argamassa" value="argamassa" />
              <Picker.Item label="Concreto" value="concreto" />
            </Picker>
            <ShouldRender if={product === 'concreto'}>
              <Picker
                selectedValue={pumped}
                onValueChange={(itemValue) => {
                  setPumped(itemValue)
                }}
              >
                <Picker.Item label="Bombeado" value={true} />
                <Picker.Item label="Não Bombeado" value={false} />
              </Picker>

              <ShouldRender if={!!pumped}>
                <Picker
                  selectedValue={pumpID}
                  onValueChange={(itemValue) => {
                    setPumpID(itemValue)
                  }}
                >
                  <Picker.Item label="Bomba P1000" value={1} />
                  <Picker.Item label="Bomba P500" value={2} />
                </Picker>
              </ShouldRender>
            </ShouldRender>

            <View
              style={{
                paddingVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 0,
                flexDirection: 'row'
              }}
            >
              <Button
                onPress={showDatepicker}
                icon="calendar"
                mode="contained"
                style={{
                  width: '40%',
                  paddingVertical: 5,
                  margin: 2
                }}
              >
                Data
              </Button>
              <Button
                onPress={showTimepicker}
                icon="clock"
                mode="contained"
                style={{
                  width: '40%',
                  paddingVertical: 5,
                  margin: 2,
                  zIndex: 1
                }}
              >
                Hora
              </Button>

              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  is24Hour={true}
                  display="default"
                  mode={mode}
                  onChange={onChange}
                />
              )}
            </View>
            <View style={{ marginVertical: 5 }}>
              <Card style={{ paddingVertical: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '30%' }}>
                    <Text
                      style={{
                        fontSize: 16,
                        alignSelf: 'center'
                      }}
                    >
                      Antigo
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        alignSelf: 'center'
                      }}
                    >
                      Novo
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        alignSelf: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {oldDate.getDate()} de {monthMap[oldDate.getMonth() + 1]} de{' '}
                      {oldDate.getFullYear()}, às {oldDate.getHours().toString().padStart(2, '0')}:
                      {oldDate.getMinutes().toString().padStart(2, '0')}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        alignSelf: 'center',
                        fontWeight: 'bold',
                        color: useTheme().colors.primary
                      }}
                    >
                      {date.getDate()} de {monthMap[date.getMonth() + 1]} de {date.getFullYear()},
                      às {date.getHours().toString().padStart(2, '0')}:
                      {date.getMinutes().toString().padStart(2, '0')}
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
            <View
              style={{
                justifyContent: 'center',
                marginTop: 20
              }}
            >
              <TextInput
                style={{}}
                value={state.orderProvider}
                label="Vendedor"
                mode="outlined"
                placeholder="João da Silva"
                onChangeText={(text) => {
                  handleChangeText(text, 'orderProvider')
                }}
              />

              <TextInput
                style={{
                  marginTop: 4
                }}
                value={state.orderAddress}
                label="Endereço"
                mode="outlined"
                placeholder="Av. Castelo Branco, 58"
                onChangeText={(text) => {
                  handleChangeText(text, 'orderAddress')
                }}
              />

              <TextInput
                style={{
                  marginTop: 4
                }}
                value={state.orderContact}
                label="Contato do Responsável"
                mode="outlined"
                placeholder="Telefone, WhatsApp, E-mail"
                onChangeText={(text) => {
                  handleChangeText(text, 'orderContact')
                }}
              />
              <TextInput
                style={{
                  marginTop: 3
                }}
                mode="outlined"
                label="MPa"
                value={state.orderResistance}
                keyboardType="numeric"
                placeholder="25"
                onChangeText={(text) => {
                  handleChangeText(text, 'orderResistance')
                }}
              />
              <TextInput
                style={{
                  marginTop: 3
                }}
                mode="outlined"
                label="Volume"
                value={state.orderVolume}
                placeholder="M³"
                keyboardType="numeric"
                onChangeText={(text) => {
                  handleChangeText(text?.replace(',', '.'), 'orderVolume')
                  setVolumeHandle(text?.replace(',', '.'))
                }}
              />
              <TextInput
                style={{
                  marginTop: 3
                }}
                keyboardType="numeric"
                mode="outlined"
                label="Preço/M³"
                value={state.price}
                onChangeText={(value) => {
                  const refinedValue = value
                    .replace('R$', '')
                    .replace(/\s/g, '')
                    ?.replace(',', '.')
                    .trim()
                  handleChangeText(refinedValue, 'price')
                }}
                maxLength={13}
                placeholder="R$ 25,00"
                render={(props) => (
                  <TextInputMask
                    {...props}
                    type={'money'}
                    options={{
                      precision: 2,
                      separator: ',',
                      delimiter: ' ',
                      unit: 'R$ '
                    }}
                  />
                )}
              />

              <ShouldRender if={pumped && product === 'concreto'}>
                <TextInput
                  style={{
                    marginTop: 4
                  }}
                  keyboardType="numeric"
                  mode="outlined"
                  label="Taxa da Bomba"
                  value={state.pumpFee}
                  onChangeText={(value) => {
                    handleChangeText(
                      value.replace('R$', '')?.replace('.', '')?.replace(',', '.').trim(),
                      'pumpFee'
                    )
                  }}
                  placeholder="R$ 200,00"
                  render={(props) => (
                    <TextInputMask
                      {...props}
                      type={'money'}
                      options={{
                        precision: 2,
                        separator: ',',
                        delimiter: '.',
                        unit: 'R$ '
                      }}
                    />
                  )}
                />
              </ShouldRender>

              <Picker
                selectedValue={state.paymentMethod}
                onValueChange={(itemValue) => {
                  handleChangeText(itemValue, 'paymentMethod')
                }}
              >
                <Picker.Item label="Depósito/Pix" value="deposito" />
                <Picker.Item label="Cheque" value="cheque" />
                <Picker.Item label="Boleto" value="boleto" />
              </Picker>
              <ShouldRender if={state.paymentMethod === 'boleto'}>
                <Picker
                  selectedValue={state.paymentPrize}
                  onValueChange={(itemValue) => {
                    handleChangeText(itemValue, 'paymentPrize')
                  }}
                >
                  <Picker.Item label="À vista" value="avista" />
                  <Picker.Item label="7 dias" value="7dias" />
                  <Picker.Item label="15 dias" value="15dias" />
                  <Picker.Item label="30 dias" value="30dias" />
                </Picker>
              </ShouldRender>

              <View>
                <Card style={{ paddingVertical: 10, marginVertical: 15 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '60%' }}>
                      <Text
                        style={{
                          fontSize: 16,
                          alignSelf: 'center'
                        }}
                      >
                        Total Anterior
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          alignSelf: 'center'
                        }}
                      >
                        Total Novo
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          alignSelf: 'center',
                          fontWeight: 'bold'
                        }}
                      >
                        R${' '}
                        {Number(
                          Number(Number(priceRef) * Number(volumeRef?.replace(',', '.'))) +
                            Number(pumpRef)
                        )
                          .toFixed(2)
                          .replace('.', ',')
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          alignSelf: 'center',
                          fontWeight: 'bold',
                          color: useTheme().colors.primary
                        }}
                      >
                        R$ {totalAmount}
                      </Text>
                    </View>
                  </View>
                </Card>
              </View>
              <Button
                style={{
                  marginTop: 10,
                  alignContent: 'center',
                  justifyContent: 'center',
                  marginBottom: '25%',
                  paddingVertical: 10
                }}
                onPress={orderEdit}
                mode="contained"
              >
                Atualizar Pedido
              </Button>
            </View>
          </ShouldRender>
        </View>
      </View>
    </ScrollView>
  )
}
