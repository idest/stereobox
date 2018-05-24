import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
//import { select } from 'd3-selection';
import { geoPath, geoGraticule, geoAzimuthalEqualArea } from 'd3-geo';
//import nj from 'numjs';
import { rotateSph } from '../logic/sphere';
import './Schmidt.css';

class Schmidt extends Component {
  constructor(props) {
    super(props);
    this.updateSchmidtNet = this.updateSchmidtNet.bind(this);
    this.createSchmidtNet = this.createSchmidtNet.bind(this);
    this.svg = React.createRef();
    this.state = { width: 0, height: 0 };
  }
  componentDidMount() {
    const clientRect = this.svg.current.getBoundingClientRect();
    this.setState({ width: clientRect.width, height: clientRect.height });
  }
  createSchmidtNet(width, height) {
    var projection = geoAzimuthalEqualArea()
      .scale(100)
      .translate([width / 2, height / 2])
      .precision(0.1)
      .clipAngle(90);
    return geoPath().projection(projection);
  }
  updateSchmidtNet() {
    const az = this.props.azimuth,
      dip = this.props.dip,
      e1 = [0, 0],
      aux1 = [90, 0],
      aux2 = rotateSph(aux1, e1, 270 - az),
      aux2Right = rotateSph(aux1, e1, 180 - az),
      aux2Left = rotateSph(aux1, e1, 360 - az),
      e2 = aux2Right,
      p = rotateSph(aux2, e2, dip);
    console.log('aux2', aux2[0] + 1, aux2[1] - 1);
    console.log('aux2Right', aux2Right[0] + 1, aux2Right[1] - 1);
    console.log('aux2Left', aux2Left[0] + 1, aux2Left[1] - 1);
    console.log('p', p[0], p[1]);
    return [
      [...aux2Right].reverse(),
      [...p].reverse(),
      [...aux2Left].reverse()
    ];
  }
  render() {
    const path = this.createSchmidtNet(this.state.width, this.state.height);
    const coordinates = this.updateSchmidtNet();
    console.log('path', this.path);
    console.log('graticule', this.graticule);
    return (
      <svg
        className="svg"
        ref={this.svg}
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <path id="sphere" d={path({ type: 'Sphere' })} />
          <path id="graticule" d={path(geoGraticule()())} />
        </defs>
        <use class="fill" href="#sphere" />
        <use class="fill" href="#graticule" />
        <path
          class="arc"
          d={path({ type: 'LineString', coordinates: coordinates })}
        />
      </svg>
    );
  }
}

export default Schmidt;
