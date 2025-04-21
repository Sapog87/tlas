import React, {useEffect, useRef, useState} from 'react';
import {login, signup} from "../../api/AuthService";

function LoginSignup({
                         setLogged,
                         showLoginModal,
                         setShowLoginModal
                     }) {
    const [isLogin, setIsLogin] = useState(true);
    const modalRef = useRef(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (showLoginModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showLoginModal]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowLoginModal(false);
            }
        };

        if (showLoginModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showLoginModal]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        try {
            if (isLogin) {
                const response = await login(username, password);
                if (!response.ok) {
                    if (response.status === 401) {
                        setError("Неверные логин или пароль");
                    } else {
                        setError("Что-то пошло не так!");
                    }
                } else {
                    const data = await response.json();
                    localStorage.setItem("token", data.token);

                    setLogged(true);
                    setShowLoginModal(false);
                }
            } else {
                if (password !== confirmPassword) {
                    setError("Пароли не совпадают");
                } else {
                    const response = await signup(name, username, password);
                    if (!response.ok) {
                        if (response.status === 409) {
                            setError("Пользователь с таким логином уже существует");
                        } else {
                            setError("Что-то пошло не так!");
                        }
                    } else {
                        const data = await response.json();
                        localStorage.setItem("token", data.token);

                        setLogged(true);
                        setShowLoginModal(false);
                    }
                }
            }
        } catch (error) {
            console.log(error);
            setError("Не удалось выполнить запрос. Попробуйте снова.");
        }
    };

    return (
        <div
            className="text-black fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-xl p-6 w-[400px] shadow-lg"
            >
                <div className="mb-4 text-center text-2xl">
                    <h2 className="text-2xl">{isLogin ? "Вход" : "Регистрация"}</h2>
                </div>

                {error && (
                    <div className="text-red-500 text-center mb-4 text-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {isLogin ? (
                        <>
                            <input
                                required={true}
                                type="username"
                                placeholder="Логин"
                                className="w-full mb-2 px-3 py-2 border rounded-xl"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <div className="relative w-full mb-2">
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Пароль"
                                    className="w-full px-3 py-2 border rounded-xl pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.304-3.947m3.198-2.182A9.964 9.964 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.969 9.969 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 3l18 18"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="mb-4 text-xs">
                                            <span
                                                onClick={() => setIsLogin(false)}
                                                className="text-blue-500 hover:underline cursor-pointer"
                                            >
                                              Нет аккаунта? Зарегистрируйтесь
                                            </span>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-700"
                            >
                                Войти
                            </button>
                        </>
                    ) : (
                        <>
                            <input
                                required={true}
                                type="username"
                                placeholder="Логин"
                                className="w-full mb-2 px-3 py-2 border rounded-xl"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <div className="relative w-full mb-2">
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Пароль"
                                    className="w-full px-3 py-2 border rounded-xl pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.304-3.947m3.198-2.182A9.964 9.964 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.969 9.969 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 3l18 18"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="relative w-full mb-2">
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Подтвердите пароль"
                                    className="w-full px-3 py-2 border rounded-xl pr-10"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.304-3.947m3.198-2.182A9.964 9.964 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.969 9.969 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 3l18 18"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <input
                                required={true}
                                type="text"
                                placeholder="Имя"
                                className="w-full mb-2 px-3 py-2 border rounded-xl"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <div className="mb-4 text-xs">
                                            <span
                                                onClick={() => setIsLogin(true)}
                                                className="text-blue-500 hover:underline cursor-pointer"
                                            >
                                              Уже есть аккаунт? Войдите
                                            </span>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-700"
                            >
                                Зарегистрироваться
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

export default LoginSignup;