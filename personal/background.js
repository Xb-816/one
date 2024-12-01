chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.storage.sync.get(["goals"], (result) => {
      const goals = result.goals || [];
      switch (message.action) {
        case "getGoals":
          sendResponse({ goals });
          break;
        case "addGoal":
          goals.push(message.goal);
          chrome.storage.sync.set({ goals }, () => sendResponse({ success: true }));
          break;
        case "updateGoal":
          goals[message.index] = message.goal;
          chrome.storage.sync.set({ goals }, () => sendResponse({ success: true }));
          break;
        case "deleteGoal":
          goals.splice(message.index, 1);
          chrome.storage.sync.set({ goals }, () => sendResponse({ success: true }));
          break;
      }
    });
    return true; // 保證是異步回應
  });
  