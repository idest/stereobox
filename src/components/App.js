import React from 'react';
import Readings from './Readings';
import GeoCompass from './GeoCompass';
import Stereonet from './Stereonet';
import Context from './Context';
import { ThemeProvider } from 'styled-components';
import theme from '../utils/theme';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { MobileLayout, DesktopLayout } from './Layouts';

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
  componentDidMount() {
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
    if (newPlaneState) {
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
    const Layout = isMobile ? MobileLayout : DesktopLayout;
    const locale = this.props.locale;
    return (
      <ThemeProvider theme={theme}>
        <HelpProvider value={this.state.showHelp}>
          <Layout
            showHelp={this.state.showHelp}
            toggleHelp={this.toggleHelp}
            locale={locale}
          >
            <Readings
              name="readings"
              azimuth={this.state.planeAzimuth}
              dip={this.state.planeDip}
              lastInput={this.state.lastInput}
              changePlaneState={this.changePlaneState}
              locale={locale}
            />
            <GeoCompass
              name="geocompass"
              azimuth={this.state.planeAzimuth}
              dip={this.state.planeDip}
              changePlaneState={this.changePlaneState}
              animateStateChange={this.animateStateChange}
              locale={locale}
            />
            <Stereonet
              name="stereonet"
              azimuth={this.state.planeAzimuth}
              dip={this.state.planeDip}
              locale={locale}
              changePlaneState={this.changePlaneState}
            />
            <Context
              name="context"
              azimuth={this.state.planeAzimuth}
              dip={this.state.planeDip}
              locale={locale}
            />
          </Layout>
        </HelpProvider>
      </ThemeProvider>
    );
  }
}

class LocalizedApp extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" render={() => <App locale="en" />} />
          <Route exact path="/es" render={() => <App locale="es" />} />
        </Switch>
      </Router>
    );
  }
}

export { HelpConsumer };

export default LocalizedApp;
