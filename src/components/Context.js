import React from 'react';
//import * as THREE from '../three/lib/three';
import threeEntryPoint from '../three/threeEntryPoint';
import './Context.css';
import EventBus from '../helpers/eventbus';

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.threeRootElement = React.createRef();
    this.eventBus = new EventBus();
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  componentDidMount() {
    const initialProps = {
      ...this.props,
      r1: 1.2,
      r2: 1.5
    };
    threeEntryPoint(this.threeRootElement.current, initialProps, this.eventBus);
  }
  handleButtonClick() {
    this.eventBus.post('resetCamera');
  }
  render() {
    this.eventBus.post('propsUpdate', { ...this.props });
    return (
      <div className="contextContainer">
        <div className="threeContainer" ref={this.threeRootElement} />
        <button className="resetButton" onClick={this.handleButtonClick}>
          Reset Camera
        </button>
      </div>
    );
  }
}

export default Context;
