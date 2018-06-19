import React from 'react';
import styled, { withTheme } from 'styled-components';
import threeEntryPoint from '../../three/threeEntryPoint';
import EventBus from '../../three/helpers/eventbus';
import Slider from '../Gui/Slider';
import Checkbox from '../Gui/Checkbox';
import Button from '../Gui/Button';
import Expander from '../Gui/Expander';

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.threeRootElement = React.createRef();
    this.eventBus = new EventBus();
    this.handleCameraReset = this.handleCameraReset.bind(this);
    this.handleWireframeChange = this.handleWireframeChange.bind(this);
    this.handlePlaneTrimChange = this.handlePlaneTrimChange.bind(this);
    this.handlePlaneOpacityChange = this.handlePlaneOpacityChange.bind(this);
  }
  componentDidMount() {
    const initialProps = {
      ...this.props,
      r1: 1.3,
      r2: 1.5
    };
    threeEntryPoint(this.threeRootElement.current, initialProps, this.eventBus);
  }
  handleCameraReset() {
    this.eventBus.post('resetCamera');
  }
  handleWireframeChange(checked) {
    this.eventBus.post('wireframeChange', checked);
  }
  handlePlaneTrimChange(checked) {
    this.eventBus.post('planeTrimChange', checked);
  }
  handlePlaneOpacityChange(planeOpacity) {
    console.log('react fired');
    this.eventBus.post('planeOpacityChange', planeOpacity);
  }
  render() {
    this.eventBus.post('propsUpdate', { ...this.props });
    return (
      <ContextContainer className={this.props.className}>
        <StyledExpander height={120}>
          <Gui>
            <Checkbox
              title="Wireframe"
              callback={this.handleWireframeChange}
              checked={false}
            />
            <Checkbox
              title="Trim plane"
              callback={this.handlePlaneTrimChange}
              checked={true}
            />
            <Slider
              title="Plane opacity"
              callback={this.handlePlaneOpacityChange}
            />
            <Button onClick={this.handleCameraReset}>Reset Camera</Button>
          </Gui>
        </StyledExpander>
        <ThreeContainer innerRef={this.threeRootElement} />
      </ContextContainer>
    );
  }
}

const ContextContainer = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
`;

const ThreeContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const StyledExpander = styled(Expander)``;

const Gui = styled.div`
  box-sizing: border-box;
  height: 100%;
  display: grid;
  grid-auto-rows: 1fr;
  font-size: 0.7em;
`;

export default withTheme(Context);
