import React, { useState, useEffect } from 'react';
import GoogleLogin from '../components/auth/GoogleLogin';
import KPICards from '../components/charts/KPICards';
// @ts-ignore
import DeviceChart from '../components/charts/DeviceChart';
import UsersTimeChart from '../components/charts/UsersTimeChart';
import PagesChart from '../components/charts/PagesChart';
import TrafficChart from '../components/charts/TrafficChart';
import { 
  checkExistingAuth, 
  fetchGoogleAnalyticsData, 
  fetchPageViewsData,
  fetchUserInfo 
} from '../services/googleAnalytics';
import { AnalyticsData, PageViewData } from '../types/analytics';

const Analytics: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [pageViews, setPageViews] = useState<PageViewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const hasAuth = checkExistingAuth();
      
      if (hasAuth) {
        const storedUserData = sessionStorage.getItem('user_data');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
        setIsAuthenticated(true);
        await loadAnalyticsData();
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    try {
      const [analytics, pages] = await Promise.all([
        fetchGoogleAnalyticsData(),
        fetchPageViewsData()
      ]);

      if (analytics) setAnalyticsData(analytics);
      if (pages.length > 0) setPageViews(pages);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (user: any) => {
    setUserData(user);
    setIsAuthenticated(true);
    await loadAnalyticsData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('google_access_token');
    sessionStorage.removeItem('token_expires');
    sessionStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUserData(null);
    setAnalyticsData(null);
  };

  if (!isAuthenticated) {
    return <GoogleLogin onLoginSuccess={handleLoginSuccess} />;
  }

  if (loading || !analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje analitičkih podataka...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h1>
            
            {userData && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {userData.picture && (
                    <img 
                      src={userData.picture} 
                      alt={userData.name}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">{userData.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Odjava
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KPICards data={analyticsData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DeviceChart data={analyticsData.deviceData} />
          <UsersTimeChart data={analyticsData.dailyUsers} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PagesChart data={pageViews} />
          <TrafficChart data={analyticsData.sourceData} />
        </div>
      </main>
    </div>
  );
};

export default Analytics;