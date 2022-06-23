import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { Button, TextInput, HelperText, RadioButton, Card, useTheme } from 'react-native-paper'

// services
import firebase from '../../services/firebase-config'

// components
import ShouldRender from '../components/ShouldRender'

// 3rd party
import { TextInputMask } from 'react-native-masked-text'
import { Picker } from '@react-native-picker/picker'
import DefaultLoader from './../components/Loader/DefaultLoader'

export default function AddClient({ navigation }) {
  // loader state
  const [visible, setVisible] = useState(false)

  const [checked, setChecked] = React.useState('cpf')
  const [selectedValue, setSelectedValue] = useState('null')
  const [clients, setClients] = useState([])
  const [err, setErr] = useState('')
  const [cellRef, setCellRef] = useState({ cellphone: '', name: '' })

  const initialState = {
    name: '',
    email: '',
    cpf: '',
    cnpj: '',
    cellphone: '',
    city: '',
    address: '',
    district: '',
    entityType: '',
    inscEstadual: ''
  }

  const [state, setState] = useState(initialState)

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
      setClients(clientsArr)
      return () => {
        unsubscribe()
      }
    })
  }, [])

  const handleChangeText = (value, name) => {
    setState({ ...state, [name]: value })
  }

  const resetForm = () => {
    setState(initialState)
    setErr('')
    setCellRef({ cellphone: '', name: '' })
    setSelectedValue('null')
  }

  const orderSubmit = async () => {
    setVisible(true)
    if (
      (!!state.name && !!state.cpf && state.cellphone) ||
      (!!state.name && !!state.cnpj && !!state.cellphone)
    ) {
      if (err === '') {
        await firebase.db
          .collection('clients')
          .add({
            nome: state.name,
            email: state.email,
            cpf: state.cpf,
            cell: state.cellphone,
            cnpj: state.cnpj,
            city: state.city,
            address: state.address,
            district: state.district,
            entityType: selectedValue,
            inscEstadual: state.inscEstadual
          })
          .then(() => {
            setVisible(false)
            navigation.navigate('Clientes', { screen: 'HomeClients' })
            Alert.alert(
              'Registrado.',
              `Cliente ${state.name.toUpperCase()} cadastrado com sucesso!`,
              [
                {
                  text: 'OK',
                  style: 'cancel'
                }
              ]
            )
            setState(initialState)
          })
      } else {
        setVisible(false)
        Alert.alert(
          'Duplicidade.',
          `Cliente ${err.toUpperCase()} já cadastrado com o mesmo CPF/CNPJ.`,
          [
            {
              text: 'OK'
            }
          ]
        )
      }
    } else {
      setVisible(false)
      Alert.alert(
        'Necessário.',
        'Por favor, preencha ao menos os campos Nome, CPF/CNPJ e Telefone.',
        [
          {
            text: 'OK'
          }
        ]
      )
    }
  }

  return (
    <ScrollView>
      <DefaultLoader visible={visible} />
      <View
        style={{
          marginTop: 15,
          alignContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            width: '85%'
          }}
        >
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: '2%'
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    setChecked('cpf')
                    resetForm()
                  }}
                >
                  <RadioButton
                    value="cpf"
                    status={checked === 'cpf' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked('cpf')
                      resetForm()
                    }}
                    color={useTheme().colors.primary}
                  />
                  <Text>Pessoa Física</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: '2%'
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    setChecked('cnpj')
                    resetForm()
                  }}
                >
                  <RadioButton
                    label="CNPJ"
                    value="cnpj"
                    status={checked === 'cnpj' ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked('cnpj')
                      resetForm()
                    }}
                    color={useTheme().colors.primary}
                  />
                  <Text>Pessoa Jurídica</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
          {/* //will render if the checked value is equal cpf */}
          <ShouldRender if={checked === 'cpf'}>
            <TextInput
              style={{
                marginTop: 5
              }}
              mode="outlined"
              label="Nome"
              value={state.name}
              placeholder="João dos Santos"
              onChangeText={(text) => handleChangeText(text, 'name')}
            />

            <TextInput
              style={{
                marginTop: 5
              }}
              keyboardType="numeric"
              mode="outlined"
              label="CPF"
              value={state.cpf}
              onChangeText={(value) => {
                if (value) {
                  handleChangeText(value?.replace(/\D/g, ''), 'cpf')
                }
                clients.forEach((client) => {
                  if (value?.replace(/\D/g, '') == client.cpf) {
                    setErr(client?.nome)
                  } else {
                    setErr('')
                  }
                })
              }}
              placeholder="000.000.000-00"
              render={(props) => <TextInputMask {...props} type={'cpf'} />}
            />
            <ShouldRender if={err != ''}>
              <HelperText
                style={{ fontSize: 14 }}
                type="error"
              >{`${err} já cadastrado.`}</HelperText>
            </ShouldRender>
            <TextInput
              style={{
                marginTop: 5
              }}
              mode="outlined"
              label="Cidade"
              onChangeText={(value) => {
                handleChangeText(value, 'city')
              }}
              placeholder="Abelardo Luz"
            />
            <TextInput
              style={{
                marginTop: 5
              }}
              mode="outlined"
              label="Bairro"
              onChangeText={(value) => {
                handleChangeText(value, 'district')
              }}
              placeholder="Centro"
            />
            <TextInput
              style={{
                marginTop: 5
              }}
              mode="outlined"
              label="Endereço"
              onChangeText={(value) => {
                handleChangeText(value, 'address')
              }}
              placeholder="Rua General Osório, nº 0"
            />
            <TextInput
              style={{
                marginTop: 5
              }}
              mode="outlined"
              label="Email"
              onChangeText={(value) => {
                handleChangeText(value, 'email')
              }}
              placeholder="joaosantos@email.com"
            />
            <TextInput
              style={{
                marginTop: 5
              }}
              keyboardType="numeric"
              mode="outlined"
              label="Telefone"
              onChangeText={(value) => {
                handleChangeText(value, 'cellphone')
                clients.forEach((client) => {
                  if (value == client.cell) {
                    setCellRef({ cellphone: client.cell, name: client.nome })
                  } else {
                    setCellRef({ cellphone: '', name: '' })
                  }
                })
              }}
              placeholder="(49) 999333333"
              render={(props) => (
                <TextInputMask
                  {...props}
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) '
                  }}
                />
              )}
            />
            <ShouldRender if={cellRef.cellphone != '' && cellRef.name != ''}>
              {console.log(cellRef.cellphone)}
              <HelperText
                style={{ fontSize: 14 }}
                type="error"
              >{`${cellRef.cellphone} já cadastrado em ${cellRef.name}.`}</HelperText>
            </ShouldRender>
          </ShouldRender>

          {/* //will render if the checked value is equal cnpj */}
          <ShouldRender if={checked === 'cnpj'}>
            <Picker
              selectedValue={selectedValue}
              style={{ height: 60 }}
              onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
              <Picker.Item label="Tipo de Entidade" value="null" />
              <Picker.Item label="Sociedade Cooperativa" value="sociedade" />
              <Picker.Item label="Órgãos/Autarquias/Fun. Federais" value="orgaos" />
              <Picker.Item label="Adm. Pública Federal" value="admpublica" />
              <Picker.Item label="PJ Direito Privado" value="pjprivado" />
              <Picker.Item label="Fabricante de Máquinas e Veículos" value="fabricante" />
              <Picker.Item label="Outros" value="others" />
            </Picker>
            <ShouldRender if={selectedValue !== 'null'}>
              <TextInput
                style={{
                  marginTop: 5
                }}
                mode="outlined"
                label="Nome / Razão Social"
                value={state.name}
                placeholder="ABMix Concreto"
                onChangeText={(text) => handleChangeText(text, 'name')}
              />
              <TextInput
                style={{
                  marginTop: 5
                }}
                keyboardType="numeric"
                mode="outlined"
                label="CNPJ"
                value={state.cnpj}
                onChangeText={(value) => {
                  if (value) {
                    handleChangeText(value?.replace(/\D/g, ''), 'cnpj')
                  }
                  clients.forEach((client) => {
                    if (value?.replace(/\D/g, '') == client.cnpj) {
                      setErr(client?.nome)
                    } else {
                      setErr('')
                    }
                  })
                }}
                placeholder="00.000.000/0000-00"
                render={(props) => <TextInputMask {...props} type={'cnpj'} />}
              />
              <ShouldRender if={err != ''}>
                <HelperText
                  style={{ fontSize: 14 }}
                  type="error"
                >{`${err} já cadastrado.`}</HelperText>
              </ShouldRender>

              <TextInput
                style={{
                  marginTop: 5
                }}
                mode="outlined"
                label="Inscrição Estadual"
                onChangeText={(value) => {
                  handleChangeText(value, 'inscEstadual')
                }}
                placeholder="000000000"
                maxLength={9}
              />
              <TextInput
                style={{
                  marginTop: 5
                }}
                mode="outlined"
                label="Cidade"
                onChangeText={(value) => {
                  handleChangeText(value, 'city')
                }}
                placeholder="Abelardo Luz"
              />
              <TextInput
                style={{
                  marginTop: 5
                }}
                mode="outlined"
                label="Bairro"
                onChangeText={(value) => {
                  handleChangeText(value, 'district')
                }}
                placeholder="Centro"
              />
              <TextInput
                style={{
                  marginTop: 5
                }}
                mode="outlined"
                label="Endereço"
                onChangeText={(value) => {
                  handleChangeText(value, 'address')
                }}
                placeholder="Rua General Osório, nº 0"
              />
              <TextInput
                style={{
                  marginTop: 5
                }}
                mode="outlined"
                label="Email"
                onChangeText={(value) => {
                  handleChangeText(value, 'email')
                }}
                placeholder="joaosantos@email.com"
              />
              <TextInput
                style={{
                  marginTop: 5
                }}
                keyboardType="numeric"
                mode="outlined"
                label="Telefone"
                onChangeText={(value) => {
                  handleChangeText(value, 'cellphone')
                  clients.forEach((client) => {
                    if (value == client.cell) {
                      setCellRef({
                        cellphone: client?.cell,
                        name: client?.nome
                      })
                    } else {
                      setCellRef({ cellphone: '', name: '' })
                    }
                  })
                }}
                placeholder="(49) 999333333"
                render={(props) => (
                  <TextInputMask
                    {...props}
                    type={'cel-phone'}
                    options={{
                      maskType: 'BRL',
                      withDDD: true,
                      dddMask: '(99) '
                    }}
                  />
                )}
              />
              <ShouldRender if={cellRef.cellphone != '' && cellRef.name != ''}>
                <HelperText
                  style={{ fontSize: 14 }}
                  type="error"
                >{`${cellRef.cellphone} já cadastrado em ${cellRef.name}.`}</HelperText>
              </ShouldRender>
            </ShouldRender>
          </ShouldRender>

          <TouchableOpacity onPress={orderSubmit}>
            <Button
              style={{
                marginTop: '5%',
                marginBottom: '25%',
                paddingVertical: 10,
                justifyContent: 'center'
              }}
              mode="contained"
            >
              Cadastrar Cliente
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
