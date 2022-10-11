
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myClipboard', {
    readText: () => {
        return ipcRenderer.invoke("clipboard.readText")
    },
    getHistory: () => {
        return ipcRenderer.invoke("getHistory")
    },
    selectFile: () => {
        return ipcRenderer.invoke("selectFile")
    },
    rightClick: (id) => {
        ipcRenderer.send("rightClick", id)
    },
    leftClick: (text) => {
        ipcRenderer.send("leftClick", text)
    },
    onDeleteItem: (id) => {
        ipcRenderer.on("deleteItem", id)
    },
    saveHistory: (texts) => {
        ipcRenderer.send("saveHistory", texts)
    }
});
