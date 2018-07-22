import React from 'react';
import Readings from './Readings';
import GeoCompass from './GeoCompass';
import SchmidtNet from './SchmidtNet';
import Context from './Context';
import Tabs from './Tabs';
import Tab from './Tabs/Tab';
import styled, { ThemeProvider } from 'styled-components';
import { media } from '../utils/style';
import logo from '../logo.png';
import theme from '../utils/theme';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.changePlaneState = this.changePlaneState.bind(this);
    this.animateStateChange = this.animateStateChange.bind(this);
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
    this.state = {
      planeAzimuth: 45,
      planeDip: 45,
      lastInput: 'AZ',
      lastAnimationId: null,
      windowWidth: window.innerWidth
    };
  }
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }
  handleWindowSizeChange() {
    this.setState({ windowWidth: window.innerWidth });
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
      //console.log('Interval stopped');
      clearInterval(interval);
    };
    //console.log('Interval started');
    const interval = setInterval(updateState, 5);
  }
  render() {
    const isMobile = this.state.windowWidth < 640;
    if (isMobile) {
      return (
        <ThemeProvider theme={theme}>
          <AppWrapper>
            <Content>
              <StyledReadings
                className="controls"
                azimuth={this.state.planeAzimuth}
                dip={this.state.planeDip}
                lastInput={this.state.lastInput}
                changePlaneState={this.changePlaneState}
              />
              <TabsWrapper>
                <Tabs>
                  <Tab title="Compass">
                    <StyledGeoCompass
                      azimuth={this.state.planeAzimuth}
                      dip={this.state.planeDip}
                      changePlaneState={this.changePlaneState}
                      animateStateChange={this.animateStateChange}
                    />
                  </Tab>
                  <Tab title="Stereonet">
                    <StyledSchmidtNet
                      azimuth={this.state.planeAzimuth}
                      dip={this.state.planeDip}
                    />
                  </Tab>
                  <Tab title="3D Context">
                    <StyledContext
                      azimuth={this.state.planeAzimuth}
                      dip={this.state.planeDip}
                    />
                  </Tab>
                </Tabs>
              </TabsWrapper>
            </Content>
          </AppWrapper>
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={theme}>
          <AppWrapper>
            <Title>Geo Compass</Title>
            <Subtitle>
              An interactive tool to visualize planes using the stereographic
              projection
            </Subtitle>
            <Content>
              <ControlsSection>
                <StyledReadings
                  className="controls"
                  azimuth={this.state.planeAzimuth}
                  dip={this.state.planeDip}
                  lastInput={this.state.lastInput}
                  changePlaneState={this.changePlaneState}
                />
                <StyledGeoCompass
                  azimuth={this.state.planeAzimuth}
                  dip={this.state.planeDip}
                  changePlaneState={this.changePlaneState}
                  animateStateChange={this.animateStateChange}
                />
              </ControlsSection>
              <VisualizationsSection>
                <StyledSchmidtNet
                  azimuth={this.state.planeAzimuth}
                  dip={this.state.planeDip}
                />
                <StyledContext
                  azimuth={this.state.planeAzimuth}
                  dip={this.state.planeDip}
                />
              </VisualizationsSection>
            </Content>
            <LogoContainer>
              <StyledA href="https://idest.github.io">
                <Logo src={logo} />
              </StyledA>
            </LogoContainer>
          </AppWrapper>
        </ThemeProvider>
      );
    }
  }
}

const AppWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  height: 100%;
  width: auto;
  padding: 30px;
  justify-content: center;
  background: ${props => props.theme.bgColor};
  color: ${props => props.theme.fgColorD20};
  ${media.tablet`
    width: 640px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    /*align-items: center;*/
    text-align: center;
  `};
  ${media.desktop`
    width: 960px;
  `};
`;

const Title = styled.h1`
  ${media.tablet`
    margin-bottom: 0.5em;
    display: none;
  `};
  ${media.desktop`
    display: block;
    width: 100%;
    color: ${props => props.theme.fgColorD20};
  `};
`;

const Subtitle = styled.h3`
  ${media.tablet`
    display: none;
  `};
  ${media.desktop`
    display: block;
    width: 100%;
    margin-top: 0;
    color: ${props => props.theme.fgColorD40};
  `};
`;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
  border: solid 2px ${props => props.theme.bgColorL40};
  ${media.tablet`
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    width: 100%;
    height: 500px;
  `};
`;

const TabsWrapper = styled.div`
  flex: 1;
  height: 70%; // kind of random value, if height not defined width = 100%
  overflow: hidden;
`;

const StyledReadings = styled(Readings)`
  width: 100%;
`;

const StyledGeoCompass = styled(GeoCompass)`
  box-sizing: border-box;
  height: 100%;
  min-height: 200px;
  width: auto;
  padding-top: 25px;
  padding-bottom: 15px;
  ${media.tablet`
    flex: 1;
    height: 70%; // kind of random value
    overflow: hidden;
  `};
`;

const ControlsSection = styled.div`
  ${media.tablet`
    box-sizing: border-box;
    display: flex;
    flex-flow: column;
    height: 100%;
    width: 45%;
    overflow: hidden;
    border-right: 2px solid ${props => props.theme.bgColorL40};
  `};
  ${media.desktop`
    width: 30%;
  `};
`;

const VisualizationsSection = styled.div`
  ${media.tablet`
    display: flex;
    flex-flow: column;
    width: 55%;
    height: 100%;
  `};
  ${media.desktop`
    flex-flow: row;
    width: 70%;
  `};
`;

const StyledSchmidtNet = styled(SchmidtNet)`
  min-height: 200px;
  ${media.tablet`
    width: 100%;
  `};
  ${media.desktop`
    width: 57.15%;
    height: 100%;
  `};
`;

const StyledContext = styled(Context)`
  box-sizing: border-box;
  min-height: 200px;
  border-top: 1px solid ${props => props.theme.bgColorL40};
  ${media.tablet`
    width: 100%;
    border-top: 2px solid ${props => props.theme.bgColorL40};
  `};
  ${media.desktop`
    width: 42.75%;
    height: 100%;
    border-top: 0;
    border-left: 2px solid ${props => props.theme.bgColorL40};
  `};
`;

const LogoContainer = styled.div`
  display: flex;
  position: absolute;
  left: 20px;
  top: 15px;
  /*
  right: 30px;
  bottom: 15px;
  */
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
`;

const StyledA = styled.a`
  opacity: 0.35;
  &:hover {
    opacity: 0.75;
  }
`;

/*
const FlexContainer = styled.div``;

const Empty = styled.div`
  width: 100%;
  height: 25%;
`;
*/

export default App;
