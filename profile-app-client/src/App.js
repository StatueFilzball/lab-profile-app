import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
     <Routes>
     <Route path='/' element={<HomePage />} />
     <Route path='/signup' element={<SignUp />} />
     <Route path='/login' element={<Login />} />
     </Routes>
    </div>
  );
}

export default App;
