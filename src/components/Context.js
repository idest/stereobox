import React from 'react';
import threeEntryPoint from '../three/threeEntryPoint';
import './Context.css';

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.threeRootElement = React.createRef();
  }
  componentDidMount() {
    threeEntryPoint(this.threeRootElement);
  }
  render() {
    return <div ref={this.threeRootElement} />;
  }
}

export default Context;
