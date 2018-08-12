import React from 'react';
import styled from 'styled-components';
import Cell from './styled/Cell';
import Span from './styled/Span';
import zeroPad from '../../utils/zeroPad';

class Reading extends React.Component {
  constructor(props) {
    super(props);
    this.turnEditableOn = this.turnEditableOn.bind(this);
    this.turnEditableOff = this.turnEditableOff.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = { isEditable: false };
  }
  turnEditableOn() {
    this.setState({ isEditable: true });
  }
  turnEditableOff() {
    this.setState({ isEditable: false });
  }
  handleFocus(e) {
    e.target.select();
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.turnEditableOff();
    }
  }
  handleChange(e) {
    this.props.onValueChange(this.props.dir, e.target.value);
  }
  render() {
    const value = Number.isNaN(this.props.value) ? '' : this.props.value;
    const digits = this.props.digits;
    const reading = this.state.isEditable ? (
      <Input
        autoFocus
        onFocus={this.handleFocus}
        onChange={this.handleChange}
        onBlur={this.turnEditableOff}
        onKeyPress={this.handleKeyPress}
        type="text"
        value={value}
        tabIndex={this.props.tabIndex}
      />
    ) : (
      <Span
        innerRef={this.props.spanRef}
        onClick={this.turnEditableOn}
        onFocus={this.turnEditableOn}
        style={{ color: this.props.color }}
        tabIndex={this.props.tabIndex}
      >
        {digits ? zeroPad(value, digits) : value}
      </Span>
    );
    return <ReadingCell>{reading}</ReadingCell>;
  }
}

const ReadingCell = Cell.extend`
  box-sizing: border-box;
  width: 20%;
  text-align: center;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0.8em;
  padding-left: 0;
  border: 1px solid ${props => props.theme.fgColorD60};
  text-align: center;
  font-size: 0.9em;
  background: ${props => props.theme.bgColorL10};
  color: ${props => props.theme.fgColorD30};
  &::selection {
    color: ${props => props.theme.fgColorD30};
    background-color: ${props => props.theme.bgColor};
  }
  &::-moz-selection {
    color: ${props => props.theme.fgColorD30};
    background-color: ${props => props.theme.bgColor};
  }
`;

export default Reading;
