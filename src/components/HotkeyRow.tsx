import { ChangeEvent, useState } from "react";
import { Hotkey } from "../renderer/App";
import Dropdown from "./Dropdown";

interface HotkeyRowProps{
    hotkeyValues: Hotkey,
    onRemoveHotkey: (hotkey: Hotkey) => void
}

export default function HotkeyRow(props: HotkeyRowProps){
    const [checkboxValue, setCheckboxValue] = useState<boolean>(props.hotkeyValues.active)
    const [inputValue, setInputValue] = useState<string>(props.hotkeyValues.text)

    const handleHotkeyDropdownChange = (newValue: string, oldValue: string) => {
        if(window.electron){
            var storedHotkeys = JSON.parse(window.electron.store.get("hotkeys")?? "[]") as HotkeysStorage
            for(var hk of storedHotkeys){
                if(hk.hotkey === oldValue){
                    hk.hotkey = newValue
                    break
                }
            }
            window.electron.store.set("hotkeys", JSON.stringify(storedHotkeys))
        }
    }

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(window.electron){
            var storedHotkeys = JSON.parse(window.electron.store.get("hotkeys")?? "[]") as HotkeysStorage
            for(var hk of storedHotkeys){
                if(hk.hotkey === props.hotkeyValues.hotkey){
                    hk.active = event.currentTarget.checked
                    break
                }
            }
            window.electron.store.set("hotkeys", JSON.stringify(storedHotkeys))
        }
        setCheckboxValue(event.currentTarget.checked)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event)
        if(window.electron){
            var storedHotkeys = JSON.parse(window.electron.store.get("hotkeys")?? "[]") as HotkeysStorage
            for(var hk of storedHotkeys){
                if(hk.hotkey === props.hotkeyValues.hotkey){
                    hk.text = event.currentTarget.value
                    break
                }
            }
            window.electron.store.set("hotkeys", JSON.stringify(storedHotkeys))
        }
        setInputValue(event.currentTarget.value)
    }

    return(
        <div className="w-full h-fit border-b-2 border-b-gray-500 flex flex-row">
            <input onChange={handleInputChange} value={inputValue} className=" min-w-3/5 w-3/5 border-2 border-gray-500 m-2 p-2"/>
            <div className="p-2 border-x-2 border-x-gray-500 flex items-center justify-center w-[63px]"><input onChange={handleCheckboxChange} checked={checkboxValue} type="checkbox"/></div>
            {/* <div className="w-1/5 mr-4">
                <Dropdown onChange={handleHotkeyDropdownChange} value={props.hotkeyValues.modifierKey} isModifiers/>
            </div> */}
            <div className="flex flex-row mr-4 flex-grow justify-end items-center">
                <Dropdown onChange={handleHotkeyDropdownChange} value={props.hotkeyValues.hotkey}/>
                <button onClick={() => props.onRemoveHotkey(props.hotkeyValues)} className="bg-red-600 min-w-10 min-h-10 rounded text-white font-bold">X</button>
            </div>
        </div>
    )
}