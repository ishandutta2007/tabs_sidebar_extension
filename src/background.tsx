import "libs/polyfills";
import browser from "webextension-polyfill";
browser.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.greeting === "updateBadge") {
    browser.browserAction.setBadgeText({ text: msg.text });
  } else if (msg.greeting === "showOptionsPage") {
    browser.runtime.openOptionsPage();
  } else if (msg.greeting === "getTabInfo") {
    browser.tabs.query({}).then((tabs) => {
      console.log('background:tabs:', tabs);
      const response = { greeting: 'sendTabInfo', payload: { tabs } };
      browser.tabs.sendMessage(sender.tab.id, response); // Send the response directly to the content script
    }).catch((error) => {
      console.error('background:Error while fetching tabs:', error);
    });
  } else if (msg.greeting === "removeTab") {
      console.log('background:removeTab payload:', msg.text);
      browser.tabs.remove(parseInt(msg.text)).then((tabs) => {
        console.log('removed:tab:', msg.text);
      }).catch((error) => {
        console.error('background:Error removing:tab', error);
      });
      return true
  }
});
