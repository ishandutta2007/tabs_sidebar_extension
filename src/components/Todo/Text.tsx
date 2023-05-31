import React, { useState } from "react";
import styled from "styled-components";
// import Input from "./Input";
import browser from "webextension-polyfill";

function navigateToTab(id){
  console.log("navigateToTab:", id);
  browser.runtime.sendMessage({ greeting: "navigateToTab", text: id});
  return true;
};

const Text = styled.span`
  font-weight: ${(props) => (props.active == true ? 600: 400)};
  flex-grow: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
`;
const Enhanced = ({ done, id, value, active }) => {
  console.log(done, id, value, active);
  // const [showInput, toggleInput] = useState(false);
  // try {
  //   if (showInput) {
  //     return (
  //       <Text
  //         value={value}
  //         id={id}
  //         onClose={() => toggleInput(false)}
  //         onClick={() => console.log(id + " Clicked1")}
  //       />
  //     );
  //   }
  // } catch(error) {
  //   console.log(error);
  // }

  try {
    return (
      <Text active={active} onClick={() => {
        console.log(id + " Clicked2");
        return navigateToTab(id);
        // toggleInput(true);
      } }>
        {value}
      </Text>
    );
  } catch(error) {
    console.log(error);
  }

};

export default Enhanced;
