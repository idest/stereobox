import './Compass.css';
import React, { Component } from 'react';

class Compass extends Component {
  constructor(props) {
    super(props);
    this.radius = 40;
    this.majorTicks = this.getTicks(Math.PI / 6, 4, true);
    this.minorTicks = this.getTicks(Math.PI / 18, 2, false);
    this.cardinalPoints = this.getCardinalPoints(
      ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
      [1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5]
    );
    this.preventSVGDrag = this.preventSVGDrag.bind(this);
  }
  getTicks(tickStep, tickLength, tickLabel) {
    const ticks = [];
    const r = this.radius;
    for (let i = 0; i < 2 * Math.PI / tickStep; i++) {
      const currentStep = i * tickStep;
      const x = Math.cos(currentStep);
      const y = Math.sin(currentStep);
      const labelX = x * (r + 5);
      const labelY = y * (r + 5);
      const labelExtraRot =
        currentStep <= Math.PI / 2 || currentStep >= 3 / 2 * Math.PI ? 90 : -90;
      const labelRot = 180 * currentStep / Math.PI + labelExtraRot;
      let label;
      if (tickLabel === true) {
        label = (
          <text
            x={labelX}
            y={labelY}
            font-size="5"
            text-anchor="middle"
            transform={`rotate(${labelRot}, ${labelX}, ${labelY})`}
            dy="0.4em"
            stroke-width="0.1"
            fill="white"
          >
            {(180 * currentStep / Math.PI).toFixed(0)}
          </text>
        );
      }
      ticks.push(
        <g stroke="white" transform={`rotate(${-90})`}>
          <line
            key={i}
            x1={x * r}
            x2={x * (r - tickLength)}
            y1={y * r}
            y2={y * (r - tickLength)}
            stroke-width="0.5"
          />
          {label}
        </g>
      );
    }
    return ticks;
  }
  getCardinalPoints(cardinalLabels, cardinalSizes) {
    const cardinalPoints = [];
    for (let i = 0; i < cardinalLabels.length; i++) {
      const currentSize = cardinalSizes[i];
      const currentAngle = i * 2 * Math.PI / cardinalLabels.length;
      const x = Math.sin(currentAngle);
      const y = Math.cos(currentAngle);
      const r = this.radius;
      cardinalPoints.push(
        <g>
          <text
            x={x * (r - 12)}
            y={-y * (r - 12)}
            stroke="white"
            fill="white"
            text-anchor="middle"
            dy="0.4em"
            font-size={`${12 * currentSize}`}
            stroke-width="0.1"
          >
            {cardinalLabels[i]}
          </text>
        </g>
      );
    }
    return cardinalPoints;
  }
  preventSVGDrag(e) {
    e.preventDefault();
  }
  render() {
    return (
      <svg
        className="compass"
        style={{ width: '100%', height: '100%' }}
        viewBox="0 0 100 100"
        onDragStart={this.preventSVGDrag}
      >
        <g id="compassGroup" transform="translate(50,50)">
          <circle
            cx="0"
            cy="0"
            r={this.radius}
            stroke="white"
            fill="transparent"
          />
          {this.majorTicks}
          {this.minorTicks}
          {this.cardinalPoints}
          <CompassNeedles
            length={this.radius}
            azColor="red"
            azExtColor="blue"
            dipColor="green"
            azimuth={this.props.azimuth}
            changePlaneState={this.props.changePlaneState}
            animateAzimuthChange={this.props.animateAzimuthChange}
          />
        </g>
      </svg>
    );
  }
}

class CompassNeedles extends Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.xClick = undefined;
    this.yClick = undefined;
    this.clickedElement = null;
  }
  handleMouseDown(e) {
    this.clickedElement = e.target.id;
    console.log('Mouse Down');
  }
  handleMouseMove(e) {
    console.log('Mouse Move');
    if (!this.clickedElement) {
      return;
    }
    const { x, y } = this.getEventCoordinates(e);
    const currentMouseAngle = this.getMouseAngle(x, y);
    let newAzimuth;
    if (this.clickedElement === 'azimuth') {
      newAzimuth = currentMouseAngle;
    } else if (this.clickedElement === 'azimuthExt') {
      newAzimuth = currentMouseAngle - 180;
    } else if (this.clickedElement === 'dip') {
      newAzimuth = currentMouseAngle - 90;
    }
    newAzimuth = newAzimuth < 0 ? newAzimuth + 360 : newAzimuth;
    this.props.changePlaneState({
      planeAzimuth: newAzimuth,
      lastInput: 'DRAG'
    });
  }
  handleMouseUp(e) {
    console.log('Mouse Up');
    this.clickedElement = null;
  }
  handleClick(e) {
    console.log('Mouse Click');
    const { x, y } = this.getEventCoordinates(e);
    const newAzimuth = this.getMouseAngle(x, y);
    const animationId = `ANIM${x}${y}`;
    console.log('animationId', animationId);
    this.props.animateAzimuthChange(newAzimuth, animationId);
  }
  getEventCoordinates(e) {
    const svg = e.target.ownerSVGElement;
    const compassGroup = svg.querySelector('#compassGroup');
    //const groupTransform = svg.getTransformToElement(compassGroup);
    //const transform = groupTransform.multiply(svg.getScreenCTM().inverse());
    const transform = svg.getScreenCTM().inverse();
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const localPoint = point.matrixTransform(transform);
    // TODO: Unhardcode these 50s
    return { x: localPoint.x - 50, y: localPoint.y - 50 };
  }
  getMouseAngle(xMouse, yMouse) {
    const tan = xMouse / -yMouse || 0;
    let mouseAngle = 180 * Math.atan(tan) / Math.PI;
    if (yMouse >= 0) {
      mouseAngle = mouseAngle + 180;
    } else if (xMouse < 0) {
      mouseAngle = mouseAngle + 360;
    }
    return mouseAngle;
  }
  getNeedle(needleId, needleColor) {
    let y2 = '0';
    let x2 = '0';
    if (needleId === 'azimuth') {
      y2 = `${-this.props.length}`;
    } else if (needleId === 'azimuthExt') {
      y2 = `${this.props.length}`;
    } else if (needleId === 'dip') {
      x2 = `${0.5 * this.props.length}`;
    }
    return (
      <g>
        <line stroke={needleColor} x1="0" x2={x2} y1="0" y2={y2} />
        <line
          id={needleId}
          className="needle"
          stroke-width="15"
          stroke="transparent"
          fill="transparent"
          onMouseDown={this.handleMouseDown}
          x1="0"
          x2={x2}
          y1="0"
          y2={y2}
        />
      </g>
    );
  }
  render() {
    return (
      <g
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
      >
        <g
          transform={`rotate(${this.props.azimuth})`}
          stroke-width="1.4"
          fill="white"
        >
          <circle
            cx="0"
            cy="0"
            r={this.props.length + 10}
            fill="transparent"
            onClick={this.handleClick}
          />
          {this.getNeedle('azimuth', this.props.azColor)}
          {this.getNeedle('azimuthExt', this.props.azExtColor)}
          {this.getNeedle('dip', this.props.dipColor)}
          <circle stroke="white" fill="white" r="0.4" cx="0" cy="0" />
        </g>
      </g>
    );
  }
}

export default Compass;
