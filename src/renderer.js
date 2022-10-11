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
            if (!res || res === lastOne || res === saved) {
                return
            }
            if (texts.length == 0 || res != texts[texts.length - 1]) {
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
    const classList = Array.from(content.children?.[0]?.classList || []).join(" ") || "item color"
    item.classList = [classList]
    item.title = text
    content.prepend(item)
}

window.onload = () => {
    window.addEventListener("contextmenu", e => {
        e.preventDefault()
        const target = e.target;
        if (target.id && target.id.startsWith("item_")) {
            const id = parseInt(target.id.replace("item_", ""))
            myClipboard.rightClick(id)
        }
    })
    window.addEventListener("click", e => {
        e.preventDefault()
        const target = e.target;
        if (target.id && target.id.startsWith("item_")) {
            saved = target.title
            myClipboard.leftClick(saved)
        } else if (target.id && target.id == "clean-all") {
            this.texts = []
            const content = document.getElementById("content")
            content.innerHTML = null
            myClipboard.saveHistory([])
        } else if (target.id && target.id == "background-image") {
            myClipboard.selectFile().then(file => {
                console.log("选取文件成功")
                document.body.style.backgroundImage = `URL(${URL.createObjectURL(new Blob([file]))})`
                document.body.style.backgroundColor = null
                Array.from(document.getElementsByClassName("item")).forEach(e => {
                    e.classList.remove("color")
                })
            })
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