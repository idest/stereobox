import React from 'react';
import styled from 'styled-components';
import { media } from '../utils/style';
import { Link } from 'react-router-dom';

const TopBar = ({ locale }) => (
  <Container>
    <StyledLink to="/">
      <LangSpan active={locale === 'en'}>English</LangSpan>
    </StyledLink>
    <StyledLink to="/es">
      <LangSpan active={locale === 'es'}>Español</LangSpan>
    </StyledLink>
  </Container>
);

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  outline: none;
  &:hover {
    text-decoration: none;
  }
`;

const Container = styled.div`
  box-sizing: border-box;
  height: 25px;
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
  align-items: center;
  ${media.tablet`
    width: 640px;
    margin-left: auto;
    margin-right: auto;
  `} ${media.desktop`
    width: 960px;
  `};
`;

const LangSpan = styled.span`
  font-size: 0.8em;
  margin-left: 15px;
  font-weight: bold;
  color: ${props =>
    props.active ? props.theme.fgColorD20 : props.theme.fgColorD40};
`;

export default TopBar;
