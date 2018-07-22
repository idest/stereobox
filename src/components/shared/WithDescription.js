import React from 'react';
import styled from 'styled-components';

class WithDescription extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container>
        {this.props.children}
        <Description />
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  flex: 1;
`;

const Description = styled.div`
  position: absolute;
  display: none;
`;

export default WithDescription;
