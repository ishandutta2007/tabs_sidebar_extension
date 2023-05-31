import styled from "styled-components";
const Item = styled.div`
  color: ${props => props.theme.font.primary};
  filter: ${(props) => (props.active == true ? "brightness(85%)": "")};
  display: flex;
  align-items: center;
  height: 35px;
  margin-right: 20px;

  :not(:last-child) {
    margin-bottom: 10px;
  }
`;
export default Item;
