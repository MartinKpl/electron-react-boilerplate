import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import HotkeyRow from '../components/HotkeyRow';
import { useEffect, useState } from 'react';
import AddHotkeyDialog from '../components/AddHotkeyDialog';
import { BrowserWindow, ipcRenderer } from 'electron';
import { IGlobalKeyEvent } from 'node-global-key-listener';
import Store from 'electron-store'

export  interface Hotkey {
  text: string,
  active: boolean,
  modifierKey: string,
  hotkey: string
}

function MainWindow() {
  const [hotkeys, setHotkeys] = useState<Hotkey[]>([])
  const [showAddHotkeyDialog, setShowAddHotkeyDialog] = useState<boolean>(false)
  
  // const store = new Store()

  const addHotkey = (hotkey: Hotkey) => {
    console.log("Hotkey received: ", hotkey)

    if(window.electron){
      var storedHotkeys = JSON.parse(window.electron.store.get("hotkeys") ?? "[]") as HotkeysStorage
      
      if(storedHotkeys){
        storedHotkeys.push(hotkey)
        
        window.electron.store.set("hotkeys", JSON.stringify(storedHotkeys))
      }

    }
    
    setHotkeys([...hotkeys, hotkey])
  }

  const removeHotkey = (hotkey: Hotkey) => {
    if(window.electron){
      var storedHotkeys = JSON.parse(window.electron.store.get("hotkeys") ?? "[]") as HotkeysStorage
      
      if(storedHotkeys){
        storedHotkeys = storedHotkeys.filter((value: Hotkey) => {
          return value.hotkey !== hotkey.hotkey
        })
        window.electron.store.set("hotkeys", JSON.stringify(storedHotkeys))
      }

      setHotkeys(storedHotkeys)
    }    
  }


  useEffect(()=>{
    // if(window.electron){
    //   window.electron.onKeyPressed((keyEvent: IGlobalKeyEvent) => {
    //       console.log(keyEvent)
    //   })
    // }

    if(window.electron){
      var storedHotkeys = JSON.parse(window.electron.store.get("hotkeys")?? "[]") as HotkeysStorage
  
      console.log("Stored Hotkeys", storedHotkeys)
  
      setHotkeys(storedHotkeys ?? [])
    }

  }, [])

  return (
    <div className=' flex flex-col justify-center items-center w-screen h-screen p-4'>
      <div className=' w-full h-full border-2 border-gray-700 '>
        <div className="w-full h-fit border-b-2 border-b-gray-700 flex flex-row">
            <div className="w-3/5 flex ml-2 items-center">Text to paste</div>
            <div className=" px-2 border-l-2 border-l-gray-700 flex items-center justify-center ml-2">Active</div>
            {/* <div className="w-1/5 px-2">Modifiers</div> */}
            <div className="w-1/5 border-l-2 border-l-gray-700 px-2">Hotkey</div>
        </div>
        {hotkeys.map((hotkey: Hotkey, index: number) => { 
          return <HotkeyRow key={index} hotkeyValues={hotkey} onRemoveHotkey={removeHotkey}/>
        })}
      </div>
      <div className='flex flex-row w-full h-fit items-center p-4'>
        <button className='border-2 border-gray-700 p-2 rounded' onClick={() => setShowAddHotkeyDialog(!showAddHotkeyDialog)}>New</button>
        <div className='ml-auto'>
          <button className='border-2 border-gray-700 p-2 rounded mr-6'>Okay</button>
          <button className='border-2 border-gray-700 p-2 rounded mr-6'>Cancel</button>
        </div>
      </div>
      {showAddHotkeyDialog ? 
        <div className= ' fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-black border-2 p-4 w-1/2 h-1/2'>
          <AddHotkeyDialog onCloseHandle={setShowAddHotkeyDialog} hotkeySetter={addHotkey}/>
        </div>
        : 
        <></>
      }
  </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainWindow />} />
      </Routes>
    </Router>
  );
}
