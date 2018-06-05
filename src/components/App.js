import React, { Component } from 'react';
import Readings from './Readings';
import GeoCompass from './GeoCompass';
import SchmidtNet from './SchmidtNet';
import Context from './Context';
import styled from 'styled-components';
import { media } from '../utils/style';

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
    this.colors = {
      azNeedleColor: '#ff0000',
      azExtNeedleColor: '#0000ff',
      dipDirectionNeedleColor: '#00ff00',
      dipNeedleColor: '#ffff00',
      backgroundColor: '#000000',
      backgroundColor2: '#181818',
      foregroundColor: '#ffffff',
      foregroundColor2: '#dcdcdc',
      foregroundColor3: '#a9a9a9'
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
      <AppWrapper>
        <Title>Compass</Title>
        <Subtitle>An interactive tool to visualize planes</Subtitle>
        <ReadingsWrapper>
          <Readings
            className="controls"
            azimuth={this.state.planeAzimuth}
            dip={this.state.planeDip}
            lastInput={this.state.lastInput}
            changePlaneState={this.changePlaneState}
          />
        </ReadingsWrapper>
        <Visualizations>
          <GeoCompassWrapper>
            <GeoCompass
              azimuth={this.state.planeAzimuth}
              dip={this.state.planeDip}
              changePlaneState={this.changePlaneState}
              animateStateChange={this.animateStateChange}
            />
          </GeoCompassWrapper>
          <SchmidtNetWrapper>
            <SchmidtNet
              azimuth={this.state.planeAzimuth}
              dip={this.state.planeDip}
            />
          </SchmidtNetWrapper>
          <ContextWrapper>
            <Context
              azimuth={this.state.planeAzimuth}
              dip={this.state.planeDip}
            />
          </ContextWrapper>
        </Visualizations>
      </AppWrapper>
    );
  }
}

const FlexContainer = styled.div``;

const AppWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  /*align-items: center;*/
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  text-align: center;
  background: black;
  color: WhiteSmoke;
  padding: 30px;
  ${media.giant`
    margin-left: auto; 
    margin-right: auto;
    width: 992px;
  `};
`;

const Title = styled.h1`
  width: 100%;
  margin-bottom: 0;
`;

const Subtitle = styled.h3`
  width: 100%;
  margin-top: 0;
  color: darkgray;
`;

const ReadingsWrapper = styled.div`
  width: 100%;
`;

const Visualizations = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background-color: green;
  height: 400px;
`;

const Viz = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black;
  color: white;
  text-algin: center;
`;

const GeoCompassWrapper = Viz.extend`
  width: 100%;
  height: 100%;
  padding-top: 15px;
  padding-bottom: 5px;
  border: solid 1px gray;
  ${media.giant`
    width: 30%;
  `};
`;

const SchmidtNetWrapper = Viz.extend`
  width: 100%;
  height: 100%;
  border: solid 1px gray;
  ${media.giant`
    width: 40%;
  `};
`;

const ContextWrapper = Viz.extend`
  background-color: #333333;
  width: 100%;
  border: solid 1px gray;
  ${media.giant`
    width: 30%;
  `};
`;

/*
        */
export default App;
