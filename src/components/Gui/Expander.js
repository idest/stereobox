import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled, { withTheme } from 'styled-components';

class Portal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }
  componentDidMount() {
    this.el.style.boxSizing = 'border-box';
    document.body.appendChild(this.el);
  }
  componentWillUnmount() {
    document.body.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

class Expander extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false, style: { top: 0, left: 0, width: 0 } };
    this.height = props.height;
    this.toggle = this.toggle.bind(this);
    this.updateStyle = this.updateStyle.bind(this);
    this.ref = React.createRef();
  }
  componentDidMount() {
    if (this.props.expanded) {
      this.setState({ expanded: true });
    }
    this.updateStyle();
    window.addEventListener('resize', this.updateStyle);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateStyle);
  }
  toggle() {
    this.setState({ expanded: !this.state.expanded });
  }
  updateStyle() {
    const { top, left, width } = this.ref.current.getBoundingClientRect();
    this.setState({ style: { top: top, left: left, width: width } });
  }
  render() {
    const height = this.state.expanded ? this.height : 0;
    return (
      <Wrapper innerRef={this.ref} className={this.props.className}>
        {this.state.expanded && (
          <Portal>
            <Container style={this.state.style} height={height}>
              {this.props.children}
            </Container>
          </Portal>
        )}
        <Handle onClick={this.toggle} top={height}>
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <g transform="translate(50,50)">
              <path
                fill={this.props.theme.bgColorL40}
                d="M-44.54 -35.23 L 44.54 -35.23 L 0 37.5 Z"
                transform={this.state.expanded ? 'rotate(180)' : ''}
              />
            </g>
          </svg>
        </Handle>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
`;

const Container = styled.div`
  box-sizing: border-box;
  position: fixed;
  height: ${props => props.height}px;
`;

const Handle = styled.div`
  box-sizing: border-box;
  display: flex;
  position: relative;
  top: ${props => props.top}px;
  width: 100%;
  height: 20px;
  padding: 0.2em;
  border-bottom: 1px solid ${props => props.theme.bgColorL40};
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.bgColorL10};
  cursor: pointer;
`;

export default withTheme(Expander);
