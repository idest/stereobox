import React from 'react';
import { Sketch } from './lib/Sketch';
import compass from '../p5/compass';
import clino from '../p5/clino';
import Schmidt from './Schmidt';
import Context from './Context';
import './Visualizations.css';

class Visualizations extends React.Component {
  render() {
    let sketchProps = {
      azimuth: this.props.azimuth,
      dip: this.props.dip,
      changePlaneState: this.props.changePlaneState
    };
    return (
      <div className="visualizations">
        <div className="viz compass-clino">
          <div className="viz compass">
            <Sketch sketch={compass} sketchProps={sketchProps} />
          </div>
          <div className="viz clino">
            <Sketch sketch={clino} sketchProps={sketchProps} />
          </div>
        </div>
        <div className="viz schmidt">
          <Schmidt azimuth={this.props.azimuth} dip={this.props.dip} />
        </div>
        <div className="viz context">
          <p style={{ color: 'darkgray' }}>Wait for it....</p>
        </div>
      </div>
    );
  }
}
export default Visualizations;
