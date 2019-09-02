import React, { Component } from "react";
import { StyleSheet, View, Button } from "react-native";
import { FloatingImageCreator } from 'react-native-floating-image';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.imgToLoad = [require('./assets/img_purple.png'),
                      require('./assets/img_orange.png'),
                      require('./assets/img_green.png'),
                      require('./assets/img_blue.png'),
                      require('./assets/img_red.png')];
    this.floatingImageCreator = React.createRef();
    console.disableYellowBox = true;
    this.nbElemByNewWawe = 15;
    this.duration = 6000;
    this.floodLimit = 450;
    this.imgToLoad = this.imgToLoad;
    this.selectedImg = [0, 5];
    this.factorSize = 1;
    this.randomSize = [1, 3];
    this.styleBottom = [0, 1]
    this.styleTop= [0, 200]
    this.styleLeft = [0, 300]
    this.styleRight = [0, 300]
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onClick = () => {
    this.floatingImageCreator.current.generateFloatingImg();
  };

  render() {
    return (
      <View style={styles.container}>
        <FloatingImageCreator
          ref={this.floatingImageCreator}
          path={ this.imgToLoad }
          duration={this.duration}
          factor={this.factorSize}
          selectedImg={this.selectedImg}
          randomSize={this.randomSize}
          floodLimit={this.floodLimit}
          nbElemByNewWawe={this.nbElemByNewWawe}
          styleBottom={this.styleBottom}
          styleTop={this.styleTop}
          styleLeft={this.styleLeft}
          styleRight={this.styleRight}
        />
        <View style={{ position:'absolute', width:'100%', bottom:10, flex:1, alignItems:'center' }}>
          <Button
            onPress={this.onClick}
            title="Click Me"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});