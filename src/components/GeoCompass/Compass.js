import React, { Component } from 'react';
import CircleTicks from './shared/CircleTicks';
import NeedleLogic from './shared/NeedleLogic';
import Needle from './shared/Needle';
import CompassCardinalPoints from './CompassCardinalPoints';

class Compass extends Component {
  constructor(props) {
    super(props);
    this.preventSVGDrag = this.preventSVGDrag.bind(this);
    this.azColor = '#ff0000';
    this.azExtColor = '#0000ff';
    this.dipColor = '#00ff00';
  }
  preventSVGDrag(e) {
    e.preventDefault();
  }
  render() {
    const { radius: r, azimuth } = this.props;
    return (
      <svg
        viewBox="0 0 100 100"
        onDragStart={this.preventSVGDrag}
        style={{ width: '100%', height: '100%' }}
      >
        <g id="compassGroup" transform="translate(50,50)">
          <circle cx="0" cy="0" r={r} stroke="white" fill="transparent" />
          <CircleTicks
            step={Math.PI / 6}
            length={4}
            radius={r}
            rotation={-90}
            label={step => (180 * step / Math.PI).toFixed(0)}
          />
          <CircleTicks step={Math.PI / 18} length={2} radius={r} />
          <CompassCardinalPoints
            labels={['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']}
            fontSizes={[12, 6]}
            radius={r - 14}
          />
          <NeedleLogic
            onNeedleDrag={this.props.onNeedleDrag}
            onNeedleBackgroundClick={this.props.onNeedleBackgroundClick}
            needleCenterInSVGCoords={{ x: 50, y: 50 }}
            path={`M0,0 m ${r + 8},0
              a1,1 0 0 0 ${-2 * (r + 8)},0
              a1,1 0 0 0 ${2 * (r + 8)},0`}
          >
            <Needle
              id="azimuth"
              color={this.azColor}
              angle={Math.PI * azimuth / 180 - Math.PI / 2}
              length={r}
            />
            <Needle
              id="dipDirection"
              color={this.dipColor}
              angle={Math.PI * azimuth / 180}
              length={r * 0.5}
            />
            <Needle
              id="azimuthExt"
              color={this.azExtColor}
              angle={Math.PI * azimuth / 180 + Math.PI / 2}
              length={r}
            />
          </NeedleLogic>
          <circle stroke="white" fill="white" r="0.4" cx="0" cy="0" />
        </g>
      </svg>
    );
  }
}

export default Compass;
