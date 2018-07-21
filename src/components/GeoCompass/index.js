import React, { Component } from 'react';
import styled from 'styled-components';
import CompassContainer from './CompassContainer';
import ClinoContainer from './ClinoContainer';
import Compass from './Compass';
import Clino from './Clino';
import Header from '../styled/Header';

class GeoCompass extends Component {
  constructor(props) {
    super(props);
    this.radius = 40;
    this.clinoToCompassRatio = 2 / 3; //Height ratio
  }
  render() {
    return (
      <React.Fragment>
        <Header>Compass / Clinometer</Header>
        <div className={this.props.className}>
          <CompassWrapper>
            <CompassContainer
              azimuth={this.props.azimuth}
              changePlaneState={this.props.changePlaneState}
              animateStateChange={this.props.animateStateChange}
            >
              <Compass radius={this.radius} />
            </CompassContainer>
          </CompassWrapper>
          <ClinoWrapper>
            <ClinoContainer
              azimuth={this.props.azimuth}
              dip={this.props.dip}
              changePlaneState={this.props.changePlaneState}
              animateStateChange={this.props.animateStateChange}
            >
              <Clino
                radius={this.radius}
                clinoToCompassRatio={this.clinoToCompassRatio}
              />
            </ClinoContainer>
          </ClinoWrapper>
        </div>
      </React.Fragment>
    );
  }
}

const CompassWrapper = styled.div`
  width: 100%;
  height: 60%;
`;

const ClinoWrapper = styled.div`
  width: 100%;
  height: 40%;
`;

export default GeoCompass;
