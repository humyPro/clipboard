const texts = []
let lastOne = null;
let saved = null

myClipboard.getHistory().then(history => {
    if (history && history.length != 0) {
        history.forEach(h => {
            texts.push(h)
            appendText(h)
            lastOne = h
        })
    }

    setInterval(() => {
        myClipboard.readText().then(res => {
            res = res.trim()
            if (!res) {
                return
            }
            if (res === lastOne || res === saved) {
                return
            }
            if (texts.length == 0) {
                texts.push(res)
                appendText(res)
                lastOne = res
                myClipboard.saveHistory(texts)
                return
            }
            if (res != texts[texts.length - 1]) {
                texts.push(res)
                appendText(res)
                lastOne = res
                myClipboard.saveHistory(texts)
                return
            }

        })
    }, 300);
})


function appendText(text) {
    const content = document.getElementById("content")
    const item = document.createElement("div")
    item.innerText = text
    item.id = "item_" + (texts.length - 1)
    item.classList = ["item"]
    item.title = text
    content.prepend(item)
}

window.onload = () => {
    window.addEventListener("contextmenu", e => {
        e.preventDefault()
        if (e.target.id && e.target.id.startsWith("item_")) {
            const id = parseInt(e.target.id.replace("item_", ""))
            myClipboard.rightClick(id)
        }
    })
    window.addEventListener("click", e => {
        e.preventDefault()
        if (e.target.id && e.target.id.startsWith("item_")) {
            saved = e.target.title
            myClipboard.leftClick(saved)
        }
    })
}

myClipboard.onDeleteItem((e, id) => {
    if (id < 0) {
        return
    }
    texts.splice(id, 1)
    const content = document.getElementById("content")
    content.removeChild(document.getElementById("item_" + id))
    const childs = Array.from(content.childNodes).filter(element => {
        return element.id && element.id.startsWith("item_")
    })
    const length = childs.length - 1
    childs.forEach((element, i) => {
        if (element.id.startsWith("item_")) {
            element.id = "item_" + (length - i)
        }
    });
    myClipboard.saveHistory(texts)
})