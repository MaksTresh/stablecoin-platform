import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import MetalModel from '../components/Metal/MetalModel';
import CoinChart from '../components/charts/CoinChartWithTooltip';
import a from '@ant-design/react-native/lib/modal/alert';
import {buyMetal, sellMetal} from "../api/requests";
import * as SecureStore from 'expo-secure-store';
 
export default function MetalScreen(props : any) {
  const model = props.route.params.model;
  props.navigation.setOptions({title: ""});
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [sellAmount, setSellAmount] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={buyModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={{
                position: 'absolute',
                marginTop: 10,
              }}
              onPress={() => setBuyModalVisible(!buyModalVisible)}
            >
              <Image style={{
                width: 20,
                marginLeft: "100%",
                height: 20,
                  resizeMode: 'contain'
                }} source={require('../assets/images/cross.png')}/>
            </Pressable>
            <Text style={styles.modalText}>Покупка</Text>
            <Text style={styles.sellAcceptanceModalText}>Доступно средств для списания:</Text>
            <Text style={styles.sellAcceptanceBalanceModalText}>{model.balance}</Text>
            <Text style={styles.sellAcceptanceModalText}>Курс:</Text>
            <Text style={styles.sellAcceptanceBalanceModalText}>{`1 = ${model.course !== undefined ? model.course : model.balance} Р`}</Text>
            <View style={styles.SectionStyle}>
              <TextInput
                  style={styles.inputStyle}
                  onChangeText={(amount) =>
                    setBuyAmount(Number(amount))
                  }
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  keyboardType='numeric'
                  returnKeyType="default"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
            </View>
            <Text style={styles.sellAcceptanceModalText}>{`Коммисия: ${(buyAmount*0.05).toFixed(4)}`}</Text>
            <View>
              <Pressable
                onPress={() => {
                  SecureStore.getItemAsync('token').then(token => {
                    buyMetal(token, buyAmount, model.desc).then((x) => {
                      console.log(x);
                    }).catch((x) => {
                      console.log(x);
                    })
                  });
                  setBuyModalVisible(!buyModalVisible);
                }}
              >
                <Text style={styles.buySellButtonStyle}>Купить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={sellModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={{
                position: 'absolute',
                marginTop: 10,
              }}
              onPress={() => setSellModalVisible(!sellModalVisible)}
            >
              <Image style={{
                width: 20,
                marginLeft: "100%",
                height: 20,
                  resizeMode: 'contain'
                }} source={require('../assets/images/cross.png')}/>
            </Pressable>
            <Text style={styles.modalText}>Продажа</Text>
            <Text style={styles.sellAcceptanceModalText}>Доступно для списания</Text>
            <Text style={styles.sellAcceptanceBalanceModalText}>{model.balance}</Text>
            <Text style={styles.sellAcceptanceModalText}>Сумма продажи</Text>
            <View style={styles.SectionStyle}>
              <TextInput
                  style={styles.inputStyle}
                  onChangeText={(amount) =>
                    setSellAmount(Number(amount))
                  }
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  keyboardType='numeric'
                  returnKeyType="default"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
            </View>
            <Text style={styles.sellAcceptanceModalText}>{`Коммисия: ${(sellAmount*0.05).toFixed(4)}`}</Text>
            <Text style={styles.sellAcceptanceModalText}>
              {`Доступный остаток: ${(model.balance - sellAmount - Number((sellAmount*0.05).toFixed(4))).toFixed(4)}`}
            </Text>
            <View>
              <Pressable
                onPress={() => {
                  SecureStore.getItemAsync('token').then(token => {
                    sellMetal(token, sellAmount, model.desc).then((x) => {
                      console.log(x);
                    }).catch((x) => {
                      console.log(x);
                    })
                  });
                  setSellModalVisible(!sellModalVisible)
                }}
              >
                <Text style={styles.buySellButtonStyle}>Продать</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>{model.name}</Text>
      <Text style={styles.balance}>{model.balance}</Text>
      <Text style={styles.change}>{model.change}</Text>
      <CoinChart start={model.price}/>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
              onPress={() => {
                setBuyModalVisible(true)
              }}
              activeOpacity={0.5}
              style={styles.buttonStyle}><Text style={styles.buttonTextStyle}>Купить</Text></TouchableOpacity>
        <TouchableOpacity 
              onPress={() => {
                setSellModalVisible(true)
              }}
              activeOpacity={0.5}
              style={styles.buttonStyle}><Text style={styles.buttonTextStyle}>Продать</Text></TouchableOpacity>
      </View>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    margin: "5%",
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 39,
    color: '#214F48'
  },
  balance: {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 29,
    color: '#000000'
  },
  change: {
    margin: "5%",
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 19,
    color: '#214F48'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  buttonStyle: {
    margin: 10,
    width: "35%",
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    color: '#000000',
    borderColor: '#005F50',
    alignItems: 'center',
    borderRadius: 11
  },
  buttonTextStyle: {
    padding: 15,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    color: '#214F48'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 11,
    width: 200,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#005F50",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    margin: "10%",
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 39,
    color: '#214F48'
  },
  sellAcceptanceModalText: {
    marginBottom: "5%",
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 18,
    color: '#898A8D'
  },
  sellAcceptanceBalanceModalText: {
    marginBottom: "10%",
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 39,
    color: '#09B99D'
  },
  inputStyle: {
    marginBottom: "10%",
    width: 200,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 32,
    lineHeight: 39,
    textAlign: "center",
    borderColor: '#dadae8',
  },
  SectionStyle: {
    height: 70,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buySellButtonStyle: {
    marginBottom: "10%",
    width: 200,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 16,
    lineHeight: 39,
    textAlign: "center",
    borderColor: '#dadae8',
    backgroundColor: '#005F50'
  }
});
