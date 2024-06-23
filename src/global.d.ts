interface ElectronAPI {
    onKeyPressed: (callback: (text: any) => void) => void
}

interface Window {
    electron: ElectronAPI
}