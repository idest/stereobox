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
import description from '../../locales/en/Context.md';
import { HelpConsumer } from '../App.js';

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.threeRootElement = React.createRef();
    this.eventBus = new EventBus();
    this.handleCameraReset = this.handleCameraReset.bind(this);
    this.handleWireframeChange = this.handleWireframeChange.bind(this);
    this.handlePlaneTrimChange = this.handlePlaneTrimChange.bind(this);
    this.handlePlaneOpacityChange = this.handlePlaneOpacityChange.bind(this);
    this.state = {
      planeOpacity: 0.5,
      planeTrim: true,
      sphereWireframe: true
    };
    this.initialState = this.state;
  }
  componentDidMount() {
    const initialProps = {
      ...this.props,
      ...this.state,
      r1: 1.3,
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
  render() {
    this.eventBus.post('propsUpdate', { ...this.props, ...this.state });
    return (
      <HelpConsumer>
        {showHelp => (
          <Container>
            <Header>3D view</Header>
            <WithDescription text={description} show={showHelp}>
              <ThreeContainer innerRef={this.threeRootElement} />
            </WithDescription>
            <Expander height={120}>
              <Gui>
                <Checkbox
                  title="Wireframe"
                  callback={this.handleWireframeChange}
                  initialValue={this.state.sphereWireframe}
                />
                <Checkbox
                  title="Trim plane"
                  callback={this.handlePlaneTrimChange}
                  initialValue={this.state.planeTrim}
                />
                <Slider
                  title="Plane opacity"
                  callback={this.handlePlaneOpacityChange}
                  initialValue={this.state.planeOpacity}
                />
                <Button onClick={this.handleCameraReset}>Reset Camera</Button>
              </Gui>
            </Expander>
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
