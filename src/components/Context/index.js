import React from 'react';
import threeEntryPoint from '../../three/threeEntryPoint';
import EventBus from '../../three/helpers/eventbus';
import styled from 'styled-components';

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.threeRootElement = React.createRef();
    this.eventBus = new EventBus();
    this.handleResetButtonClick = this.handleResetButtonClick.bind(this);
    this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
  }
  componentDidMount() {
    const initialProps = {
      ...this.props,
      r1: 1.3,
      r2: 1.5
    };
    threeEntryPoint(this.threeRootElement.current, initialProps, this.eventBus);
  }
  handleResetButtonClick() {
    this.eventBus.post('resetControls');
  }
  handleToggleButtonClick() {
    this.eventBus.post('toggleWireframe');
  }
  render() {
    this.eventBus.post('propsUpdate', { ...this.props });
    return (
      <ContextContainer>
        <ThreeContainer innerRef={this.threeRootElement} />
        <ButtonContainer>
          <Button onClick={this.handleResetButtonClick}>Reset Camera</Button>
          <Button onClick={this.handleToggleButtonClick}>
            {' '}
            Toggle Wireframe{' '}
          </Button>
        </ButtonContainer>
      </ContextContainer>
    );
  }
}

const ContextContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`;

const ThreeContainer = styled.div`
  width: 100%;
  height: 80%;
`;

const ButtonContainer = styled.div`
  width: 100%;
  height: 20%;
`;

const Button = styled.button`
  width: 100%;
  height: 50%;
  background-color: #181818;
  color: #dcdcdc;
  border: 1px solid #505050;
  cursor: pointer;
  text-decoration: none;
  outline: none;
  &:hover {
    background-color: #101010;
  }
`;

export default Context;
