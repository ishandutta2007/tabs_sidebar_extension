import React, { Fragment, useContext, useState } from "react";
import browser from "webextension-polyfill";
import { ThemeProvider } from "styled-components";
import invertTheme from "theme/invertTheme";
import Input from "components/Input";
import Checkbox from "components/Checkbox";
import DateLabel from "components/DateLabel";
import Button from "components/Button";
import Control from "components/Control";
import Box from "components/Box";
import Dialog from "components/Dialog";
import {
  TodoContext,
  ADD_TODO,
  REMOVE_TODO,
  UPDATE_TODO,
  REMOVE_ALL,
  TOGGLE_DONE
} from "context/Todo";
import TrashIcon from "assets/icons/trash.svg";
import TrashIconFull from "assets/icons/trash-full.svg";
import CrossIcon from "assets/icons/cross.svg";
import EyeIcon from "assets/icons/eye.svg";
import LockIcon from "assets/icons/lock.svg";
import LockUnlockedIcon from "assets/icons/lock-unlocked.svg";
import EyeOffIcon from "assets/icons/eye-off.svg";
import SettingsIcon from "assets/icons/sliders.svg";
import Item from "./Item";
import Text from "./Text";
import groupItemsByDate from "./groupItemsByDate";
import Global from '../../Global'

export default () => {
  const [value, setValue] = useState("");
  const [items, dispatch] = useContext(TodoContext);
  const [lockDone, toggleDone] = useState(false);
  const [showDialog, toggleDialog] = useState(false);
  const handleInputChange = ({ target: { value } }) => setValue(value);
  const markAsDone = id => () => dispatch({ type: TOGGLE_DONE, payload: id });
  const removeItem = id => () => dispatch({ type: REMOVE_TODO, payload: id });
  const toggleSidebar = (lockDone) => {
    // lockDone=!lockDone;
    toggleDone(lockDone);
    Global.sidebar_locked = lockDone;
    console.log("toggleSidebar", lockDone);
    console.log("Global.sidebar_locked", Global.sidebar_locked);
  };
  const removeAllItems = () => {
    dispatch({ type: REMOVE_ALL });
    toggleDialog(false);
  };
  const addItem = ({ target: { value }, key }) => {
    if (key.toLowerCase() === "enter" && value.trim().length > 0) {
      dispatch({ type: ADD_TODO, payload: value.trim() });
      setValue("");
    }
  };
  const updateItem = payload => dispatch({ type: UPDATE_TODO, payload });
  const groupedItems = items;//groupItemsByDate(items, lockDone);
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box flexShrink="0" mb={4}>
        <Input
          autoFocus
          placeholder={browser.i18n.getMessage("placeholder")}
          onKeyPress={addItem}
          value={value}
          onChange={handleInputChange}
        />
      </Box>
      <Box overflowY="auto" flexGrow="1">
          <Fragment>
            {groupedItems.map(({ id, text, isDone }) => (
              <Item key={id}>
                <Box
                  display="flex"
                  alignItems="center"
                  flexShrink="0"
                  height="100%"
                  mr={2}
                >
                  <Checkbox checked={isDone} onChange={markAsDone(id)} />
                </Box>
                <Text
                  done={isDone}
                  id={id}
                  title={text}
                  value={text}
                  update={updateItem}
                />
                <Control onClick={removeItem(id)}>
                  <CrossIcon />
                </Control>
              </Item>
            ))}
          </Fragment>
      </Box>
      <Box display="flex" flexShrink="0" mt={2}>
        {items.length > 0 && (
          <Fragment>
            <Button onClick={() => toggleDialog(true)}>
              <TrashIconFull />
            </Button>
            <Box width={3} flexShrink={0} />
            <Button onClick={() => toggleSidebar(!lockDone)}>
              {lockDone ? <LockIcon /> : <LockUnlockedIcon />}
            </Button>
            <Box width={3} flexShrink={0} />
          </Fragment>
        )}
        <Button
          onClick={() =>
            browser.runtime.sendMessage({ greeting: "showOptionsPage" })
          }
        >
          <SettingsIcon />
        </Button>
      </Box>
      {showDialog && (
        <Dialog open={showDialog}>
          {browser.i18n.getMessage("deleteConfirmation")}
          <Box display="flex" mt={3}>
            <ThemeProvider theme={invertTheme}>
              <Button onClick={removeAllItems}>
                {browser.i18n.getMessage("deleteAll")}
              </Button>
              <Box width={3} flexShrink={0} />
              <Button onClick={() => toggleDialog(false)}>
                {browser.i18n.getMessage("cancel")}
              </Button>
            </ThemeProvider>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};
