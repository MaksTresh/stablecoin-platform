import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

import Colors from '../../constants/Colors';
import { MonoText } from '../StyledText';
import { Card } from 'react-native-elements';
import MetalModel from './MetalModel';
import GoodModel from '../Goods/GoodModel';

export default function MetalCard({model, source, navigation}:{model : GoodModel, source : string, navigation : any}) {

  const handleCardPress = async () => {
    await navigation.navigate('Metal', {model: model})
  };

  return (
    <Card containerStyle={styles.containerStyle} title="Local Modules">
      <TouchableOpacity 
              activeOpacity={0.5}
              style={styles.mainContainer}
              onPress={handleCardPress}>
        <View style={styles.metalImageViewStyle}>
          <Image source={source}
          style={{
            width: '100%',
            height: 100,
          }}/>
        </View>
        <View style={styles.rightSideContainer}>
          <Text style={styles.metalNameStyle}>{model.name}</Text>
          <Text style={styles.metalPriceStyle}>{model.balance} {model.desc}</Text>
          <Text style={styles.metalPriceChangeStyle}>{model.change}</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
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
  }
});

