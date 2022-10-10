import { IpcRendererEvent } from 'electron'
declare global {
    declare interface MyClipboard {
        /**
         * 获取历史记录
         */
        getHistory: () => Promise<String[]>
        /**
         * 读取剪贴板
         */
        readText: () => Promise<String>
        /**
         * 点击右键
         */
        rightClick: (id: Number) => void
        /**
         * 点击左键
         */
        leftClick: (text: String) => void
        /**
         * 触发右键菜单删除事件
         */
        onDeleteItem: (e: IpcRendererEvent, id: String) => void
        /**
         * 保存历史记录
         */
        saveHistory: (texts: []) => void
    }

    /**
     * 全局的剪切板IPC对象
     */
    declare var myClipboard: MyClipboard
}