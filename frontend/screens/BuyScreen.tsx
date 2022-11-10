import React, {useState} from 'react';
import { List } from '@ant-design/react-native';
import { StyleSheet, ScrollView,Image, TextInput } from 'react-native';
import { ListItem, Avatar } from '@rneui/themed'

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import GoodCard from '../components/Goods/GoodCard';
import GoodModel from '../components/Goods/GoodModel';

export default function BuyScreen(props : any) {

  const [searchString, setSearchString] = useState("");

  const randomData = [{name: "Goznak Gold Token", rate: 3, price: 102474.5, source: require('../assets/images/gold.png'), desc: "GOZG", balance: 102474.5, course: 102474.5, change: "+500.2 ₽, +23% за всё время"},
  {name: "Goznak Platinum Token ", rate: 1, price: 59833.3, source: require('../assets/images/plat.png'), desc: "GOZP", balance: 59833.3, course: 59833.3, change:  "+276.8 ₽, +23% за всё время"},
  {name: "Goznak Silver Token", rate: 2, price: 1267, source: require('../assets/images/silver.png'), desc: "GOZS", balance: 1267, course: 1267, change: "+597.6 ₽, +23% за всё время"},
  {name: "Goznak Smart Basket Token", rate: 3, price: 25834, source: require('../assets/images/good.png'), desc: "GOZB", balance: 25834, course: 25834, change: "+0 ₽, +0% за всё время"}];

  const filteredData = randomData.filter((x) => {
    return x.name.includes(searchString);
  })

  return (
    <View>
      <View>
        <View>
            <TextInput
                  style={styles.inputStyle}
                  onChangeText={(data) =>
                    setSearchString(data)
                  }
                  placeholder="Поиск"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  keyboardType='default'
                  returnKeyType="default"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
        </View>
      </View>
      <ScrollView style={styles.container}>
      {filteredData.map(x => { 
        return <GoodCard key={x.name} source={x.source} navigation={props.navigation} model={new GoodModel("" + x.name, x.rate, x.price, x.desc, x.balance, x.change)}/>
      })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  containerStyle: {
    borderRadius: 11,
    padding: 0,
    background: "linearGradient(180deg, #005F50 43.23%, #103933 100%)"
  },
  mainContainer: {
    flexDirection: 'row'
  },
  rightSideContainer: {
    margin: '5%'
  },
  metalImageViewStyle: {
    width: '25%',
    backgroundColor: '#005F50',
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11
  },
  metalNameStyle: {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 18
  },
  metalPriceStyle: {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 32,
    lineHeight: 39
  },
  metalPriceChangeStyle: {
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 10,
    lineHeight: 12
  },
  inputStyle: {
    marginBottom: "5%",
    marginLeft: "3%",
    width: "95%",
    color: 'black',
    borderWidth: 1,
    borderRadius: 7,
    fontSize: 20,
    lineHeight: 39,
    textAlign: "center",
    borderColor: '#dadae8',
  }
});
