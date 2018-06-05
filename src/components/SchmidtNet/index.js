import React, { Component } from 'react';
import { geoPath, geoGraticule, geoAzimuthalEqualArea } from 'd3-geo';
import { rotateSph } from '../../logic/sphere';
import styled from 'styled-components';

class SchmidtNet extends Component {
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
    return [
      [...aux2Right].reverse(),
      [...p].reverse(),
      [...aux2Left].reverse()
    ];
  }
  render() {
    const path = this.createSchmidtNet(this.state.width, this.state.height);
    const coordinates = this.updateSchmidtNet();
    return (
      <BackgroundSvg
        className="svg"
        innerRef={this.svg}
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <SpherePath id="sphere" d={path({ type: 'Sphere' })} />
          <GraticulePath id="graticule" d={path(geoGraticule()())} />
        </defs>
        <use href="#sphere" />
        <use href="#graticule" />
        <SpherePath
          className="arc"
          d={path({ type: 'LineString', coordinates: coordinates })}
        />
      </BackgroundSvg>
    );
  }
}

const BackgroundSvg = styled.svg`
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const GraticulePath = styled.path`
  fill: none;
  stroke: #dcdcdc;
  stroke-width: 0.5px;
  stroke-opacity: 0.5;
`;
const SpherePath = styled.path`
  fill: none;
  stroke: #dcdcdc;
  stroke-width: 1px;
  stroke-opacity: 1;
`;

export default SchmidtNet;
