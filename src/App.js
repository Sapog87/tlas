import './App.css';
import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Footer from './components/Footer/Footer';
import EmptySearchPage from "./components/SearchPage/EmptySearchPage";
import SearchPage from "./components/SearchPage/SearchPage";

function App() {

    return (
        <div className='Window'>
            <Routes>
                <Route path='*' element={<Navigate to={'/'}/>}/>
                <Route path='/' element={<EmptySearchPage/>}/>
                <Route path='/search' element={<SearchPage/>}/>
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;