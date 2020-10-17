chrome.runtime.onInstalled.addListener(function(details){
  if (details.reason == "install"){
    chrome.storage.sync.set({
      'min': 60
    }, function() {});
  }
});


chrome.storage.onChanged.addListener(function(changes, area) {
  if (area == 'sync' & (changes.min.oldValue != changes.min.newValue)) {
    setupAlarm();
  }
});


function showNotification(title, message) {
  var notif = new Notification(title, {
    body: message,
    tag: "standup",
    icon: "notification.png"
  });
}

function setupAlarm() {
  chrome.storage.sync.get(
    {
      'min': 60
    },
    function(items) {
      chrome.alarms.create("standup", {
        when: Date.now() + items.min*60*1000,
        periodInMinutes: parseInt(items.min)
      });
    }
  );
}
setupAlarm();

function clearAlarms() {
  chrome.alarms.clearAll();
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "standup") {
    chrome.storage.sync.get(
    {
      'min': 60
    },
    function(items) {
      showNotification("Developer Health —  SickSeek", 'It`s been ' + items.min + ' minutes since you stood up , Time To Stand Up & Take Small Break');
    }
  );
  }
});