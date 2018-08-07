import React from 'react';
import styled, { withTheme } from 'styled-components';
import threeEntryPoint from '../../three/threeEntryPoint';
import EventBus from '../../three/helpers/eventbus';
import Slider from '../Gui/Slider';
import Checkbox from '../Gui/Checkbox';
import Button from '../Gui/Button';
import Expander from '../Gui/Expander';
import Header from '../styled/Header';
import WithDescription from '../shared/WithDescription';
import { HelpConsumer } from '../App.js';
import enMessages from '../../locales/context/en/messages.json';
import esMessages from '../../locales/context/es/messages.json';
import enHelp from '../../locales/context/en/help.md';
import esHelp from '../../locales/context/es/help.md';

const messages = {
  en: enMessages,
  es: esMessages
};

const help = {
  en: enHelp,
  es: esHelp
};

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.threeRootElement = React.createRef();
    this.eventBus = new EventBus();
    this.handleCameraReset = this.handleCameraReset.bind(this);
    this.handleWireframeChange = this.handleWireframeChange.bind(this);
    this.handlePlaneTrimChange = this.handlePlaneTrimChange.bind(this);
    this.handlePlaneOpacityChange = this.handlePlaneOpacityChange.bind(this);
    this.handleToggleIndicators = this.handleToggleIndicators.bind(this);
    this.state = {
      planeOpacity: 0.75,
      planeTrim: false,
      sphereWireframe: true,
      showIndicators: true
    };
    this.initialState = this.state;
  }
  componentDidMount() {
    const initialProps = {
      ...this.props,
      ...this.state,
      r1: 1.4,
      r2: 1.5
    };
    threeEntryPoint(this.threeRootElement.current, initialProps, this.eventBus);
  }
  handleCameraReset() {
    this.eventBus.post('resetCamera');
  }
  handleWireframeChange(checked) {
    this.setState({ sphereWireframe: checked });
    //this.eventBus.post('wireframeChange', checked);
  }
  handlePlaneTrimChange(checked) {
    this.setState({ planeTrim: checked });
    //this.eventBus.post('planeTrimChange', checked);
  }
  handlePlaneOpacityChange(planeOpacity) {
    this.setState({ planeOpacity: planeOpacity });
    //this.eventBus.post('planeOpacityChange', planeOpacity);
  }
  handleToggleIndicators(checked) {
    this.setState({ showIndicators: checked });
  }
  render() {
    const { locale } = this.props;
    this.eventBus.post('propsUpdate', { ...this.props, ...this.state });
    return (
      <HelpConsumer>
        {showHelp => (
          <Container>
            <Header showNumber={showHelp} number="4.">
              {messages[locale].title}
            </Header>
            <WithDescription text={help[locale]} show={showHelp}>
              <ThreeContainer innerRef={this.threeRootElement} />
              <Button onClick={this.handleCameraReset}>
                {messages[locale].resetCamera}
              </Button>
              <Expander title={messages[locale].appearance} height={135}>
                <Gui>
                  <Checkbox
                    title={messages[locale].wireframe}
                    callback={this.handleWireframeChange}
                    initialValue={this.state.sphereWireframe}
                  />
                  <Checkbox
                    title={messages[locale].trimPlane}
                    callback={this.handlePlaneTrimChange}
                    initialValue={this.state.planeTrim}
                  />
                  <Checkbox
                    title={messages[locale].showIndicators}
                    callback={this.handleToggleIndicators}
                    initialValue={this.state.showIndicators}
                  />
                  <Slider
                    title={messages[locale].planeOpacity}
                    callback={this.handlePlaneOpacityChange}
                    initialValue={this.state.planeOpacity}
                  />
                </Gui>
              </Expander>
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
`;

const ThreeContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const Gui = styled.div`
  box-sizing: border-box;
  height: 100%;
  display: grid;
  grid-auto-rows: 1fr;
  font-size: 0.7em;
`;

export default withTheme(Context);
