const { clipboard, ipcMain, Menu, BrowserWindow, app } = require('electron');
const { HandlerName } = require('./constant/handlerName');
const fs = require("fs")
const path = require('path');
const historyPath = path.join(app.getPath("appData"), "/clipboard/record.txt")
const logPath = path.join(app.getPath("appData"), "/clipboard/log.txt")
const menus = [
    {
        label: "删除",
        click: (e) => {
            BrowserWindow.getFocusedWindow().webContents.send("deleteItem", e.id)
        }
    }
]

const log = (data) => {
    fs.appendFileSync(logPath, data, err => {
        if (err) {
            console.log("log data error: %s", data, err)
        }
    })
}

const readText = () => {
    return clipboard.readText()
}

const rightClick = (e, id) => {
    menus.forEach(o => o.id = id)
    const menuContent = Menu.buildFromTemplate(menus)
    menuContent.popup({
        window: BrowserWindow.getFocusedWindow()
    })
}
const leftClick = (e, text) => {
    clipboard.writeText(text)
}
const saveHistory = (e, texts) => {
    if (!texts || texts.length === 0) {
        return
    }
    if (texts.length > 20) {
        texts = texts.slice(texts.length - 20, texts.length)
    }
    fs.writeFile(historyPath, JSON.stringify(texts), { flag: "w+" }, err => {
        if (err) {
            log(`报错记录失败:${JSON.stringify(texts)}, root cause: ${err}`)
        }
    })
}
const getHistory = () => {
    try {
        const history = fs.readFileSync(historyPath)
        if (!history) {
            return []
        }
        return JSON.parse(String(history))
    } catch (ex) {
        log("获取历史记录失败:" + ex)
        return []
    }
}
exports.initHandler = () => {
    ipcMain.handle(HandlerName.clipboardReadText, readText)
    ipcMain.handle(HandlerName.getHistory, getHistory)
    ipcMain.on(HandlerName.rightClick, rightClick)
    ipcMain.on(HandlerName.leftClick, leftClick)
    ipcMain.on(HandlerName.saveHistory, saveHistory)
}
