import React from 'react';
import CompassClino from './CompassClino';
import Schmidt from './Schmidt';
import Context from './Context';
import './styles/Visualizations.css';

class Visualizations extends React.Component {
  render() {
    return (
      <div className="visualizations">
        <div className="viz compass-clino">
          <CompassClino
            azimuth={this.props.azimuth}
            dip={this.props.dip}
            changePlaneState={this.props.changePlaneState}
            animateStateChange={this.props.animateStateChange}
          />
        </div>
        <div className="viz schmidt">
          <Schmidt azimuth={this.props.azimuth} dip={this.props.dip} />
        </div>
        <div className="viz context">
          <Context azimuth={this.props.azimuth} dip={this.props.dip} />
        </div>
      </div>
    );
  }
}
//<p style={{ color: 'darkgray' }}>Wait for it....</p>
export default Visualizations;
