import React from 'react';

import Header from "../Header";
import Main from "../Main";
import Footer from "../Footer";

import './style.scss'

const App = () => {
    return (
        <div className='container'>
            <Header/>
            <Main/>
            <Footer/>
        </div>
    );
};

export default App;