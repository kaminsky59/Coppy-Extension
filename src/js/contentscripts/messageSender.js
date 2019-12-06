this.messageSender = (function() {
    return {
        sendMessage(event) {
            chrome.runtime.sendMessage(event);
        }
    }
})();