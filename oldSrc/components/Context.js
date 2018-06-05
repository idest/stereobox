import React from 'react';
//import * as THREE from '../three/lib/three';
import threeEntryPoint from '../three/threeEntryPoint';
import './styles/Context.css';
import EventBus from '../three/helpers/eventbus';

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.threeRootElement = React.createRef();
    this.eventBus = new EventBus();
    this.handleResetButtonClick = this.handleResetButtonClick.bind(this);
    this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
  }
  componentDidMount() {
    const initialProps = {
      ...this.props,
      r1: 1.3,
      r2: 1.5
    };
    threeEntryPoint(this.threeRootElement.current, initialProps, this.eventBus);
  }
  handleResetButtonClick() {
    this.eventBus.post('resetControls');
  }
  handleToggleButtonClick() {
    this.eventBus.post('toggleWireframe');
  }
  render() {
    this.eventBus.post('propsUpdate', { ...this.props });
    return (
      <div className="contextContainer">
        <div className="threeContainer" ref={this.threeRootElement} />
        <div className="buttons">
          <button className="button" onClick={this.handleResetButtonClick}>
            Reset Camera
          </button>
          <button className="button" onClick={this.handleToggleButtonClick}>
            {' '}
            Toggle Wireframe{' '}
          </button>
        </div>
      </div>
    );
  }
}

export default Context;
