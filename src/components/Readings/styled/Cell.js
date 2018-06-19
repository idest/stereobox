import styled from 'styled-components';

const Cell = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  overflow: hidden;
  border-bottom: solid 1px ${props => props.theme.bgColorL40};
  text-align: center;
  background-color: ${props => props.theme.bgColor};
  color: ${props => props.theme.fgColorD30};
  list-style: none;
  /*width: 33.3%; 3 columns */
`;

export default Cell;
