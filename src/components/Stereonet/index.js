import React, { Component } from 'react';
import styled from 'styled-components';
import { geoPath, geoGraticule, geoAzimuthalEqualArea } from 'd3-geo';
import {
  sph2cart,
  cart2sph,
  rotateSph,
  cross,
  haversine
} from '../../logic/sphere';
import { fixAz } from '../../logic/utils';
import Header from '../styled/Header';
import WithDescription from '../shared/WithDescription';
import { HelpConsumer } from '../App.js';
import enMessages from '../../locales/stereonet/en/messages.json';
import esMessages from '../../locales/stereonet/es/messages.json';
import enHelp from '../../locales/stereonet/en/help.md';
import esHelp from '../../locales/stereonet/es/help.md';

const messages = {
  en: enMessages,
  es: esMessages
};

const help = {
  en: enHelp,
  es: esHelp
};

class Stereonet extends Component {
  constructor(props) {
    super(props);
    //this.createStereonet = this.createStereonet.bind(this);
    this.getPlaneCoordinates = this.getPlaneCoordinates.bind(this);
    this.getPlaneFromAzAndDipChange.bind(this);
    this.svg = React.createRef();
    this.preventSVGDrag = this.preventSVGDrag.bind(this);
    this.state = {
      projection: null
    };
    //this.updateDimensions = this.updateDimensions.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.updateProjection = this.updateProjection.bind(this);
  }
  componentWillMount() {
    //console.log('componentWillMount called');
    this.setProjection();
  }
  componentDidMount() {
    //console.log('componentDidMount called');
    this.updateProjection();
    window.addEventListener('resize', this.updateProjection);
  }
  componentWillUnmount() {
    //console.log('componentWillUnmount called');
    window.removeEventListener('resize', this.updateProjection);
  }
  preventSVGDrag(e) {
    e.preventDefault();
  }
  setProjection() {
    //console.log('setProjection called');
    const projection = geoAzimuthalEqualArea()
      .precision(0.1)
      .clipAngle(90.01);
    this.setState({ projection: projection });
  }
  updateProjection() {
    //console.log('updateProjection called');
    const geojson = { type: 'Sphere' };
    const clientRect = this.svg.current.getBoundingClientRect();
    const pad = 20; //padding
    const projection = this.state.projection.fitExtent(
      [[pad, pad], [clientRect.width - pad, clientRect.height - pad]],
      geojson
    );
    this.setState({
      projection: projection
    });
  }
  getPlaneCoordinates() {
    const az = this.props.azimuth,
      dip = this.props.dip,
      centerCoords = [0, 0],
      northCoords = [0, 90],
      dipDirectionCoords = rotateSph(northCoords, centerCoords, 270 - az),
      azExtCoords = rotateSph(dipDirectionCoords, centerCoords, -90),
      azCoords = rotateSph(dipDirectionCoords, centerCoords, 90),
      dipCoords = rotateSph(dipDirectionCoords, azExtCoords, dip),
      poleCoords = rotateSph(dipCoords, azExtCoords, 90);
    return {
      plane: [azExtCoords, dipCoords, azCoords],
      dipDirection: dipDirectionCoords,
      azExt: azExtCoords,
      az: azCoords,
      dip: dipCoords,
      pole: poleCoords
    };
  }
  getPlaneFromAzAndDipChange(x, y) {
    const mouseCoords = this.state.projection.invert([x, y]);
    //TODO: keep this DRY by using this.getAngleFromCoords
    const centerVector = sph2cart([0, 0]),
      mouseVector = sph2cart(mouseCoords),
      azVector = cross(mouseVector, centerVector),
      azCoords = cart2sph(azVector),
      northCoords = [0, 90],
      azDistanceToNorth = haversine(azCoords, northCoords),
      az = mouseCoords[1] > 0 ? azDistanceToNorth : 360 - azDistanceToNorth,
      dipDirectionVector = cross(azVector, centerVector),
      dipDirectionCoords = cart2sph(dipDirectionVector),
      dip =
        Math.abs(mouseCoords[0]) > 90
          ? 90
          : haversine(dipDirectionCoords, mouseCoords) - 90;
    let newPlaneState;
    newPlaneState = { planeAzimuth: az, planeDip: dip, lastInput: 'SN' };
    return newPlaneState;
  }
  getPlaneFromAzChange(x, y, pointId) {
    const mouseCoords = this.state.projection.invert([x, y]);
    const mouseAngle = this.getAngleFromCoords(mouseCoords);
    let correction;
    if (pointId === 'az') {
      correction = 0;
    } else if (pointId === 'azExt') {
      correction = 180;
    } else {
      correction = -90;
    }
    const correctedAz = fixAz(mouseAngle + correction);
    return { planeAzimuth: correctedAz, lastInput: 'SN' };
  }
  getPlaneFromDipChange(x, y, pointId) {
    const mouseCoords = this.state.projection.invert([x, y]);
    const currentAz = this.props.azimuth;
    const centerCoords = [0, 0],
      northCoords = [0, 90],
      dipDirectionCoords = rotateSph(
        northCoords,
        centerCoords,
        270 - currentAz
      ),
      az =
        haversine(dipDirectionCoords, mouseCoords) >= 90
          ? fixAz(currentAz + 180)
          : currentAz;
    let dip =
      Math.abs(mouseCoords[0]) > 90
        ? 0
        : haversine(dipDirectionCoords, mouseCoords);
    dip = Math.abs(dip) > 90 ? 90 : dip;
    return { planeAzimuth: az, planeDip: dip, lastInput: 'SN' };
  }
  getAngleFromCoords(coords) {
    const centerCoords = [0, 0];
    const northCoords = [0, 90];
    const centerVector = sph2cart(centerCoords);
    const aux = cross(centerVector, sph2cart(coords));
    const bearingCoords = cart2sph(cross(aux, centerVector));
    const distanceToNorth = haversine(bearingCoords, northCoords);
    const mouseAngle = coords[0] > 0 ? distanceToNorth : 360 - distanceToNorth;
    return mouseAngle;
  }
  handleMouseDown(e) {
    //console.log('handleMouseDown called');
    this.setState({
      mouseDown: true,
      clickedPoint: e.target.id
    });
  }
  handleMouseUp() {
    //console.log('handleMouseUp called');
    if (this.state.clickedPoint === 'pole') {
      this.setState({ mouseDown: false });
    } else {
      // avoid click after mouseUp
      setTimeout(() => {
        this.setState({ mouseDown: false });
      }, 1);
    }
  }
  handleMouseMove(e) {
    //console.log('handleMouseMove called');
    if (!this.state.mouseDown) {
      return;
    }
    const pointId = this.state.clickedPoint;
    const { x, y } = this.getEventCoordinates(e);
    let newPlaneState = undefined;
    if (pointId === 'pole') {
      newPlaneState = this.getPlaneFromAzAndDipChange(x, y);
    } else if (pointId === 'dip') {
      newPlaneState = this.getPlaneFromDipChange(x, y);
    } else {
      newPlaneState = this.getPlaneFromAzChange(x, y, pointId);
    }
    this.props.changePlaneState(newPlaneState);
  }
  handleClick(e) {
    //console.log('handleMouseClick called');
    if (this.state.mouseDown === false) {
      const { x, y } = this.getEventCoordinates(e);
      const newPlaneState = this.getPlaneFromAzAndDipChange(x, y);
      this.props.changePlaneState(newPlaneState);
    }
  }
  getEventCoordinates(e) {
    const svg = e.target.ownerSVGElement;
    const transform = svg.getScreenCTM().inverse();
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const localPoint = point.matrixTransform(transform);
    return { x: localPoint.x, y: localPoint.y };
  }
  render() {
    const { locale } = this.props;
    //const path = this.createStereonet();
    const path = geoPath()
      .projection(this.state.projection)
      .pointRadius(4);
    const outerPointPath = geoPath()
      .projection(this.state.projection)
      .pointRadius(10);
    const planeCoordinates = this.getPlaneCoordinates();
    return (
      <HelpConsumer>
        {showHelp => (
          <Container>
            <Header showOrder={showHelp} order="A)">
              {messages[locale].title}
            </Header>
            <WithDescription text={help[locale]} show={showHelp}>
              <SvgWrapper>
                <Svg innerRef={this.svg} onDragStart={this.preventSVGDrag}>
                  <g
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    onMouseLeave={this.handleMouseUp}
                    onClick={this.handleClick}
                  >
                    <Rect
                      height="100%"
                      width="100%"
                      fill="transparent"
                      cursor={this.state.cursor}
                    />
                    <defs />
                    <SpherePath
                      style={{ height: '100%', width: '100%' }}
                      id="sphere"
                      d={path({ type: 'Sphere' })}
                    />
                    <GraticulePath id="graticule" d={path(geoGraticule()())} />
                    <LinePath
                      d={path({
                        type: 'LineString',
                        coordinates: planeCoordinates.plane
                      })}
                    />
                    <PointPath
                      stroke="dipDirectionColor"
                      fill="dipDirectionColor"
                      d={path({
                        type: 'Point',
                        coordinates: planeCoordinates.dipDirection
                      })}
                    />
                    <PointPath
                      stroke="azExtColor"
                      fill="azExtColor"
                      d={path({
                        type: 'Point',
                        coordinates: planeCoordinates.azExt
                      })}
                    />
                    <PointPath
                      stroke="azColor"
                      fill="azColor"
                      d={path({
                        type: 'Point',
                        coordinates: planeCoordinates.az
                      })}
                    />
                    <PointPath
                      stroke="dipColor"
                      fill="dipColor"
                      d={path({
                        type: 'Point',
                        coordinates: planeCoordinates.dip
                      })}
                    />
                    <PointPath
                      stroke="fgColor"
                      d={path({
                        type: 'Point',
                        coordinates: planeCoordinates.pole
                      })}
                    />
                    <OuterPointPath
                      id="az"
                      d={outerPointPath({
                        type: 'Point',
                        coordinates: planeCoordinates.az
                      })}
                      onMouseDown={this.handleMouseDown}
                    />
                    <OuterPointPath
                      id="azExt"
                      d={outerPointPath({
                        type: 'Point',
                        coordinates: planeCoordinates.azExt
                      })}
                      onMouseDown={this.handleMouseDown}
                    />
                    <OuterPointPath
                      id="dipDirection"
                      d={outerPointPath({
                        type: 'Point',
                        coordinates: planeCoordinates.dipDirection
                      })}
                      onMouseDown={this.handleMouseDown}
                    />
                    <OuterPointPath
                      id="dip"
                      d={outerPointPath({
                        type: 'Point',
                        coordinates: planeCoordinates.dip
                      })}
                      onMouseDown={this.handleMouseDown}
                    />
                    <OuterPointPath
                      id="pole"
                      d={outerPointPath({
                        type: 'Point',
                        coordinates: planeCoordinates.pole
                      })}
                      onMouseDown={this.handleMouseDown}
                    />
                  </g>
                </Svg>
              </SvgWrapper>
            </WithDescription>
          </Container>
        )}
      </HelpConsumer>
    );
  }
}

const Svg = styled.svg`
  flex: 1;
  width: 100%;
`;

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  /*background: black;*/
`;
const SvgWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1em;
  justify-content: center;
  align-items: center;
  cursor: auto;
  &:active {
    cursor: crosshair;
  }
`;
const GraticulePath = styled.path`
  height: 100%;
  width: 100%;
  fill: none;
  stroke: ${props => props.theme.fgColorD60};
  stroke-width: 0.5px;
`;
const SpherePath = styled.path`
  height: 100%;
  width: 100%;
  fill: transparent;
  stroke: ${props => props.theme.fgColorD20};
  stroke-width: 1.5px;
`;
const LinePath = SpherePath.extend``;
const PointPath = SpherePath.extend`
  stroke-width: 1px;
  fill: ${props => props.theme[props.fill]};
  stroke: ${props => props.theme[props.stroke]};
`;
const OuterPointPath = SpherePath.extend`
  stroke-width: 1px;
  fill: transparent;
  stroke: transparent;
  cursor: pointer;
  cursor: grab;
  &:active {
    cursor: crosshair;
  }
`;
const Rect = styled.rect``;

/*
const PointPath = SpherePath.extend`
  fill: ${props => props.theme.fgColorD20};
`;
*/

export default Stereonet;
