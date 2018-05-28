import React, { Component } from 'react';
import Controls from './Controls';
import Visualizations from './Visualizations';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.changePlaneState = this.changePlaneState.bind(this);
    this.animateAzimuthChange = this.animateAzimuthChange.bind(this);
    this.state = {
      planeAzimuth: 45,
      planeDip: 45,
      lastInput: 'AZ',
      animationId: null
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
    let animationId =
      newPlaneState.animationId === undefined
        ? this.state.animationId
        : newPlaneState.animationId;
    this.setState({
      planeAzimuth: planeAzimuth,
      planeDip: planeDip,
      lastInput: lastInput,
      animationId: animationId
    });
    console.log('newPlaneState:', {
      planeAzimuth: planeAzimuth,
      planeDip: planeDip,
      lastInput: lastInput,
      animationId: animationId
    });
  }
  animateAzimuthChange(newAzimuth, animationId) {
    //TODO: find a way to clear all possible intervals in this line
    console.log('animationId', animationId);
    this.setState({ lastInput: 'ANIM', animationId: animationId });
    console.log(this.state.animationId);
    let az = this.state.planeAzimuth;
    const newAz = newAzimuth;
    const modAz = (azToMod, azDiff) => {
      let azMod = azToMod;
      if (azDiff > 180) {
        if (newAz > azToMod) {
          azMod = newAz + (360 - azDiff);
        } else {
          azMod = newAz - (360 - azDiff);
        }
      }
      return azMod;
    };
    const fixAz = azToFix => {
      let azFix = azToFix;
      if (azToFix < 0) {
        azFix = azToFix + 360;
      } else {
        azFix = azToFix % 360;
      }
      return azFix;
    };
    const updateState = () => {
      const azDiff = Math.abs(newAz - az);
      if (
        azDiff > 2 &&
        this.state.lastInput === 'ANIM' &&
        this.state.animationId === animationId
      ) {
        az = modAz(az, azDiff);
        az = 0.93 * az + 0.07 * newAz;
        az = fixAz(az);
        this.changePlaneState({
          planeAzimuth: az,
          lastInput: 'ANIM',
          animationId: animationId
        });
        return;
      }
      console.log('interval stopped');
      clearInterval(interval);
    };
    console.log('interval started');
    const interval = setInterval(updateState, 17);
  }
  render() {
    return (
      <div className="container">
        <h1>Compass</h1>
        <h3>An interactive tool for plane visualization</h3>
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
          animateAzimuthChange={this.animateAzimuthChange}
        />
      </div>
    );
  }
}
export default App;
