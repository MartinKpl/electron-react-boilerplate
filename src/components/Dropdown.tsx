import { Select } from '@headlessui/react'

const modifiers = ["none", "alt", "shift", "control"]
const keys = ["none", "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"]

interface DropwdownProps {
    isModifiers: boolean
}

export default function Dropwdown(props: DropwdownProps) {
  return (
    <Select className="w-1/5 border-2 border-gray-500 m-2 p-2" name="status" aria-label="Project status">
        {(props.isModifiers ? modifiers : keys).map((name:string) => {
            return <option value={name}>{capitalize(name)}</option>
        })}
    </Select>
  )
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}