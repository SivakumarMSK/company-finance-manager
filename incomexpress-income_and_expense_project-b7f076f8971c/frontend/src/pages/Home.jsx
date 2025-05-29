import React,{useState} from 'react';


import '../pages/PageStyles/Home.css';
// import img from '../assets/home.jpg';
import Login from './Login';

const Home = () => {
    return (
        <div className="home-con">
            <Login/>
        </div>
    );
};

export default Home;
