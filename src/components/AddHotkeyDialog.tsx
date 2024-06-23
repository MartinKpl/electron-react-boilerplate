import { useState } from "react";
import { Hotkey } from "../renderer/App";
import Dropwdown from "./Dropdown";

interface AddHotkeyDialogProps {
    onCloseHandle: React.Dispatch<React.SetStateAction<boolean>>,
    hotkeySetter: (hotkey: Hotkey) => void
}

export default function AddHotkeyDialog(props: AddHotkeyDialogProps) {
    const [hotkey, setHotkey] = useState<Hotkey>({
        text: "",
        active: true,
        modifierKey: "",
        hotkey: ""
    })

    function setText(e: React.ChangeEvent<HTMLInputElement>){
        setHotkey({...hotkey, text: e.currentTarget.value})
    }

    function addHandle(){
        props.hotkeySetter(hotkey)
        props.onCloseHandle(false)
    }

    return (
        <div>
            <div>
                <div className="w-3/4">
                    <h1>Text to paste</h1>
                    <input value={hotkey.text} onChange={setText} className="border-2 border-gray-500 m-2 p-2 w-full"></input>
                </div>
                <div className="w-3/4">
                    <h1>Modifier</h1>
                    <Dropwdown onChange={(newValue: string)=>setHotkey({...hotkey, modifierKey: newValue})} isModifiers/>
                </div>
                <div className="w-3/4">
                    <h1>Hotkey</h1>
                    <Dropwdown onChange={(newValue: string)=>setHotkey({...hotkey, hotkey: newValue})}/>
                </div>
            </div>
            <div className='ml-auto w-fit mt-4'>
            <button className='p-2 rounded mr-6 bg-blue-400' onClick={addHandle}>Add</button>
            <button className=' p-2 rounded mr-6' onClick={()=>props.onCloseHandle(false)}>Cancel</button>
            </div>
        </div>
    )
}