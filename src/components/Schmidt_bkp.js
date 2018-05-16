import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { select } from 'd3-selection';
import { geoPath, geoGraticule, geoAzimuthalEqualArea } from 'd3-geo';
import nj from 'numjs';
import { sph2cart, cart2sph, rot, rotateSph } from '../logic/sphere';
import './Schmidt.css';

class Schmidt extends Component {
  constructor(props) {
    super(props);
    this.createSchmidtNet = this.createSchmidtNet.bind(this);
  }
  componentDidMount() {
    this.createSchmidtNet();
  }
  componentDidUpdate() {
    this.createSchmidtNet();
  }
  shouldComponentUpdate() {
    this.createSchmidtNet();
    return false;
  }
  createSchmidtNet() {
    var svg = select(ReactDOM.findDOMNode(this.node)),
      width = +svg.attr('width'),
      height = +svg.attr('height');
    var projection = geoAzimuthalEqualArea()
      .scale(100)
      .translate([width / 2, height / 2])
      .precision(0.1)
      .clipAngle(90);
    var path = geoPath().projection(projection);
    var graticule = geoGraticule();
    svg
      .append('defs')
      .append('path')
      .attr('id', 'sphere')
      .attr('d', path({ type: 'Sphere' }));
    svg
      .append('use')
      .attr('class', 'fill')
      .attr('xlink:href', '#sphere');
    svg
      .append('path')
      .attr('class', 'graticule')
      .attr('d', path(graticule()));
    const az = this.props.sketchProps.azimuth,
      dip = this.props.sketchProps.dip;
    const plane = [this.props.sketchProps.azimuth, this.props.sketchProps.dip];
    const e1 = [0, 0];
    const aux1 = [90, 0];
    const aux2 = rotateSph(aux1, e1, 270 - az);
    const aux2Right = rotateSph(aux1, e1, 180 - az);
    const aux2Left = rotateSph(aux1, e1, 360 - az);
    const e2 = aux2Right;
    const p = rotateSph(aux2, e2, dip);
    console.log('aux2', aux2[0] + 1, aux2[1] - 1);
    console.log('aux2Right', aux2Right[0] + 1, aux2Right[1] - 1);
    console.log('aux2Left', aux2Left[0] + 1, aux2Left[1] - 1);
    console.log('p', p[0], p[1]);
    var arcsData = [
      {
        type: 'LineString',
        coordinates: [
          [...aux2Right].reverse(),
          [...p].reverse(),
          [...aux2Left].reverse()
        ]
      }
    ];
    var arcs = svg.selectAll('arc').data(arcsData);
    arcs
      .enter()
      .append('path')
      .attr('class', 'arc')
      .attr('d', path);
  }
  render() {
    return (
      <svg
        className="svg"
        ref={node => (this.node = node)}
        width={500}
        height={500}
      />
    );
  }
}

export default Schmidt;
