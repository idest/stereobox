import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  box-sizing: border-box;
  border-bottom: 0.5px solid ${props => props.theme.bgColorL40};
  background-color: ${props => props.theme.bgColorL2};
  padding: 0.5em;
`;

export default Row;
