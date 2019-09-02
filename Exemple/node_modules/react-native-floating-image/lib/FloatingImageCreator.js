import React, { Component } from 'react';
import { AnimatedEmoji } from './AnimatedEmoji';
import { View } from "react-native";
import PropTypes from 'prop-types';

export class FloatingImageCreator extends Component {

  static propTypes = {
    style: PropTypes.any,
    imgToLoad: PropTypes.array,
    duration: PropTypes.number,
    factor: PropTypes.number,
    selectedImg: PropTypes.array,
    randomSize: PropTypes.array,
    nbElemByNewWawe: PropTypes.number,
    floodLimit: PropTypes.number,
    styleBottom: PropTypes.array,
    styleTop: PropTypes.array,
    styleLeft: PropTypes.array,
    styleRight: PropTypes.array,
  }

  static defaultProps = {
    duration: 3000,
    factor: 1,
    selectedImg: [1],
    randomSize: [1, 3],
    nbElemByNewWawe: 5,
    floodLimit: 200,
    styleBottom: [0, 1],
    styleTop: [0, 200],
    styleLeft: [0, 300],
    styleRight: [0, 1],
  };

  constructor(props) {
    super(props);

    console.disableYellowBox = true;
    this.state = { emoji: [] };
    this.reset = Date.now();
    this.timerFlood = Date.now();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  updateImg = async (emojis) => {
    emojis.push(
      <AnimatedEmoji
        path={ this.props.path}
        style={{
          top: this.getRandomInt(this.props.styleTop[0], this.props.styleTop[1]),
          left: this.getRandomInt(this.props.styleLeft[0], this.props.styleLeft[1]),
          bottom: this.getRandomInt(this.props.styleBottom[0], this.props.styleBottom[1]),
          right: this.getRandomInt(this.props.styleRight[0], this.props.styleRight[1]),
        }}
        selectedImg={this.props.selectedImg}
        duration={this.props.duration}
        factor={this.props.factor}
        randomSize={this.props.randomSize}
      />
    );
  }

  deleteItems = async () => {
    if (Date.now() - this.reset > this.props.duration) {
      await this.setState({ emoji : [] }, () => {
        console.log(`toto: reset`);
      });
    }
  }
  
  generateFloatingImg = async () => {
    if (Date.now() - this.timerFlood > this.props.floodLimit) {
      let emojis = [...this.state.emoji];

      for (let i = 0; i != this.props.nbElemByNewWawe; i++) {
        this.updateImg(emojis);
        this.reset = Date.now();
      };
      setTimeout(this.deleteItems, this.props.duration);
      this.setState({ emoji : emojis }, () => {
        console.log(`toto: set state`)
      })
      this.timerFlood = Date.now();
    }
  }

  render() {
    return (
      <View>
        {this.state.emoji} 
      </View>
    );
  }
}
