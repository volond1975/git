//https://stackoverflow.com/questions/34170032/how-to-get-selected-text-in-chrome-extension-development
/*
const settings = {
    botId: '521436933:AAHi1rzPx5XJt6KdVI1snLzAwSOLbJlAk70',
    chatId: '-1001285404072', //'192818801',
    userName: 'volond',
    pollingInterval: 5000
}
*/

//const { json } = require("body-parser");






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
    //FIXME
const sendTG = (value, urlTab) => {
    var grupLink = `Обсудить:` //${grupLink}`
    var sendText = joinN([...splitN(value), '••••••••••', grupLink])

    sendTelegram(sendText)
    setOutput('Cообщение отправлено\nКлюч очищен')
        //Удалить ключ
    removeKeyLS(urlTab)


}

function sendTelegram(text, type = 'chatId') {
    const settings = {
        botId: '521436933:AAHi1rzPx5XJt6KdVI1snLzAwSOLbJlAk70',
        chatId: ['192818801'],
        chatIds: ['192818801', '@volondapps'],
        userName: 'volond',
        pollingInterval: 5000
    }
    settings[type].map(chatId => {
        const data = new FormData()
        data.append('chat_id', chatId) //settings.chatId
        data.append('text', text)
        data.append('parse_mode', 'HTML')
        navigator.sendBeacon(
            `https://api.telegram.org/bot${settings.botId}/sendMessage`,
            data
        )
    })
}



chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
    },
    function(selection) {

        var t = chrome.tabs.query({ active: true, currentWindow: true },
            function(tabs) {




                var sel = getSelect(selection)
                console.log('//Выделено пользователем ' + sel)
                var urlTab = tabs[0].url
                var value = getKeyLS(urlTab) //localStorage.getItem(key)
                var setValueLS = setKeyLS(urlTab)
                var setCode = pipe(toCode, setValueLS)


                console.log('//Ключ ' + value)
                console.log('isSelect(sel) ' + isSelect(sel))
                if (!isSelect(sel)) {
                    console.log('//Отправка ' + value)
                    sendTG(value, urlTab)
                } else {
                    if (!isKeyLS(value)) {
                        console.log('//Старт формирования ' + value)
                        isCode(sel) ? addCode(0, sel, urlTab) : starText(sel, urlTab)
                    } else {
                        console.log('//Продолжение формирования ' + value)
                        isCode(sel) ? addCode(1, sel, urlTab, value) : nextText(value, sel, urlTab)


                    }

                }


                /*
                  
                if (isKeyLS(value)) {
                    //Ключа нет
                    if (isSelect(sel)) {
                        // Форматирование сообщения
                        if (isCode(sel)) {
                            setCode(sel)
                            setOutput('Начало добавления:Код')

                        } else {
                            //Текст


                            var spl = splitN(getSelect())
                            var header = toB(spl.shift())
                            var source = toLink('Источник:', urlTab)
                            textStorage = map(toI, spl)

                            setKeyLS(urlTab, joinN([header, "", source, "", textStorage]))
                            setOutput('Начало добавления:Заголовок+Источник+Текст')
                        }

                    } else {
                        // Отправка сообщения
                        var grupLink = `Обсудить:` //${grupLink}`
                        var sendText = joinN([...splitN(value), '••••••••••', grupLink])

                        sendTelegram(sendText)
                        setOutput('Cообщение отправлено\nКлюч очищен')
                            //Удалить ключ
                        removeKeyLS(key)


                    }




                } else { //Ключь есть


                    if (isCode(sel)) { //Код

                        textStorage = toCode(sel)
                        setOutput('Продолжаем добавление:Код')

                    } else { //Текст

                        var splText = splitN(getSelect())
                        var spl = !isArrOne(splText) ? joinN(splText.map(toI)) : [toN(toB(plText[0]))]
                        var textStorage = joinN([value, "", spl])
                        setOutput('Продолжаем добавление:Текст')


                    }

                    setKeyLS(urlTab, textStorage)

                }
*/


            }
        );

    });