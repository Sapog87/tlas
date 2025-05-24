import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import EmptySearchPage from "./components/SearchPage/EmptySearchPage";
import SearchPage from "./components/SearchPage/SearchPage";
import {info} from "./api/UserService";
import LoginSignup from "./components/Auth/LoginSignup";
import {Helmet} from "react-helmet";

function App() {
    const [logged, setLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLogged(false);
        } else {
            info(token)
                .then(response => {
                    console.log(response);
                    if (response.status === 401 || response.status !== 200) {
                        localStorage.removeItem("token");
                        setLogged(false);
                    } else if (response.status === 200) {
                        setLogged(true);
                        return response.json();
                    }
                })
                .then(data => {
                    setUser(data);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <>
            <Helmet>
                <title>TLAS</title>
            </Helmet>
            <div className='min-h-full grid'>
                <Routes>
                    <Route path='*' element={<Navigate to={'/'}/>}/>
                    <Route path='/' element={
                        <EmptySearchPage
                            logged={logged}
                            setLogged={setLogged}
                            setShowLoginModal={setShowLoginModal}
                            user={user}
                        />
                    }/>
                    <Route path='/search' element={
                        <SearchPage
                            logged={logged}
                            setLogged={setLogged}
                            setShowLoginModal={setShowLoginModal}
                            user={user}
                        />
                    }/>
                </Routes>
                {showLoginModal &&
                    <LoginSignup
                        setLogged={setLogged}
                        showLoginModal={showLoginModal}
                        setShowLoginModal={setShowLoginModal}
                        checkAuth={checkAuth}
                    />
                }
            </div>
        </>
    );
}

export default App;