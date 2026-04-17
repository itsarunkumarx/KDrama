import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function TraktCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [status, setStatus] = useState('connecting'); // connecting | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      setError('Trakt login was denied or cancelled.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!code) {
      setStatus('error');
      setError('No authorization code received from Trakt.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Exchange code for token via our backend
    const exchangeCode = async () => {
      try {
        const res = await axios.post('/api/trakt/callback', { code });
        const { token, user } = res.data;

        // Save token and log user in
        localStorage.setItem('kdrama_token', token);
        loginWithToken(user);

        setStatus('success');
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        console.error('Trakt callback error:', err);
        setStatus('error');
        setError(err.response?.data?.message || 'Trakt login failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    exchangeCode();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-kdark to-black flex items-center justify-center">
      <div className="text-center">
        {/* Trakt Logo Area */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center text-5xl shadow-2xl border-2 border-red-400/50 animate-pulse">
              🎬
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-white">
              T
            </div>
          </div>
        </div>

        {status === 'connecting' && (
          <>
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-white text-2xl font-bold mb-2">Connecting to Trakt...</h2>
            <p className="text-gray-400 text-sm">Please wait while we verify your account</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h2 className="text-white text-2xl font-bold mb-2">Connected to Trakt!</h2>
            <p className="text-green-400 text-sm">Redirecting to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-white text-2xl font-bold mb-2">Login Failed</h2>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <p className="text-gray-500 text-xs">Redirecting back to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
