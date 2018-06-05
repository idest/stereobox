import React, { Component } from 'react';
import CircleTicks from './lib/CircleTicks';
import NeedleLogic from './lib/NeedleLogic';
import Needle from './lib/Needle';

class Compass extends Component {
  constructor(props) {
    super(props);
    this.preventSVGDrag = this.preventSVGDrag.bind(this);
    this.onNeedleDrag = this.onNeedleDrag.bind(this);
    this.onNeedleBackgroundClick = this.onNeedleBackgroundClick.bind(this);
    this.azColor = '#ff0000';
    this.azExtColor = '#0000ff';
    this.dipColor = '#00ff00';
  }
  azimuthAnimationUpdater(azimuth, newAzimuth) {
    let az = azimuth;
    const newAz = newAzimuth;
    const modAz = (azToMod, azDiff) => {
      let azMod = azToMod;
      if (azDiff > 180) {
        if (newAz > azToMod) {
          azMod = newAz + (360 - azDiff);
        } else {
          azMod = newAz - (360 - azDiff);
        }
      }
      return azMod;
    };
    const fixAz = azToFix => {
      let azFix = azToFix;
      if (azToFix < 0) {
        azFix = azToFix + 360;
      } else {
        azFix = azToFix % 360;
      }
      return azFix;
    };
    const updater = () => {
      const azDiff = Math.abs(newAz - az);
      if (azDiff > 2) {
        az = modAz(az, azDiff);
        az = 0.93 * az + 0.07 * newAz;
        az = fixAz(az);
        return { planeAzimuth: az };
      }
      return false;
    };
    return updater;
  }
  onNeedleDrag(needleId, currentMouseAngle) {
    let fixedMouseAngle = currentMouseAngle + 90;
    fixedMouseAngle =
      fixedMouseAngle > 360 ? fixedMouseAngle - 360 : fixedMouseAngle;
    let newAzimuth;
    if (needleId === 'azimuth') {
      newAzimuth = fixedMouseAngle;
    } else if (needleId === 'azimuthExt') {
      newAzimuth = fixedMouseAngle - 180;
    } else if (needleId === 'dipDirection') {
      newAzimuth = fixedMouseAngle - 90;
    }
    newAzimuth = newAzimuth < 0 ? newAzimuth + 360 : newAzimuth;
    this.props.changePlaneState({
      planeAzimuth: newAzimuth,
      lastInput: 'COM_DRAG'
    });
  }
  onNeedleBackgroundClick(currentMouseAngle) {
    let newAzimuth = currentMouseAngle + 90;
    newAzimuth = newAzimuth > 360 ? newAzimuth - 360 : newAzimuth;
    const animationId = `COM${currentMouseAngle}`;
    const stateUpdater = this.azimuthAnimationUpdater(
      this.props.azimuth,
      newAzimuth
    );
    this.props.animateStateChange(stateUpdater, animationId);
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
          <CardinalPoints
            labels={['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']}
            fontSizes={[12, 6]}
            radius={r - 14}
          />
          <NeedleLogic
            onNeedleDrag={this.onNeedleDrag}
            onNeedleBackgroundClick={this.onNeedleBackgroundClick}
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

class CardinalPoints extends Component {
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
          const angle = i * 2 * Math.PI / labels.length;
          const size = fontSizes ? fontSizes[i % labelTypes] : 12;
          const x = Math.sin(angle);
          const y = Math.cos(angle);
          return (
            <g key={i}>
              <text
                x={x * radius}
                y={-y * radius}
                stroke="white"
                fill="white"
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

export default Compass;
