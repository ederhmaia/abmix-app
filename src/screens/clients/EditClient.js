import * as React from 'react'
import { useState, useEffect } from 'react'
import { View, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Button, TextInput, HelperText } from 'react-native-paper'

// services
import firebase from '../../services/firebase-config'
// components
import ShouldRender from '../components/ShouldRender'
// 3rdparty
import { TextInputMask } from 'react-native-masked-text'
import DefaultLoader from '../components/Loader/DefaultLoader'

export default function EditClient({ navigation, route }) {
  const [clients, setClients] = useState([])
  const [visible, setVisible] = useState(true)
  const [checked, setChecked] = React.useState('cpf')
  const [selectedValue, setSelectedValue] = useState('null')
  const [err, setErr] = useState('')
  const initalState = {
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

  const [state, setState] = useState(initalState)

  useEffect(() => {
    if (route.params.clientToEdit) {
      const rp = route.params.clientToEdit

      if (rp.cnpj) {
        setChecked('cnpj')
        setSelectedValue(rp.entityType)
      } else {
        setChecked('cpf')
      }
      setState({
        name: rp.name,
        email: rp.email,
        cpf: rp.cpf,
        cellphone: rp.cell,
        city: rp.city,
        address: rp.address,
        district: rp.district,
        entityType: rp.entityType,
        inscEstadual: rp.inscEstadual,
        cnpj: rp.cnpj
      })
      setVisible(false)
    }

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

  const clientSubmit = async () => {
    setVisible(true)
    db.collection('clients')
      .doc(route.params.clientToEdit.ClientID)
      .update({
        nome: state.name,
        email: state.email,
        cpf: state.cpf,
        cell: state.cellphone,
        city: state.city,
        address: state.address,
        district: state.district,
        entityType: state.entityType,
        inscEstadual: state.inscEstadual,
        cnpj: state.cnpj
      })
      .then(() => {
        setState(initalState)
        setVisible(false)
        Alert.alert('Editado.', `Cliente alterado.`, [
          {
            text: 'OK',
            style: 'default'
          }
        ])
        navigation.navigate('Clientes', { screen: 'HomeClients' })
      })
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
              value={state.city}
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
              value={state.district}
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
              value={state.address}
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
              value={state.email}
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
              value={state.cellphone}
              label="Telefone"
              onChangeText={(value) => {
                handleChangeText(value, 'cellphone')
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
                value={state.inscEstadual}
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
                value={state.city}
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
                value={state.district}
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
                value={state.address}
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
                value={state.email}
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
                value={state.cellphone}
                onChangeText={(value) => {
                  handleChangeText(value, 'cellphone')
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
            </ShouldRender>
          </ShouldRender>

          <TouchableOpacity onPress={clientSubmit}>
            <Button
              style={{
                marginTop: '5%',
                marginBottom: '25%',
                paddingVertical: 10,
                justifyContent: 'center'
              }}
              mode="contained"
            >
              Atualizar Cliente
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
