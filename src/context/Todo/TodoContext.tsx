import React, { useReducer, useEffect, useRef } from "react";
import browser from "webextension-polyfill";
import getStubData from "./getStubData";
import Global from '../../Global'

export const ADD_TODO = "ADD_TODO";
export const REMOVE_TODO = "REMOVE_TODO";
export const UPDATE_TODO = "UPDATE_TODO";
export const TOGGLE_DONE = "TOGGLE_DONE";
export const REMOVE_ALL = "REMOVE_ALL";
export const INIT = "INIT";
const TodoContext = React.createContext([]);
const reducer = (state, { payload, type }) => {
  switch (type) {
    case ADD_TODO:
      return [
        {
          id: Math.random()
            .toString(16)
            .substr(2),
          text: payload,
          isDone: false,
          added: new Date().toDateString()
        },
        ...state
      ];
    case REMOVE_TODO:
      console.log("REMOVE_TODO", payload)
      browser.runtime.sendMessage({ greeting: "removeTab", text: payload})
      return state.filter(({ id }) => id !== payload);
    case UPDATE_TODO:
      return state.map(item => {
        if (item.id === payload.id) {
          return { ...item, text: payload.text };
        }
        return item;
      });
    case TOGGLE_DONE:
      return state.map(item => {
        if (item.id === payload) {
          item.isDone = !item.isDone;
        }
        return item;
      });
    case REMOVE_ALL:
      return [];
    case INIT:
      return payload;
    default:
      throw new Error(`No such action: ${type}`);
  }
};
const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);
  const initRef = useRef(false);
  // Sync with storage
  useEffect(
    () => {
      if (initRef.current) {
        browser.storage.sync.set({ list: state });
        // Update badge counter
        browser.runtime.sendMessage({
          greeting: "updateBadge",
          text: state.filter(({ isDone }) => !isDone).length.toString()
        });
      }
    },
    [state]
  );
  // Listen to storage change and update the list
  useEffect(() => {
    browser.storage.onChanged.addListener(changes => {
      if (changes.list) {
        dispatch({ type: INIT, payload: changes.list.newValue });
      }
    });
  }, []);
  // Initialize the list with saved items or with initial data
  useEffect(async () => {
    browser.runtime.sendMessage({ greeting: "getTabInfo" })
    browser.runtime.onMessage.addListener((msg) => {
      if (msg.greeting === 'sendTabInfo') {
        const { tabs } = msg.payload;
        console.log('TodoContext:tabs:', tabs);
        let tabs_min = [];
        tabs.forEach((tab) => {
          tabs_min.push({
            'id': tab.id,
            'text': tab.title,
            'isDone': false,
            'active': tab.active,
            'added': new Date().toDateString()
          });
        });
        console.log('TodoContext:tabs_min:', tabs_min);
        console.log('TodoContext:Number of tabs:', tabs.length);
        dispatch({ type: INIT, payload: tabs_min });
      }
      return true;
    });
    initRef.current = true;
  }, []);

  useEffect(async () => {
    console.log("TodoContext:Global.sidebar_isopen", Global.sidebar_isopen);
    browser.runtime.sendMessage({ greeting: "getTabInfo" })
    browser.runtime.onMessage.addListener((msg) => {
      if (msg.greeting === 'sendTabInfo') {
        const { tabs } = msg.payload;
        console.log('TodoContext:tabs:', tabs);
        let tabs_min = [];
        tabs.forEach((tab) => {
          tabs_min.push({
            'id': tab.id,
            'text': tab.title,
            'isDone': false,
            'active': tab.active,
            'added': new Date().toDateString()
          });
        });
        console.log('TodoContext:tabs_min:', tabs_min);
        console.log('TodoContext:Number of tabs:', tabs.length);
        dispatch({ type: INIT, payload: tabs_min });
      }
      return true;
    });
    initRef.current = true;
  }, [Global.sidebar_isopen]);

  return (
    <TodoContext.Provider value={[state, dispatch]}>
      {children}
    </TodoContext.Provider>
  );
};
export { TodoProvider, TodoContext };
