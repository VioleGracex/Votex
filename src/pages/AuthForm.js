import React, { useState } from 'react';

function AuthForm() {
    const [view, setView] = useState('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const register = async () => {
        console.log('Registering with', { username, email, password }); // Log the input data
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const result = await response.json();
        console.log('Register response:', result); // Log the response from the backend
    
        if (response.ok) {
            alert('Registration successful!');
        } else {
            alert(result.error);
        }
    };
    
    const login = async () => {
        console.log('Logging in with', { email, password }); // Log the input data
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
    
        const result = await response.json();
        console.log('Login response:', result); // Log the response from the backend
    
        if (response.ok) {
            alert('Login successful!');
            localStorage.setItem('token', result.token);
        } else {
            alert(result.error);
        }
    };
    

    const sendResetLink = async () => {
        const response = await fetch('/send-reset-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Password reset link sent to your email!');
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md border border-gray-300 rounded-lg">
            {view === 'register' && (
                <>
                    <h2 className="text-center text-2xl mb-4">Register</h2>
                    <div className="form-group mb-4">
                        <label htmlFor="username" className="block mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="email" className="block mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="password" className="block mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <button
                            onClick={register}
                            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Register
                        </button>
                    </div>
                    <div className="text-center">
                        <button onClick={() => setView('login')} className="text-blue-500 hover:underline">Already have an account? Login</button>
                    </div>
                </>
            )}
            {view === 'login' && (
                <>
                    <h2 className="text-center text-2xl mb-4">Login</h2>
                    <div className="form-group mb-4">
                        <label htmlFor="loginEmail" className="block mb-2">Email</label>
                        <input
                            type="email"
                            id="loginEmail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="loginPassword" className="block mb-2">Password</label>
                        <input
                            type="password"
                            id="loginPassword"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <button
                            onClick={login}
                            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Login
                        </button>
                    </div>
                    <div className="text-center">
                        <button onClick={() => setView('register')} className="text-blue-500 hover:underline">Don't have an account? Register</button>
                        <button onClick={() => setView('forgotPassword')} className="text-blue-500 hover:underline ml-4">Forgot Password?</button>
                    </div>
                </>
            )}
            {view === 'forgotPassword' && (
                <>
                    <h2 className="text-center text-2xl mb-4">Reset Password</h2>
                    <div className="form-group mb-4">
                        <label htmlFor="resetEmail" className="block mb-2">Email</label>
                        <input
                            type="email"
                            id="resetEmail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <button
                            onClick={sendResetLink}
                            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Send Reset Link
                        </button>
                    </div>
                    <div className="text-center">
                        <button onClick={() => setView('login')} className="text-blue-500 hover:underline">Back to Login</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AuthForm;