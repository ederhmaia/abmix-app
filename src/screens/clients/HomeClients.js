import * as React from 'react'
import { useState, useEffect } from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

// 3rd party libraries
import { useNavigation } from '@react-navigation/native'
// srvices
// todo -> relative imports
import firebase from '../../services/firebase-config'
// components
import ClientCard from '../clients/components/ClientCard'
import DefaultLoader from './../components/Loader/DefaultLoader'

export default function HomeClients({ route }) {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const navigation = useNavigation()

  const [visible, setVisible] = useState(true)
  const [search, setSearch] = React.useState('')

  const addClient = () => {
    navigation.navigate('Clientes', { screen: 'AddClient' })
  }

  const searchFilter = (text) => {
    if (text) {
      const newData = clients.filter((item) => {
        return item.nome.toLowerCase().match(text.toLowerCase())
      })
      setFilteredClients(newData)
      setSearch(text)
    } else {
      setFilteredClients(clients)
      setSearch(text)
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            addClient()
          }}
        >
          <Button icon="account-plus" style={{ marginRight: 20, marginTop: 5 }}>
            Cliente
          </Button>
        </TouchableOpacity>
      )
    })
  }, [])

  useEffect(() => {
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
        setFilteredClients(clientsArr)
        setVisible(false)
      })
  }, [])

  return (
    <View style={{ backgroundColor: '#f2f2f2' }}>
      <DefaultLoader visible={visible} />
      <TextInput
        label="Pesquise por um nome..."
        mode="outlined"
        dense={false}
        style={{ marginHorizontal: '3%', marginVertical: 5, height: 50 }}
        value={search}
        onChangeText={(text) => searchFilter(text)}
      />
      <View
        style={{
          marginTop: 5,
          alignItems: 'center'
        }}
      >
        <View style={{ width: '95%' }}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 50 }}
            data={filteredClients}
            keyExtractor={(client) => client.id}
            renderItem={({ item, index }) => {
              return (
                <ClientCard
                  nome={item.nome}
                  cpf={item.cpf}
                  email={item.email}
                  cell={item.cell}
                  city={item.city}
                  district={item.district}
                  address={item.address}
                  cnpj={item.cnpj}
                  entityType={item.entityType}
                  inscEstadual={item.inscEstadual}
                  id={item.id}
                  key={item.id}
                />
              )
            }}
          />
        </View>
      </View>
    </View>
  )
}
