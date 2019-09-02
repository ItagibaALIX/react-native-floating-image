import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { Image } from 'react-native'

const ANIMATION_END_X = Dimensions.get('window').height;
const NEGATIVE_END_X = ANIMATION_END_X * -1;

export class AnimatedEmoji extends Component {

  static propTypes = {
    style: PropTypes.any,
    path: PropTypes.array,
    duration: PropTypes.number,
    factor: PropTypes.number,
    selectedImg: PropTypes.array,
    randomSize: PropTypes.array,
  };
  
  static defaultProps = {
    style: {
      top: 0,
      left: 150,
    },
    factor: 1,
    selectedImg: [0, 5],
    randomSize: [1, 3],
    duration: 5000,
    factor: 2,
    randomSize: [1, 3],
  };
  
  constructor(props) {
    super(props);
    
    this.imgs = [];
    this.state = {
      position: new Animated.Value(ANIMATION_END_X / 2 + ANIMATION_END_X / 10),
      isAnimationStarted: false
    };
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomFloat(min, max) {
    max *= 100;
    min *= 100;
    let res = Math.floor(Math.random() * (max - min + 1)) + min
    return res / 100;
  }

  generateInputRanges = (start, end, count) => {
    const length = start - end;
    const segment = length / (count - 1);
    const results = [];

    results.push(start);
    for (let i = count - 2; i > 0; i--) {
      results.push(end + segment * i);
    }
    results.push(end);
    return results;
  };

  generateYOutputRange = (count) => {
    const results = [];

    for (let i = 0; i < count; i++) {
      results.push(Math.random() * 50);
    }
    return results;
  };

  generateScaleOutputRange = (count) => {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(Math.random() + 1);
    }
    return results;
  };

  randomAngle = () => {
    let array = ['0deg', '-20deg', '20deg', '0deg', '-10deg', '10deg', '90deg']

    return array[this.getRandomInt(0, array.length - 1)];
  }
  
  generateAnimation = () => {
    this._xAnimation = this.state.position.interpolate({
      inputRange: [NEGATIVE_END_X, 0],
      outputRange: [ANIMATION_END_X, 0]
    });

    let randomSize = this.getRandomInt(0, 3) + 3;
    const inputRangeY = this.generateInputRanges(NEGATIVE_END_X, 0, randomSize);

    this._yAnimation = this._xAnimation.interpolate({
      inputRange: inputRangeY,
      outputRange: this.generateYOutputRange(randomSize)
    });

    randomSize = this.getRandomInt(0, 2) + 2;
    const inputRangeScale = this.generateInputRanges(NEGATIVE_END_X, 0, randomSize);

    this._scaleAnimation = this._xAnimation.interpolate({
      inputRange: inputRangeScale,
      outputRange: this.generateScaleOutputRange(randomSize),
      extrapolate: 'clamp'
    });

    this._opacityAnimation = this._xAnimation.interpolate({
      inputRange: [NEGATIVE_END_X, NEGATIVE_END_X/4*3, NEGATIVE_END_X/4*2, NEGATIVE_END_X/4, 0],
      outputRange: [1, 1, 1, 0.8, 0.5]
    });

    this._rotateAnimation = this._xAnimation.interpolate({
      inputRange: [NEGATIVE_END_X, NEGATIVE_END_X/4*3, NEGATIVE_END_X/4*2, NEGATIVE_END_X/4, 0],
      outputRange: [this.randomAngle(), this.randomAngle(), this.randomAngle(), this.randomAngle(), this.randomAngle()]
    });
  };

  calculeRandomSize() {
    return this.getRandomFloat(this.props.randomSize[0], this.props.randomSize[1]);
  }

  loadImg() {
    for (let i = 0; i != this.props.path.length; i++) {
      let tmpRadomSize = this.calculeRandomSize();
      this.imgs.push(<Image 
          source={this.props.path[i]}
          style={{ width: 9 * this.props.factor * tmpRadomSize,
                   height: 8 * this.props.factor * tmpRadomSize }} 
      />)
    }
  }

  componentDidMount() {
    this.loadImg();
    this.startAnimating();
  }

  startAnimating = () => {
    this.generateAnimation();
    this.setState({
      isAnimationStarted: true
    }, () => {
      Animated.timing(this.state.position, {
        duration: this.props.duration,
        toValue: -400,
        useNativeDriver: true
      }).start(() => {
        this.setState({
          isAnimationStarted: false,
          position: new Animated.Value(ANIMATION_END_X),
        });
      });
    });
  };

  getAnimationStyle = () => {
    if (this.state.isAnimationStarted) {
      return {
        transform: [
          { translateY: this.state.position },
          { translateX: this._yAnimation },
          { scale: this._scaleAnimation },
          { rotate: this._rotateAnimation }
        ],
        opacity: this._opacityAnimation
      }
    }

    return {};
  };

  whichImgPrint() {
    if (this.props.selectedImg.length > 1)
      return this.getRandomInt(this.props.selectedImg[0], this.props.selectedImg[1]);
    return this.props.selectedImg[0];
  }

  render() {
    const { style } = this.props;

    return (
      <Animated.View style={[styles.container, this.getAnimationStyle(), style]}>
        {this.imgs[this.whichImgPrint()]}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    transform: [
      { translateX: ANIMATION_END_X }
    ],
  }
});
