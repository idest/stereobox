import styled from 'styled-components';

const Button = styled.button`
  width: 100%;
  height: 30px; //special case
  border: 0;
  border-top: 1px solid ${props => props.theme.bgColorL10};
  //padding-left: 20px;
  font-size: 0.8em; //special case
  text-decoration: none;
  text-align: center;
  color: ${props => props.theme.fgColorD40};
  background-color: ${props => props.theme.bgColorL2};
  outline: none;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.bgColor};
  }
  &:active {
    background-color: ${props => props.theme.bgColorD2};
  }
`;

export default Button;
