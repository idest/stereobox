import React, { Component } from 'react';

class CircleTicks extends Component {
  shouldComponentUpdate() {
    return false;
  }
  getSteps(step, maxAngle) {
    const steps = [];
    const stopAngle = maxAngle ? maxAngle + 0.01 : 2 * Math.PI;
    for (let i = 0; i < stopAngle / step; i++) {
      const currentStep = i * step;
      steps.push(currentStep);
    }
    return steps;
  }
  getLabelRotation(stepDegrees, rotation) {
    const rot = rotation ? rotation : 0;
    const rightmostAngle = 0 - rot;
    const leftmostAngle = 180 - rot;
    const labelRotation =
      stepDegrees > rightmostAngle && stepDegrees < leftmostAngle
        ? stepDegrees - 90
        : stepDegrees + 90;
    return labelRotation;
  }
  render() {
    const { step, maxAngle, length, radius, rotation, label } = this.props;
    const steps = this.getSteps(step, maxAngle);
    return (
      <g transform={`rotate(${rotation})`}>
        {steps.map((step, i) => {
          const stepDegrees = (180 * step) / Math.PI;
          const labelRotation = this.getLabelRotation(stepDegrees, rotation);
          return (
            <Tick
              className={this.props.className}
              key={i}
              index={i}
              angle={step}
              length={length}
              radius={radius}
              labelRotation={labelRotation}
            >
              {label ? label(step) : null}
            </Tick>
          );
        })}
      </g>
    );
  }
}

class Tick extends Component {
  render() {
    const { index, angle, length, radius, labelRotation } = this.props;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    const labelPos = pos => pos * (radius + 5);
    return (
      <g
        key={index}
        stroke="black"
        fill="black"
        className={this.props.className}
      >
        <line
          x1={x * radius}
          x2={x * (radius - length)}
          y1={y * radius}
          y2={y * (radius - length)}
          strokeWidth="0.75"
        />
        <text
          x={labelPos(x)}
          y={labelPos(y)}
          fontSize="5"
          textAnchor="middle"
          transform={`rotate(${labelRotation}, ${labelPos(x)}, ${labelPos(y)})`}
          dy="0.4em"
          strokeWidth="0.25"
        >
          {this.props.children}
        </text>
      </g>
    );
  }
}

export default CircleTicks;
