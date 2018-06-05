import React, { Component } from 'react';
import styled from 'styled-components';

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
        <LineWrapper
          id={id}
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

const LineWrapper = styled.line`
  cursor: pointer;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

export default Needle;
