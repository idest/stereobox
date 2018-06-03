import React, { Component } from 'react';
import Controls from './Controls';
import Visualizations from './Visualizations';
import './styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.changePlaneState = this.changePlaneState.bind(this);
    this.animateStateChange = this.animateStateChange.bind(this);
    this.state = {
      planeAzimuth: 45,
      planeDip: 45,
      lastInput: 'AZ',
      lastAnimationId: null
    };
  }
  changePlaneState(newPlaneState) {
    let planeAzimuth =
      newPlaneState.planeAzimuth === undefined
        ? this.state.planeAzimuth
        : newPlaneState.planeAzimuth;
    let planeDip =
      newPlaneState.planeDip === undefined
        ? this.state.planeDip
        : newPlaneState.planeDip;
    let lastInput =
      newPlaneState.lastInput === undefined ? 'AZ' : newPlaneState.lastInput;
    let lastAnimationId =
      newPlaneState.lastAnimationId === undefined
        ? this.state.lastAnimationId
        : newPlaneState.lastAnimationId;
    this.setState({
      planeAzimuth: planeAzimuth,
      planeDip: planeDip,
      lastInput: lastInput,
      lastAnimationId: lastAnimationId
    });
    /*
    console.log('newPlaneState:', {
      planeAzimuth: planeAzimuth,
      planeDip: planeDip,
      lastInput: lastInput,
      animationId: animationId
    });
    */
  }
  animateStateChange(stateUpdater, animationId) {
    //TODO: find a way to clear all possible intervals in this line
    //console.log('animationId', animationId);
    this.setState({ lastInput: 'ANIM', lastAnimationId: animationId });
    const updateState = () => {
      if (
        this.state.lastInput === 'ANIM' &&
        this.state.lastAnimationId === animationId
      ) {
        const updatedState = stateUpdater();
        if (updatedState !== false) {
          this.changePlaneState({
            ...updatedState,
            lastInput: 'ANIM',
            lastAnimationId: animationId
          });
          return;
        }
      }
      console.log('Interval stopped');
      clearInterval(interval);
    };
    console.log('Interval started');
    const interval = setInterval(updateState, 5);
  }
  render() {
    return (
      <div className="container">
        <h1>Compass</h1>
        <h3>An interactive tool to visualize planes</h3>
        <Controls
          className="controls"
          azimuth={this.state.planeAzimuth}
          dip={this.state.planeDip}
          lastInput={this.state.lastInput}
          changePlaneState={this.changePlaneState}
        />
        <Visualizations
          className="visualizations"
          azimuth={this.state.planeAzimuth}
          dip={this.state.planeDip}
          changePlaneState={this.changePlaneState}
          animateStateChange={this.animateStateChange}
        />
      </div>
    );
  }
}
/*
        */
export default App;
