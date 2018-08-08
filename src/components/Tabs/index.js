import React from 'react';
import styled from 'styled-components';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeChildId: 1 };
  }
  handleClick(id) {
    this.setState({ activeChildId: id });
  }
  render() {
    const children = React.Children.toArray(this.props.children);
    return (
      <TabsWrapper>
        <ActiveTab>{children[this.state.activeChildId]}</ActiveTab>
        <TabsSelector>
          {children.map((child, id) => {
            const isActive = this.state.activeChildId === id ? true : false;
            return (
              <TabTitle
                key={id}
                onClick={() => this.handleClick(id)}
                active={isActive}
              >
                {child.props.title}
              </TabTitle>
            );
          })}
        </TabsSelector>
      </TabsWrapper>
    );
  }
}

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  overflow: hidden;
`;
const TabTitle = styled.div`
  color: ${props =>
    props.active ? props.theme.fgColorD20 : props.theme.fgColorD60};
  cursor: pointer;
`;

const TabsSelector = styled.div`
  box-sizing: border-box;
  display: flex;
  height: 2.5em;
  padding: 1em;
  border-top: 1px solid ${props => props.theme.bgColorL40};
  align-items: center;
  justify-content: space-between;
  font-size: 0.9em;
`;

const ActiveTab = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden; //moz fix;
`;

export default Tabs;
