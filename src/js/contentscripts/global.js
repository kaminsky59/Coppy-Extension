document.oncopy = (event) => {
    
    // Check if we are copying text
    var text = this.copyManager.copySelectedText();

    if(text !== '' && text !== undefined) {
        this.messageSender.sendMessage({
            type: 'text',
            textCopied: text,
            action: 'copy'
        });

        return;
    }

    // Check if the source element is a img
    if (event.srcElement.nodeName === 'IMG') {
        var srcLink = event.srcElement.attributes['src'].nodeValue;
        this.messageSender.sendMessage({
            type: 'image',
            imageLink: srcLink,
            action: 'copy'
        });
    }
};

document.oncontextmenu = (event) => {
    console.log(event);
}