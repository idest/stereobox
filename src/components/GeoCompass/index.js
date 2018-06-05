import React, { Component } from 'react';
import Compass from './Compass';
import Clino from './Clino';
import styled from 'styled-components';

class GeoCompass extends Component {
  constructor(props) {
    super(props);
    this.radius = 40;
    this.clinoToCompassRatio = 2 / 3; //Height ratio
  }
  render() {
    return (
      <React.Fragment>
        <CompassWrapper>
          <Compass
            azimuth={this.props.azimuth}
            changePlaneState={this.props.changePlaneState}
            animateStateChange={this.props.animateStateChange}
            radius={this.radius}
          />
        </CompassWrapper>
        <ClinoWrapper>
          <Clino
            azimuth={this.props.azimuth}
            dip={this.props.dip}
            radius={this.radius}
            clinoToCompassRatio={this.clinoToCompassRatio}
            changePlaneState={this.props.changePlaneState}
            animateStateChange={this.props.animateStateChange}
          />
        </ClinoWrapper>
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
