import React, { Component } from 'react';
import styled from 'styled-components';
import Row from './styled/Row';
import Title from './styled/Title';
import Body from './styled/Body';

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = { posX: 0.5, inputValue: 0.5 };
    this.changeState = this.changeState.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }
  changeState(posX) {
    posX = posX > 1 ? 1 : posX;
    posX = posX < 0 ? 0 : posX;
    this.setState({ posX: posX, inputValue: posX });
    if (this.props.callback) {
      this.props.callback(posX);
    }
  }
  handleInputChange(e) {
    const newValue = e.target.value;
    this.setState({ inputValue: newValue });
  }
  handleInputBlur(e) {
    const newValue = +e.target.value;
    if (!Number.isNaN(newValue) && newValue > 0 && newValue < 1) {
      this.changeState(newValue);
    } else {
      this.setState({ inputValue: this.state.posX });
    }
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  }
  handleFocus(e) {
    e.target.select();
  }
  render() {
    return (
      <Row>
        <Title>
          <span>{this.props.title}</span>
        </Title>
        <Body>
          <StyledDragger
            changeState={this.changeState}
            posX={this.state.posX}
          />
          <InputContainer>
            <Input
              type="text"
              value={this.state.inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputBlur}
              onKeyPress={this.handleKeyPress}
              onFocus={this.handleFocus}
            />
          </InputContainer>
        </Body>
      </Row>
    );
  }
}

class Dragger extends Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.svgElement = null;
  }
  componentDidMount() {
    document.body.addEventListener('mousemove', this.handleMouseMove);
    document.body.addEventListener('mouseup', this.handleMouseUp);
  }
  preventSVGDrag(e) {
    e.preventDefault();
  }
  handleMouseDown(e) {
    this.svgElement = e.target.ownerSVGElement;
    const x = this.getEventXCoordinate(e, this.svgElement);
    this.props.changeState(x);
  }
  handleMouseUp() {
    this.svgElement = null;
  }
  handleMouseMove(e) {
    if (!this.svgElement) {
      return;
    }
    const x = this.getEventXCoordinate(e, this.svgElement);
    this.props.changeState(x);
  }
  getEventXCoordinate(e, svgElement) {
    const transform = svgElement.getScreenCTM().inverse();
    const point = svgElement.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const localPoint = point.matrixTransform(transform);
    return (localPoint.x / 100).toFixed(2);
  }
  render() {
    return (
      <div className={this.props.className}>
        <svg
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          onDragStart={this.preventSVGDrag}
          style={{ width: '100%', height: '100%' }}
        >
          <g onMouseDown={this.handleMouseDown}>
            <BackgroundRect
              x="0"
              y="0"
              width="100"
              height="10"
              stroke="transparent"
            />
            <ForegroundRect
              x="0"
              y="0"
              width={this.props.posX * 100}
              height="10"
            />
          </g>
        </svg>
      </div>
    );
  }
}

const StyledDragger = styled(Dragger)`
  box-sizing: border-box;
  padding: 0em 0.5em;
  width: 80%;
  cursor: col-resize;
`;

const InputContainer = styled.div`
  width: 20%;
`;

const Input = styled.input`
  box-sizing: border-box;
  text-align: center;
  width: 100%;
  height: 100%;
  font-size: 0.9em;
  background: ${props => props.theme.bgColorL10};
  color: ${props => props.theme.fgColorD40};
  padding: 0;
  border: 0;
  &:focus {
    color: ${props => props.theme.fgColorD10};
  }
  &::selection {
    background-color: ${props => props.theme.bgColorL40};
  }
  &::-moz-selection {
    background-color: ${props => props.theme.bgColorL40};
  }
`;

const BackgroundRect = styled.rect`
  fill: ${props => props.theme.bgColorL10};
`;

const ForegroundRect = styled.rect`
  fill: ${props => props.theme.fgColorD50};
`;

export default Slider;
