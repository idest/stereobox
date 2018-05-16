import React, { Component } from 'react';
import Controls from './Controls';
import Sketches from './Sketches';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.changePlaneState = this.changePlaneState.bind(this);
    this.state = { planeAzimuth: 315, planeDip: 45, lastInput: 'AZ' };
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
    this.setState({
      planeAzimuth: planeAzimuth,
      planeDip: planeDip,
      lastInput: lastInput
    });
    console.log('newPlaneState:', {
      planeAzimuth: planeAzimuth,
      planeDip: planeDip,
      lastInput: lastInput
    });
  }
  render() {
    return (
      <div className="container">
        <h1>Compass</h1>
        <h3>An interactive tool for plane visualization</h3>
        <Controls
          azimuth={this.state.planeAzimuth}
          dip={this.state.planeDip}
          lastInput={this.state.lastInput}
          changePlaneState={this.changePlaneState}
        />
        <Sketches
          azimuth={this.state.planeAzimuth}
          dip={this.state.planeDip}
          changePlaneState={this.changePlaneState}
        />
      </div>
    );
  }
}
export default App;
