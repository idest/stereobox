import React, { Component } from 'react';

class CompassContainer extends Component {
  constructor(props) {
    super(props);
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
  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onNeedleDrag: this.onNeedleDrag,
        onNeedleBackgroundClick: this.onNeedleBackgroundClick,
        azimuth: this.props.azimuth
      })
    );
  }
}

export default CompassContainer;
