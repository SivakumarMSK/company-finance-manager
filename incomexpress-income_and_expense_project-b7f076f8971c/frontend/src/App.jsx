import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StudentDetail from './pages/Student/AddStudent/StudentDetail';
import ClientDetail from './pages/Client/AddClient/ClientDetail';
import DisplayStudent from './pages/Student/DisplayStudent/DisplayStudent';
import DisplayClient from './pages/Client/DisplayClient/DisplayClient';
import StudentReport from './pages/Report/StudentReport/StudentReport';
import ClientReport from './pages/Report/ClientReport/ClientReport';
import Expense from './pages/Expense/Expense';
import Paymenthistory from './pages/PaymentHistory/Paymenthistory';
import Income from './pages/Income/Income';
import Invoice from './pages/Invoice/Invoice';

const AppContent = () => {
    const location = useLocation();
    const homeroute = location.pathname === '/';
    
    

   

    return (
        <>
            {!homeroute  && (
            <Sidebar/>    
            )}
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sidebar" element={<Sidebar />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='/student' element={<StudentDetail/>}/>
                <Route path='/client' element={<ClientDetail/>}/>
                <Route path='/displaystudent' element={<DisplayStudent/>}/>
                <Route path='/displayclient' element={<DisplayClient/>}/>
                <Route path='studentreport' element={<StudentReport/>}></Route>
                <Route path='clientreport' element={<ClientReport/>}></Route>
                <Route path='/expense' element={<Expense/>}/>
                <Route path='/paymenthistory' element={<Paymenthistory/>}/>
                <Route path='/income' element={<Income/>}/>
                <Route path='/invoice' element={<Invoice/>}/>
                
            </Routes>
        </>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
