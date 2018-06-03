import React, { Component } from 'react';
import '../styles/Needle.css';

class Needle extends Component {
  render() {
    const { id, color, angle, length } = this.props;
    const x = length * Math.cos(angle);
    const y = length * Math.sin(angle);
    return (
      <g>
        <line
          stroke={color}
          strokeWidth="1.4"
          fill="white"
          x1="0"
          x2={x}
          y1="0"
          y2={y}
        />
        <line
          id={id}
          className="needle"
          strokeWidth="10"
          stroke="transparent"
          fill="transparent"
          onMouseDown={this.props.handleMouseDown}
          x1="0"
          x2={x}
          y1="0"
          y2={y}
        />
      </g>
    );
  }
}

export default Needle;
