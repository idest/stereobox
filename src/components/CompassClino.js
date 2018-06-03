import React, { Component } from 'react';
import Compass from './Compass';
import Clino from './Clino';
import './styles/CompassClino.css';

class CompassClino extends Component {
  constructor(props) {
    super(props);
    this.radius = 40;
    this.clinoToCompassRatio = 2 / 3; //Height ratio
  }
  render() {
    return (
      <React.Fragment>
        <div className="compass">
          <Compass
            azimuth={this.props.azimuth}
            changePlaneState={this.props.changePlaneState}
            animateStateChange={this.props.animateStateChange}
            radius={this.radius}
          />
        </div>
        <div className="clino">
          <Clino
            azimuth={this.props.azimuth}
            dip={this.props.dip}
            radius={this.radius}
            clinoToCompassRatio={this.clinoToCompassRatio}
            changePlaneState={this.props.changePlaneState}
            animateStateChange={this.props.animateStateChange}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default CompassClino;
