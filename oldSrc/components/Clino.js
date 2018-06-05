import React, { Component } from 'react';
import CircleTicks from './lib/CircleTicks';
import NeedleLogic from './lib/NeedleLogic';
import Needle from './lib/Needle';

class Clino extends Component {
  constructor(props) {
    super(props);
    this.preventSVGDrag = this.preventSVGDrag.bind(this);
    this.onNeedleDrag = this.onNeedleDrag.bind(this);
    this.onNeedleBackgroundClick = this.onNeedleBackgroundClick.bind(this);
    this.viewBoxHeight = this.props.clinoToCompassRatio * 100;
    this.clinoDY = (this.viewBoxHeight - this.props.radius) / 2;
  }
  getDipNeedleAngle(azimuth, dip) {
    let dipNeedleAngle;
    if (!Number.isNaN(dip) && !Number.isNaN(azimuth)) {
      let az = Math.round(azimuth);
      dipNeedleAngle = az >= 90 && az < 270 ? 180 - dip : dip;
    }
    return dipNeedleAngle;
  }
  getPlaneFromDipNeedleAngle(azimuth, dipNeedleAngle) {
    let newAz;
    let newDip;
    if (!Number.isNaN(dipNeedleAngle) && !Number.isNaN(azimuth)) {
      let az = Math.round(azimuth);
      if (dipNeedleAngle > 90) {
        newAz = az >= 90 && az < 270 ? az : az + 180;
        newAz = newAz > 360 ? newAz - 360 : newAz;
        newDip = 180 - dipNeedleAngle;
      } else {
        newAz = az >= 90 && az < 270 ? az + 180 : az;
        newAz = newAz > 360 ? newAz - 360 : newAz;
        newDip = dipNeedleAngle;
      }
      return { az: newAz, dip: newDip };
    }
  }
  dipAnimationUpdater(dipNeedleAngle, newDipNeedleAngle) {
    const updater = () => {
      const angleDiff = Math.abs(newDipNeedleAngle - dipNeedleAngle);
      if (angleDiff > 1) {
        dipNeedleAngle = 0.93 * dipNeedleAngle + 0.07 * newDipNeedleAngle;
        let { az, dip } = this.getPlaneFromDipNeedleAngle(
          this.props.azimuth,
          dipNeedleAngle
        );
        return { planeAzimuth: az, planeDip: dip };
      }
      return false;
    };
    return updater;
  }
  onNeedleDrag(needleId, currentMouseAngle) {
    currentMouseAngle =
      currentMouseAngle > 180 && currentMouseAngle < 270
        ? 179
        : currentMouseAngle;
    currentMouseAngle = currentMouseAngle > 270 ? 1 : currentMouseAngle;
    if (needleId === 'dip') {
      let { az, dip } = this.getPlaneFromDipNeedleAngle(
        this.props.azimuth,
        currentMouseAngle
      );
      this.props.changePlaneState({
        planeAzimuth: az,
        planeDip: dip,
        lastInput: 'CLI_DRAG'
      });
    }
  }
  onNeedleBackgroundClick(currentMouseAngle) {
    const newDipNeedleAngle = currentMouseAngle;
    const dipNeedleAngle = this.getDipNeedleAngle(
      this.props.azimuth,
      this.props.dip
    );
    const animationId = `CLI${currentMouseAngle}`;
    const stateUpdater = this.dipAnimationUpdater(
      dipNeedleAngle,
      newDipNeedleAngle
    );
    this.props.animateStateChange(stateUpdater, animationId);
  }
  preventSVGDrag(e) {
    e.preventDefault();
  }
  render() {
    const { radius: r, azimuth, dip } = this.props;
    const dipNeedleAngle = this.getDipNeedleAngle(azimuth, dip);
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
          <CardinalTags azimuth={azimuth} radius={r} />
          <NeedleLogic
            onNeedleDrag={this.onNeedleDrag}
            onNeedleBackgroundClick={this.onNeedleBackgroundClick}
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

class CardinalTags extends Component {
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
        stroke="white"
        fill="white"
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

export default Clino;
