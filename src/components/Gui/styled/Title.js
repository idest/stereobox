import styled from 'styled-components';

const Title = styled.div`
  font-size: 1em;
  display: flex;
  align-items: center;
  justify-content: left;
  color: ${props => props.theme.fgColorD40};
  width: 45%;
  box-sizing: border-box;
  padding-left: 20px;
`;

export default Title;
