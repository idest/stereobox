import React, { Component } from 'react';

class CompassCardinalPoints extends Component {
  constructor(props) {
    super(props);
    this.cardinalPoints = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  }
  render() {
    const { labels, fontSizes, radius } = this.props;
    const labelTypes = fontSizes ? labels.length / 4 : null;
    return (
      <React.Fragment>
        {labels.map((label, i) => {
          const angle = (i * 2 * Math.PI) / labels.length;
          const size = fontSizes ? fontSizes[i % labelTypes] : 12;
          const x = Math.sin(angle);
          const y = Math.cos(angle);
          return (
            <g key={i}>
              <text
                className={this.props.className}
                x={x * radius}
                y={-y * radius}
                textAnchor="middle"
                dy="0.4em"
                fontSize={`${size}`}
                strokeWidth="0.1"
              >
                {label}
              </text>
            </g>
          );
        })}
      </React.Fragment>
    );
  }
}

export default CompassCardinalPoints;
