import React, { Component } from 'react';

class ClinoContainer extends Component {
  constructor(props) {
    super(props);
    this.onNeedleDrag = this.onNeedleDrag.bind(this);
    this.onNeedleBackgroundClick = this.onNeedleBackgroundClick.bind(this);
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
  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onNeedleDrag: this.onNeedleDrag,
        onNeedleBackgroundClick: this.onNeedleBackgroundClick,
        azimuth: this.props.azimuth,
        dipNeedleAngle: this.getDipNeedleAngle(
          this.props.azimuth,
          this.props.dip
        )
      })
    );
  }
}

export default ClinoContainer;
