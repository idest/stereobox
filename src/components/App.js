import React from 'react';
import Readings from './Readings';
import GeoCompass from './GeoCompass';
import SchmidtNet from './SchmidtNet';
import Context from './Context';
import Tabs from './Tabs';
import Tab from './Tabs/Tab';
import styled, { ThemeProvider } from 'styled-components';
import { media } from '../utils/style';
import logo from '../assets/logo.png';
import theme from '../utils/theme';
import HelpIcon from '../assets/question-circle';

const {
  Provider: HelpProvider,
  Consumer: HelpConsumer
} = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.changePlaneState = this.changePlaneState.bind(this);
    this.animateStateChange = this.animateStateChange.bind(this);
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
    this.state = {
      planeAzimuth: 45,
      planeDip: 45,
      lastInput: 'AZ',
      lastAnimationId: null,
      windowWidth: window.innerWidth,
      showHelp: false
    };
  }
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }
  toggleHelp() {
    this.setState({ showHelp: !this.state.showHelp });
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
          <HelpProvider value={this.state.showHelp}>
            <AppWrapper>
              <Content>
                <Readings
                  className="controls"
                  azimuth={this.state.planeAzimuth}
                  dip={this.state.planeDip}
                  lastInput={this.state.lastInput}
                  changePlaneState={this.changePlaneState}
                />
                <TabsWrapper>
                  <Tabs>
                    <Tab title="Compass">
                      <GeoCompassWrapper>
                        <GeoCompass
                          azimuth={this.state.planeAzimuth}
                          dip={this.state.planeDip}
                          changePlaneState={this.changePlaneState}
                          animateStateChange={this.animateStateChange}
                        />
                      </GeoCompassWrapper>
                    </Tab>
                    <Tab title="Stereonet">
                      <SchmidtNetWrapper>
                        <SchmidtNet
                          azimuth={this.state.planeAzimuth}
                          dip={this.state.planeDip}
                        />
                      </SchmidtNetWrapper>
                    </Tab>
                    <Tab title="3D Context">
                      <ContextWrapper>
                        <Context
                          azimuth={this.state.planeAzimuth}
                          dip={this.state.planeDip}
                        />
                      </ContextWrapper>
                    </Tab>
                  </Tabs>
                </TabsWrapper>
              </Content>
            </AppWrapper>
          </HelpProvider>
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={theme}>
          <HelpProvider value={this.state.showHelp}>
            <AppWrapper>
              <Title>Geo Compass</Title>
              <SubtitleContainer>
                <Subtitle>
                  An interactive tool to visualize planes using the
                  stereographic projection
                </Subtitle>
                <Icon>
                  <HelpIcon onClick={this.toggleHelp} />
                </Icon>
              </SubtitleContainer>
              <Content>
                <ControlsSection>
                  <ReadingsWrapper>
                    <Readings
                      className="controls"
                      azimuth={this.state.planeAzimuth}
                      dip={this.state.planeDip}
                      lastInput={this.state.lastInput}
                      changePlaneState={this.changePlaneState}
                    />
                  </ReadingsWrapper>
                  <GeoCompassWrapper>
                    <GeoCompass
                      azimuth={this.state.planeAzimuth}
                      dip={this.state.planeDip}
                      changePlaneState={this.changePlaneState}
                      animateStateChange={this.animateStateChange}
                    />
                  </GeoCompassWrapper>
                </ControlsSection>
                <VisualizationsSection>
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
                </VisualizationsSection>
              </Content>
              <LogoContainer>
                <StyledA href="https://idest.github.io">
                  <Logo src={logo} />
                </StyledA>
              </LogoContainer>
            </AppWrapper>
          </HelpProvider>
        </ThemeProvider>
      );
    }
  }
}

export { HelpConsumer };

const AppWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  height: 100%;
  min-height: 400px;
  width: auto;
  padding: 30px;
  justify-content: center;
  background: ${props => props.theme.bgColor};
  color: ${props => props.theme.fgColorD20};
  ${media.tablet`
    width: 640px;
    margin-left: auto;
    margin-right: auto;
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

const SubtitleContainer = styled.div`
  ${media.tablet`
    display: none;
  `};
  ${media.desktop`
    position: relative
    display: flex;
    flex-wrap: wrap;
    height: 2em;
    width: 100%;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 5px;
  `};
`;

const Subtitle = styled.h3`
  position: absolute;
  margin: 0;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  color: ${props => props.theme.fgColorD40};
  z-index: 0;
`;

const Icon = styled.span`
  display: flex;
  height: 20px;
  width: 20px;
  margin-left: auto;
  cursor: pointer;
  z-index: 1;
  > svg {
    width: 100%;
    height: 100%;
    fill: ${props => props.theme.fgColorD40};
    &:hover {
      fill: ${props => props.theme.fgColorD20};
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  border: solid 2px ${props => props.theme.bgColorL40};
  ${media.tablet`
    flex-direction: row;
    max-height: 500px;
  `};
`;

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden; //moz fix
`;

const ReadingsWrapper = styled.div``; // Geo..Wrapper overlaps Readings w/o this

const GeoCompassWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 200px; // if not present height gets really big in moz
`;

const ControlsSection = styled.div`
  ${media.tablet`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 45%;
    border-right: 2px solid ${props => props.theme.bgColorL40};
  `};
  ${media.desktop`
    width: 30%;
  `};
`;

const VisualizationsSection = styled.div`
  ${media.tablet`
    display: flex;
    flex-direction: column;
    width: 55%;
  `};
  ${media.desktop`
    flex-direction: row;
    width: 70%;
  `};
`;

const SchmidtNetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 200px;
  ${media.desktop`
    width: 57.15%;
  `};
`;

const ContextWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 200px;
  border-top: 1px solid ${props => props.theme.bgColorL40};
  ${media.tablet`
    border-top: 2px solid ${props => props.theme.bgColorL40};
  `};
  ${media.desktop`
    width: 42.75%;
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

export default App;
