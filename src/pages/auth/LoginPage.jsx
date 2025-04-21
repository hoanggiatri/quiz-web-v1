import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:8080/auth/login', {
        email,
        password
      });

      const userData = res.data.data; // userId, username, role, token...
      login(userData); // lưu vào AuthContext và localStorage

      switch (userData.role) {
        case 'STUDENT':
          navigate('/student');
          break;
        case 'TEACHER':
          navigate('/teacher');
          break;
        case 'ADMIN':
          navigate('/admin');
          break;
        default:
          navigate('/unauthorized');
      }
    } catch (err) {
      console.error(err);
      setError('Email hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-4 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-2 mb-4 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
