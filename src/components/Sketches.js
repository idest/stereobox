import React from 'react';
//import P5Wrapper from './lib/P5Wrapper';
import { Sketch } from './lib/sketch';
import compass from '../sketches/compass';
import clino from '../sketches/clino';
import Schmidt from './Schmidt';
import './Sketches.css';

class Sketches extends React.Component {
  render() {
    let sketchProps = {
      azimuth: this.props.azimuth,
      dip: this.props.dip,
      changePlaneState: this.props.changePlaneState
    };
    return (
      <div className="sketches">
        <div className="sketch compass-clino">
          <div className="sketch compass">
            <Sketch sketch={compass} sketchProps={sketchProps} />
          </div>
          <div className="sketch clino">
            <Sketch sketch={clino} sketchProps={sketchProps} />
          </div>
        </div>
        <div className="sketch schmidt">
          <Schmidt sketchProps={sketchProps} />
        </div>
        <div className="sketch context">
          <p style={{ color: 'darkgray' }}>Wait for it...</p>
        </div>
      </div>
    );
  }
}
export default Sketches;
