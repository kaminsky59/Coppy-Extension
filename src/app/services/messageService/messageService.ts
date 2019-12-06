const exp = (() => {
    const sendMessage = (func, params?): Promise<any> => {
        return new Promise((res) => {
            chrome.runtime.sendMessage({func: func, params: params}, function(response) {
                res(response);
            });
        })
    };

    const attachStateListener = (listener) => {
        chrome.runtime.onMessage.addListener(listener);
    }

    return {
        sendMessage,
        attachStateListener,
    }
})();

export { exp };