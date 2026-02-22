import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initGoogleAuth, handleTokenResponse, fetchUserInfo } from '../../services/googleAnalytics';

interface GoogleLoginProps {
  onLoginSuccess: (userData: any) => void;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await initGoogleAuth(async (response: any) => {
        const result = handleTokenResponse(response);
        
        if (result.success && response.access_token) {
          const userData = await fetchUserInfo(response.access_token);
          if (userData) {
            sessionStorage.setItem('user_data', JSON.stringify(userData));
            onLoginSuccess(userData);
          }
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Back button top-left */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="cartoon-button bg-accent text-accent-foreground px-4 py-2 inline-flex items-center shadow-card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0L3.586 10l4.707-4.707a1 1 0 011.414 1.414L6.414 10l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Nazad
        </button>
      </div>

      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Analitika
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Prijavite se s Google računom za pristup analitičkim podacima
          </p>
        </div>
        <div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Prijavljivanje...
              </span>
            ) : (
              'Prijavi se s Google računom'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;