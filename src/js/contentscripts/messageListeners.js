this.messagListener = (function(){
    chrome.runtime.onMessage.addListener((request, sender, response) => {
        if(request.action = 'copy') {
            // Received when the Cmd + C is sent
        }
    })
})();