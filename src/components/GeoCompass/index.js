import React, { Component } from 'react';
import styled from 'styled-components';
import CompassContainer from './CompassContainer';
import ClinoContainer from './ClinoContainer';
import Compass from './Compass';
import Clino from './Clino';
import Header from '../styled/Header';
import WithDescription from '../shared/WithDescription';
import description from '../../locales/en/GeoCompass.md';
import { HelpConsumer } from '../App.js';

class GeoCompass extends Component {
  constructor(props) {
    super(props);
    this.radius = 40;
    this.clinoToCompassRatio = 2 / 3; // Height ratio
  }
  render() {
    return (
      <HelpConsumer>
        {showHelp => (
          <Container>
            <Header>Compass / Clinometer</Header>
            <WithDescription text={description} show={showHelp}>
              <GeoCompassContainer>
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
              </GeoCompassContainer>
            </WithDescription>
          </Container>
        )}
      </HelpConsumer>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden; // moz fix;
`;
const GeoCompassContainer = styled.div`
  box-sizing: border - box;
  display: flex;
  flex-direction: column;
  padding-top: 25px;
  padding-bottom: 15px;
  flex: 1;
  overflow: hidden; // moz fix;
`;

const CompassWrapper = styled.div`
  height: 60%;
`;

const ClinoWrapper = styled.div`
  height: 40%;
`;

//TODO: get rid of '//moz fix' everywhere

export default GeoCompass;
