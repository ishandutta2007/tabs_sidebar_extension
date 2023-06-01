import "libs/polyfills";
import browser from "webextension-polyfill";
browser.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.greeting === "roboregular") {
    return browser.runtime.getURL("assets/fonts/Roboto-Regular.ttf")
  } else if (msg.greeting === "robomedium") {
    return browser.runtime.getURL("assets/fonts/Roboto-Medium.ttf")
  } else if (msg.greeting === "updateBadge") {
    browser.action.setBadgeText({tabId: sender.tab.id, text: msg.text });
    return true;
  } else if (msg.greeting === "showOptionsPage") {
    browser.runtime.openOptionsPage();
    return true;
  }
  else if (msg.greeting === "getTabInfo") {
    browser.tabs.query({}).then((tabs) => {
      console.log('background:getTabInfo:tabs:', tabs);
      const response = { greeting: 'sendTabInfo', payload: { tabs } };
      browser.tabs.sendMessage(sender.tab.id, response); // Send the response directly to the content script
      return true;
    }).catch((error) => {
      console.error('background:getTabInfo:Error:', error);
    });
    return true;
  }
  else if (msg.greeting === "navigateToTab") {
    console.log('background:navigateToTab payload:', msg.text);
    try {
      chrome.tabs.update(parseInt(msg.text), {highlighted: true});
    } catch(error) {
      console.error('background:navigateToTab:Error:', error);
    }
    return true;
  }
  else if (msg.greeting === "removeTab") {
    console.log('background:removeTab payload:', msg.text);
    browser.tabs.remove(parseInt(msg.text)).then((tabs) => {
      console.log('removed:tab:', msg.text);
      return true;
    }).catch((error) => {
      console.error('background:removeTab:Error:', error);
    });
    return true;
  }
});

