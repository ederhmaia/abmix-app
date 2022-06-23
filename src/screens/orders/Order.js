import React, { useState, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Button, TextInput, Text, useTheme, Card } from 'react-native-paper'

// services
import firebase from '../../services/firebase-config'
// local components
import ShouldRender from '../components/ShouldRender'
import DefaultLoader from './../components/Loader/DefaultLoader'
// 3rd party libraries
import DateTimePicker from '@react-native-community/datetimepicker'
import DropDownPicker from 'react-native-dropdown-picker'
import { Entypo } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import { TextInputMask } from 'react-native-masked-text'

export default function Orders({ route, navigation }) {
  const initalState = {
    orderAddress: '',
    orderContact: '',
    orderDeliverPrize: '',
    orderResistance: '',
    orderVolume: '',
    price: '',
    status: 'pending',
    pumpFee: '',
    paymentMethod: 'deposito',
    paymentPrize: 'avista',
    orderProvider: ''
  }
  const [visible, setVisible] = useState(false)
  const [selectedValue, setSelectedValue] = useState('')
  const [state, setState] = useState(initalState)
  const [product, setProduct] = useState('argamassa')
  const [pumped, setPumped] = useState(false)
  const [pumpID, setPumpID] = useState(1)

  const [open, setOpen] = useState(false)

  const [items, setItems] = useState([])
  //
  useEffect(() => {
    const unsubscribe = firebase.db
      .collection('clients')
      .orderBy('nome')
      .onSnapshot((querySnapshot) => {
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
              },
              labelStyle: {
                paddingLeft: 10
              }
            }
          })
        )
        return () => {
          unsubscribe()
        }
      })
  }, [])

  const handleChangeText = (value, name) => {
    setState({ ...state, [name]: value })
  }
  const orderSubmit = async () => {
    if (
      state.orderAddress &&
      state.orderContact &&
      state.orderVolume &&
      state.price &&
      state.orderProvider
    ) {
      setVisible(true)
      await firebase.db
        .collection('orders')
        .add({
          clientId: selectedValue,
          contact: state.orderContact,
          product: product,
          pumped: pumped,
          pumpAddr: pumpID,
          pumpFee: state.pumpFee,
          address: state.orderAddress,
          resistance: state.orderResistance,
          volume: state.orderVolume,
          price: state.price,
          date: date,
          status: state.status,
          paymentMethod: state.paymentMethod,
          paymentPrize: state.paymentPrize,
          createdAd: firebase.ServerTimeStamp,
          provider: state.orderProvider
        })
        .then(() => {
          setSelectedValue('')
          setProduct('argamassa')
          setState(initalState)
          setVisible(false)
          navigation.dispatch()
          navigation.navigate('Início')
        })
    } else {
      Alert.alert(
        'Necessário.',
        `Preencha ao menos os campos: Vendedor, Endereço, Contato, Volume e Preço.`,
        [
          {
            text: 'OK',
            style: 'default'
          }
        ]
      )
    }
  }
  const Amount = Number(Number(state.price) * Number(state.orderVolume)).toFixed(2)

  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)

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
    <ScrollView style={{ backgroundColor: '#f2f2f2' }}>
      <DefaultLoader visible={visible} />

      <View
        style={{
          alignContent: 'center',
          alignItems: 'center',
          marginBottom: 20
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
              Icon
              selectedValue={product}
              onValueChange={(itemValue) => {
                setProduct(itemValue)
              }}
            >
              <Picker.Item label="Argamassa" value="argamassa" />
              <Picker.Item label="Concreto" value="concreto" />
            </Picker>
            <ShouldRender if={product === 'concreto'}>
              <View style={{}}>
                <Picker
                  selectedValue={pumped}
                  onValueChange={(itemValue) => {
                    setPumped(itemValue)
                  }}
                >
                  <Picker.Item label="Convencional" value={false} />
                  <Picker.Item label="Bombeado" value={true} />
                </Picker>
              </View>
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
                  paddingVertical: 2,
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
                  paddingVertical: 2,
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

            <View
              style={{
                justifyContent: 'center'
              }}
            >
              <Card style={{ paddingVertical: 5, marginHorizontal: '10%' }}>
                <Text style={{ fontSize: 16, alignSelf: 'center' }}>
                  <Text style={{ marginRight: 10 }}>
                    <Entypo name="calendar" size={16} color={useTheme().colors.primary} />{' '}
                    {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                  </Text>
                  <Text style={{ marginHorizontal: 10 }}>{'       '}</Text>
                  <Text>
                    <Entypo
                      style={{ marginHorizontal: 10 }}
                      name="clock"
                      size={16}
                      color={useTheme().colors.primary}
                    />{' '}
                    {date.getHours().toString().padStart(2, '0')}:
                    {date.getMinutes().toString().padStart(2, '0')}
                  </Text>
                </Text>
              </Card>
              <View>
                <TextInput
                  style={{
                    marginTop: 10,
                    height: 60
                  }}
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
                    marginTop: 3,
                    height: 60
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
                    marginTop: 3,
                    height: 60
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
                    marginTop: 3,
                    height: 60
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
                    marginTop: 3,
                    height: 60
                  }}
                  mode="outlined"
                  label="Volume"
                  value={state.orderVolume}
                  placeholder="M³"
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    handleChangeText(text?.replace(',', '.'), 'orderVolume')
                  }}
                />
                <TextInput
                  style={{
                    marginTop: 3,
                    height: 60
                  }}
                  keyboardType="numeric"
                  mode="outlined"
                  label="Preço/M³"
                  value={state.price}
                  onChangeText={(value) => {
                    handleChangeText(
                      value.replace('R$', '')?.replace('.', '')?.replace(',', '.').trim(),
                      'price'
                    )
                  }}
                  placeholder="R$ 25,00"
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
                <ShouldRender if={pumped && product === 'concreto'}>
                  <TextInput
                    style={{
                      marginTop: 4,
                      height: 60
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
              </View>
              <ShouldRender if={!!state.price && !!state.orderVolume}>
                <Card style={{ marginTop: 10, paddingVertical: 10 }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 16
                    }}
                  >
                    Valor Total:{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      R$ {Number(Amount) + Number(state.pumpFee)}
                    </Text>
                  </Text>
                </Card>
              </ShouldRender>
              <TouchableOpacity onPress={orderSubmit}>
                <Button
                  style={{
                    marginTop: 10,
                    paddingVertical: 10,
                    justifyContent: 'center'
                  }}
                  mode="contained"
                >
                  Cadastrar
                </Button>
              </TouchableOpacity>
            </View>
          </ShouldRender>
        </View>
      </View>
    </ScrollView>
  )
}
