import React, { Component } from 'react';
import CircleTicks from './shared/CircleTicks';
import NeedleLogic from './shared/NeedleLogic';
import Needle from './shared/Needle';
import ClinoCardinalTags from './ClinoCardinalTags';

class Clino extends Component {
  constructor(props) {
    super(props);
    this.preventSVGDrag = this.preventSVGDrag.bind(this);
    this.viewBoxHeight = this.props.clinoToCompassRatio * 100;
    this.clinoDY = (this.viewBoxHeight - this.props.radius) / 2;
  }
  preventSVGDrag(e) {
    e.preventDefault();
  }
  render() {
    const { radius: r, azimuth, dipNeedleAngle } = this.props;
    const centerColor = azimuth >= 90 && azimuth < 270 ? '#ff0000' : '#0000ff';
    return (
      <svg
        viewBox={`0 0 100 ${this.viewBoxHeight}`}
        onDragStart={this.preventSVGDrag}
        style={{ width: '100%', height: '100%' }}
      >
        <g id="clinoGroup" transform={`translate(50,${this.clinoDY})`}>
          <path
            d="M0,0 m-40,0 a1,1 0 0 0 80,0 l-80,0"
            stroke="white"
            fill="transparent"
          />
          <CircleTicks
            step={Math.PI / 6}
            maxAngle={Math.PI}
            length={4}
            radius={r}
            label={step =>
              (180 * Math.atan(Math.abs(Math.tan(step))) / Math.PI).toFixed(0)
            }
          />
          <CircleTicks
            step={Math.PI / 18}
            maxAngle={Math.PI}
            length={2}
            radius={r}
          />
          <ClinoCardinalTags azimuth={azimuth} radius={r} />
          <NeedleLogic
            onNeedleDrag={this.props.onNeedleDrag}
            onNeedleBackgroundClick={this.props.onNeedleBackgroundClick}
            needleCenterInSVGCoords={{ x: 50, y: this.clinoDY }}
            path={`M0,0 l${r + 8},0 a1,1 0 0 1 ${-2 * (r + 8)},0 Z`}
          >
            <Needle
              id="dip"
              color="#ffff00"
              angle={Math.PI * dipNeedleAngle / 180}
              length={r}
            />
            <Needle
              id="dip"
              color="#00ff00"
              angle={dipNeedleAngle > 90 ? Math.PI : 0}
              length={0.5 * r}
            />
          </NeedleLogic>
          <circle
            stroke={centerColor}
            fill={centerColor}
            r="0.7"
            cx="0"
            cy="0"
          />
        </g>
      </svg>
    );
  }
}

export default Clino;
