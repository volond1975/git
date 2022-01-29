var directImageUrlPattern = /\.(?:png|jpe?g|gif)(?:\?.*?)?(?:#.*?)?$/i;

function isCode(code) {
    try {
        eval(code)

        return true
    } catch (e) {

        return false
    }



}
/**RAMDA */
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const flip = fn => a => b => fn(b)(a);
const map = (fn, arr) => arr.reduce((acc, item, index, arr) => {
    return acc.concat(fn(item, index, arr));
}, []);


var getKeyLS = (key) => localStorage.getItem(key)
var setKeyLS = (key, value) => (value) => localStorage.setItem(key, value)
var removeKeyLS = (key) => localStorage.removeItem(key)
var isKeyLS = (value) => value != null

var toTag = (tag, text) => (text) => `<${tag}>${text}</${tag}>`
var toCode = toTag('code')
var toB = toTag('b')
var toI = toTag("i")
var toLink = (text, url) => `<a href="${url}">${text}</a>`
var imageLink = (url) => `<a href="${url}">&#8204;</a>`
var toN = (html) => html + '\n'
var splitN = (text) => text.split("\n")
var joinN = (arr) => arr.join("\n")

var setTextIoTagInnerHTML = (el, text) => (text) => document.getElementById(el).innerHTML = text
var setOutput = setTextIoTagInnerHTML('output')
var isArrOne = (arr) => arr.length == 1
    //var shiftArr=(arr)=>{arr.shift();return{}}
var getSelect = (selection) => (!!selection) ? selection[0] : 0
var isSelect = (sel) => !!sel

const addCode = (innerText, sel, urlTab, value) => {
    var textStorage = innerText ? joinN([value, "", toCode(sel)]) : toCode(sel);
    setKeyLS(urlTab)(textStorage)
    var it = innerText ? 'Продолжаем добавление:Код' : 'Начало добавления:Код'
    setOutput(it)
}
const starText = (sel, urlTab) => {
    var spl = splitN(sel)
    var header = toB(spl.shift())
    var source = toLink('Источник:', urlTab)
    textStorage = joinN(map(toI, spl))
    setKeyLS(urlTab)(joinN([header, "", source, "", textStorage]))
    console.log('//Старт ключ ' + getKeyLS(urlTab))
    setOutput('Начало добавления:Заголовок+Источник+Текст')
}
const nextText = (value, sel, urlTab) => {
    var splText = splitN(sel)
    var spl = !isArrOne(splText) ? joinN(map(toI, splText)) : toN(toB(splText[0]))
    var textStorage = joinN([value, "", spl])
    setOutput('Продолжаем добавление:Текст')
    setKeyLS(urlTab)(textStorage)
}
const nextImage = (value, image, urlTab) => {

    var textStorage = joinN([value, image])
    setOutput('Продолжаем добавление:Image')
    setKeyLS(urlTab)(textStorage)
}

chrome.contextMenus.create({
    title: 'Quote image as text',
    contexts: ['image'],
    onclick: function(info, tab) {
        var pageUrl = info.pageUrl;
        var source = pageUrl //toLink1('Источник:', pageUrl)
        var value = getKeyLS(pageUrl)
        if (info.linkUrl &&
            !directImageUrlPattern.exec(info.linkUrl) &&
            info.linkUrl !== info.srcUrl) {
            pageUrl = info.linkUrl;
        }
        var markdown = imageLink(info.srcUrl) //source //'[![](' + info.srcUrl + ')](' + pageUrl + ')';

        document.oncopy = function(e) {
            e.clipboardData.setData('text/plain', markdown);
            e.preventDefault();
            //sendMessage(source, markdown)

            nextImage(value, markdown, source)
            chrome.notifications.create(
                '', {
                    type: 'basic',
                    title: chrome.i18n.getMessage('copied_to_clipboard'),
                    message: markdown,
                    iconUrl: ''
                },
                function() {}
            );
        };
        document.execCommand('copy', false, null);
    }
});
const settings = {
    botId: '521436933:AAHi1rzPx5XJt6KdVI1snLzAwSOLbJlAk70',
    chatId: '192818801',
    userName: '@volond',
    pollingInterval: 5000
}
const sendMessage = (type, href) => {
    //   if (mutedUrls.find(url => href.startsWith(url))) { return false }
    const data = new FormData()
    data.append('chat_id', settings.chatId)
    data.append('text', `${settings.userName} ${type} ${href}`)
    data.append('parse_mode', 'HTML')

    navigator.sendBeacon(
        `https://api.telegram.org/bot${settings.botId}/sendMessage`,
        data
    )
}

function send(info, tab) {
    return function(info, tab) {
        var selection = info.selectionText;
        var url = "https://api.telegram.org/bot1107350266:AAEbMkycaVeocU_EfFyDAgYfzENKZMngf28/sendMessage?chat_id=192818801&text=" + selection + "\n" + window.location.href;
        chrome.tabs.create({ index: tab.index + 1, url: url, selected: true });
    }
}