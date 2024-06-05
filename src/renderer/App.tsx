import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import HotkeyRow from '../components/HotkeyRow';

function MainWindow() {
  return (
    <div className=' flex flex-col justify-center items-center w-screen h-screen p-4'>
      <div className=' w-full h-full border-2 border-gray-700 '>
        <div className="w-full h-fit border-b-2 border-b-gray-700 flex flex-row">
            <div className="w-1/2 flex ml-2 items-center">Text to paste</div>
            <div className=" px-2 border-x-2 border-x-gray-700 flex items-center justify-center">Active</div>
            <div className="w-1/5 px-2">Modifiers</div>
            <div className="w-1/5 border-l-2 border-l-gray-700 px-2">Hotkey</div>
        </div>
        <HotkeyRow/>
      </div>
      <div className='flex flex-row w-full h-fit items-center p-4'>
        <button className='border-2 border-gray-700 p-2 rounded'>New</button>
        <div className='ml-auto'>
          <button className='border-2 border-gray-700 p-2 rounded mr-6'>Okay</button>
          <button className='border-2 border-gray-700 p-2 rounded mr-6'>Cancel</button>
        </div>
      </div>
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
