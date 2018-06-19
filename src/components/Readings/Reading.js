import React from 'react';
import styled from 'styled-components';
import Cell from './styled/Cell';
import Span from './styled/Span';

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
    const reading = this.state.isEditable ? (
      <Input
        autoFocus
        onFocus={this.handleFocus}
        onChange={this.handleChange}
        onBlur={this.turnEditableOff}
        onKeyPress={this.handleKeyPress}
        type="text"
        tabIndex={this.props.tabIndex}
        value={value}
      />
    ) : (
      <Span
        innerRef={this.props.spanRef}
        onClick={this.turnEditableOn}
        tabIndex={this.props.tabIndex}
        onFocus={this.turnEditableOn}
        style={{ color: this.props.color }}
      >
        {value}
      </Span>
    );
    return <ReadingCell>{reading}</ReadingCell>;
  }
}

const ReadingCell = Cell.extend`
  width: 22.5%;
  text-align: center;
  cursor: pointer;
  font-size: 0.9em;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0.8em;
  border: 1px solid ${props => props.theme.fgColorD60};
  text-align: left;
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
