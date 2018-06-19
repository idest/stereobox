import React, { Component } from 'react';
import styled from 'styled-components';
import Row from './styled/Row';
import Title from './styled/Title';
import Body from './styled/Body';

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = { checked: true };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount() {
    this.setState({ checked: this.props.checked });
  }
  handleInputChange() {
    const checked = this.state.checked ? false : true;
    this.setState({ checked: checked });
    if (this.props.callback) {
      this.props.callback(checked);
    }
  }
  render() {
    return (
      <Row2 onClick={this.handleInputChange}>
        <Title>
          <span>{this.props.title}</span>
        </Title>
        <Body>
          <Input checked={this.state.checked} type="checkbox" />
        </Body>
      </Row2>
    );
  }
}

const Row2 = Row.extend`
  cursor: pointer;
`;

const Input = styled.input`
  cursor: pointer;
`;
export default Checkbox;
