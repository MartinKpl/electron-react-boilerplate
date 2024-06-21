import { Select } from '@headlessui/react'
import { ChangeEvent, useState } from 'react'

const modifiers = ["none", "alt", "shift", "control"]
const keys = ["none", "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"]

interface DropwdownProps {
    isModifiers?: boolean,
    onChange?: (newValue: string, oldValue: string) => void
    value?: string | number | readonly string[] | undefined
}

export default function Dropwdown(props: DropwdownProps) {
  const [selectValue, setSelectValue] = useState<string | number | readonly string[] | undefined>(props.value === "" ? 'none' : props.value)

  var previousVal = "none"

  function test (event: ChangeEvent<HTMLSelectElement>){
    console.log(event)
    var currentValue = event.currentTarget.value === "" ? 'none' : event.currentTarget.value
    if(props.onChange)
      props.onChange(currentValue, previousVal)

    setSelectValue(currentValue)
  }
  
  return (
    <Select onFocus={(e: React.FocusEvent<HTMLSelectElement>) => {previousVal=e.currentTarget.value}} value={selectValue} onChange={test} className="w-full border-2 border-gray-500 m-2 p-2" name="status" aria-label="Project status">
        {(props.isModifiers ? modifiers : keys).map((name:string, index: number) => {
            return <option key={name+index} value={name}>{capitalize(name)}</option>
        })}
    </Select>
  )
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}