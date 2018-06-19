import React, { Component } from 'react';

class ClinoCardinalTags extends Component {
  getCardinalTags(azimuth) {
    if (!Number.isNaN(azimuth)) {
      let az = Math.round(azimuth);
      let rightCardinal;
      let leftCardinal;
      if (az === 0 || az === 180 || az === 360) {
        rightCardinal = 'E';
        leftCardinal = 'W';
      } else if (az === 90 || az === 270) {
        rightCardinal = 'N';
        leftCardinal = 'S';
      } else if ((az > 0 && az < 90) || (az > 180 && az < 270)) {
        rightCardinal = 'SE';
        leftCardinal = 'NW';
      } else if ((az > 90 && az < 180) || (az > 270 && az < 360)) {
        rightCardinal = 'NE';
        leftCardinal = 'SW';
      } else {
        return;
      }
      return { left: leftCardinal, right: rightCardinal };
    }
    return { left: null, right: null };
  }
  render() {
    const cardinalTags = this.getCardinalTags(this.props.azimuth);
    return (
      <g
        className={this.props.className}
        fontSize="6"
        textAnchor="middle"
        strokeWidth="0.1"
      >
        <text x={this.props.radius - 10} y={-3}>
          {cardinalTags.right}
        </text>
        <text x={-this.props.radius + 10} y={-3}>
          {cardinalTags.left}
        </text>
      </g>
    );
  }
}

export default ClinoCardinalTags;
