import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Support from './pages/Support';
import Program from './pages/Program';
import Plan from './pages/Plan';
import List from './pages/List';
import Alumni from './pages/Alumni';
import System from './pages/System';
import Link from './pages/Link';

function App() {
  return (
    <main>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/program" element={<Program />}/>
        <Route path="/plan" element={<Plan />}/>
        <Route path="/list" element={<List />}/>
        <Route path="/alumni" element={<Alumni />}/>
        <Route path="/system" element={<System />}/>
        <Route path="/link" element={<Link />}/>
        <Route path="/support" element={<Support />}/>
      </Routes>
    </main>
  );
}

export default App;
