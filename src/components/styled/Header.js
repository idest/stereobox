import React from 'react';
import styled from 'styled-components';

const Header = props => {
  return (
    <HeaderStyled>
      {props.showNumber ? (
        <Span>
          <strong>{props.number}</strong>
        </Span>
      ) : null}
      {props.children}
    </HeaderStyled>
  );
};

const Span = styled.span`
  padding-right: 5px;
  color: #cfd3e1;
`;
const HeaderStyled = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 2em;
  justify-content: flex-start;
  align-items: center;
  border-bottom: solid 1px ${props => props.theme.bgColorL40};
  padding: 0px 10px;
  font-size: 0.8em;
  color: ${props => props.theme.fgColorD30};
  background-color: ${props => props.theme.bgColorL10};
  font-weight: bold;
`;

export default Header;
