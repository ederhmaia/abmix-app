import React from 'react'
import AnimatedLoader from 'react-native-animated-loader'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
})

const DefaultLoader = (props) => {
  return (
    <AnimatedLoader
      visible={props.visible}
      overlayColor="rgba(255,255,255,0.75)"
      animationStyle={styles.lottie}
      speed={1}
      source={require('./Loader2.json')} //custom lottie json here
    ></AnimatedLoader>
  )
}

export default DefaultLoader
