import React, { useState } from "react";
import styled from "styled-components";
import Input from "./Input";
const Text = styled.span`
  font-weight: ${(props) => (props.active == true ? 600: 400)};
  flex-grow: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
`;
const Enhanced = ({ done, id, value, active, update }) => {
  // console.log(done, id, value, active)
  const [showInput, toggleInput] = useState(false);
  if (showInput) {
    return (
      <Input
        value={value}
        id={id}
        update={update}
        onClose={() => toggleInput(false)}
      />
    );
  }
  return (
    <Text active={active} onClick={() => toggleInput(true)}>
      {value}
    </Text>
  );
};
export default Enhanced;
