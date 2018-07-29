import React from 'react';
import styled from 'styled-components';
import marked from 'marked';

class WithDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = { html: marked('') };
  }
  fetchData() {
    if (this.props.text) {
      fetch(this.props.text)
        .then(response => response.text())
        .then(text => {
          this.setState({ html: marked(text) });
        });
      //console.log('data fetched');
    }
  }
  componentWillMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.fetchData();
    }
  }
  render() {
    // const { text } = this.props;
    // const html = marked(text || '');
    return (
      <Container>
        {this.props.children}
        <DescriptionContainer show={this.props.show}>
          <Description
            className={this.props.className}
            dangerouslySetInnerHTML={{ __html: this.state.html }}
          />
        </DescriptionContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  overflow: hidden; // moz fix
`;
const DescriptionContainer = styled.div`
  display: ${props => (props.show ? 'block' : 'none')};
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  //border: 5px solid ${props => props.theme.bgColorL5};
`;
const Description = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: auto;
  text-align: left;
  font-size: 0.8em;
  background-color: ${props => props.theme.bgColorL5};
  opacity: 0.9;
`;
export default WithDescription;
