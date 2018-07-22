import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  border-bottom: solid 1px ${props => props.theme.bgColorL40};
  padding: 3px 10px;
  font-size: 0.7em;
  color: ${props => props.theme.fgColorD30};
  background-color: ${props => props.theme.bgColorL10};
`;

export default Header;
