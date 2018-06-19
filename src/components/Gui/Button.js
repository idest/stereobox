import styled from 'styled-components';

const Button = styled.button`
  font-size: 1em;
  width: 100%;
  background-color: ${props => props.theme.bgColorL2}
  color: ${props => props.theme.fgColorD40}
  border: 0;
  border-bottom: 0.5px solid ${props => props.theme.bgColorL40};
  cursor: pointer;
  text-decoration: none;
  outline: none;
  text-align: left;
  padding-left: 20px;
  &:hover {
    background-color: ${props => props.theme.bgColorD2}
  }
`;

export default Button;
