import Dropdown from "./Dropdown";

export default function HotkeyRow(){
    return(
        <div className="w-full h-fit border-b-2 border-b-gray-500 flex flex-row">
            <input className="w-1/2 border-2 border-gray-500 m-2 p-2"/>
            <div className="p-2 border-x-2 border-x-gray-500 flex items-center justify-center"><input type="checkbox"/></div>
            <Dropdown isModifiers/>
            <Dropdown/>
        </div>
    )
}