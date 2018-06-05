import React, { Component } from 'react';
import styled from 'styled-components';

class NeedleLogic extends Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.clickedNeedle = null;
    this.onNeedleDrag = this.props.onNeedleDrag;
    this.onNeedleBackgroundClick = this.props.onNeedleBackgroundClick;
    this.needleCenterInSVGCoords = this.props.needleCenterInSVGCoords;
  }
  handleMouseDown(e) {
    this.clickedNeedle = e.target.id;
    //console.log('Mouse Down');
  }
  handleMouseMove(e) {
    //console.log('Mouse Move');
    if (!this.clickedNeedle) {
      return;
    }
    const { x, y } = this.getEventCoordinates(e);
    const currentMouseAngle = this.getMouseAngle(x, y);
    if (this.onNeedleDrag)
      this.onNeedleDrag(this.clickedNeedle, currentMouseAngle);
  }
  handleMouseUp(e) {
    //console.log('Mouse Up');
    this.clickedNeedle = null;
  }
  handleClick(e) {
    //console.log('Mouse Click');
    const { x, y } = this.getEventCoordinates(e);
    const currentMouseAngle = this.getMouseAngle(x, y);
    if (this.onNeedleBackgroundClick)
      this.onNeedleBackgroundClick(currentMouseAngle);
  }
  getEventCoordinates(e) {
    const svg = e.target.ownerSVGElement;
    const transform = svg.getScreenCTM().inverse();
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const localPoint = point.matrixTransform(transform);
    const { x: xOffset, y: yOffset } = this.needleCenterInSVGCoords;
    return { x: localPoint.x - xOffset, y: localPoint.y - yOffset };
  }
  getMouseAngle(xMouse, yMouse) {
    const tan = yMouse / xMouse || 0;
    let mouseAngle = 180 * Math.atan(tan) / Math.PI;
    if (xMouse < 0) {
      mouseAngle = mouseAngle + 180;
    } else if (yMouse < 0) {
      mouseAngle = mouseAngle + 360;
    }
    return mouseAngle;
  }
  render() {
    return (
      <g
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
      >
        <ClickablePath
          className="needle-logic"
          d={this.props.path}
          fill="transparent"
          onClick={this.handleClick}
        />
        {React.Children.map(this.props.children, child =>
          React.cloneElement(child, { handleMouseDown: this.handleMouseDown })
        )}
      </g>
    );
  }
}

const ClickablePath = styled.path`
  cursor: pointer;
`;

export default NeedleLogic;
