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
import { getStoredRecipes } from '@/hooks/useRecipeStorage';
import { generateUserBasedRecommendations } from '@/utils/recommendations';
import RecipeRecommendationCards from '@/components/RecipeRecommendationCards';

const Analytics: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [pageViews, setPageViews] = useState<PageViewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recommendations' | 'funnel'>('dashboard');

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
      {/* Back button (top-left fixed) */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/'}
          className="cartoon-button bg-accent text-accent-foreground px-4 py-2 inline-flex items-center shadow-card"
          aria-label="Nazad"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0L3.586 10l4.707-4.707a1 1 0 011.414 1.414L6.414 10l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Nazad
        </button>
      </div>

      {/* Navigation - fixed at top */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
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

      {/* Tabovi */}
      <div className="bg-white border-b-[3px] border-primary sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              className={`py-4 px-6 border-b-[3px] font-display text-sm uppercase transition-colors ${
                activeTab === 'dashboard' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Nadzorna ploča
            </button>
            <button
              className={`py-4 px-6 border-b-[3px] font-display text-sm uppercase transition-colors ${
                activeTab === 'recommendations' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('recommendations')}
            >
              🍽️ Preporuke
            </button>
            <button
              className={`py-4 px-6 border-b-[3px] font-display text-sm uppercase transition-colors ${
                activeTab === 'funnel' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('funnel')}
            >
              📈 Analiza
            </button>
          </div>
        </div>
      </div>

      {/* Glavni sadržaj */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {activeTab === 'dashboard' && (
          <>
            <KPICards data={analyticsData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <DeviceChart data={analyticsData.deviceData} />
              <UsersTimeChart data={analyticsData.dailyUsers} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PagesChart data={pageViews} />
              <TrafficChart data={analyticsData.sourceData} />
            </div>
          </>
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsTab />
        )}

        {activeTab === 'funnel' && (
          <FunnelAnalysisTab pageViews={pageViews} />
        )}
      </main>
    </div>
  );
};

export default Analytics;

// Recommendations tab component
const RecommendationsTab: React.FC = () => {
  const recipes = getStoredRecipes();
  const recommendations = generateUserBasedRecommendations(recipes, 6);

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-[3px] border-primary/20 p-8">
        <p className="text-gray-600 text-lg mb-4">
          📚 Nema dovoljno podataka za personalizirane preporuke
        </p>
        <p className="text-gray-500 text-sm">
          Pregledom recepata sustav će bolje razumjeti vaše preferencije i ponuditi bolje preporuke.
        </p>
      </div>
    );
  }

  return <RecipeRecommendationCards recommendations={recommendations} />;
};

// Funnel analysis tab component  
const FunnelAnalysisTab: React.FC<{ pageViews: PageViewData[] }> = ({ pageViews }) => {
  const topPages = pageViews.slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6 border-[3px] border-primary/20">
        <h2 className="text-xl font-display font-bold text-primary mb-6">
          📊 Analiza koraka pretvaranja
        </h2>
        
        <div className="space-y-4">
          {topPages.map((page, index) => {
            const percentage = index === 0 ? 100 : Math.round((page.views / topPages[0].views) * 100);
            
            return (
              <div key={page.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-ui">
                    <strong>Korak {index + 1}:</strong> {page.name}
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {page.views} pregleda ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-full rounded transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-white text-xs font-bold flex items-center justify-end pr-2 h-full">
                      {percentage > 20 ? `${percentage}%` : ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-secondary/20 rounded-lg border-[2px] border-secondary/50">
          <p className="text-sm text-gray-700 font-ui">
            <strong>Napomena:</strong> Ova analiza pokazuje najbolje pregledane stranice i stopu napuštanja
            između njih. Veće razlike mezi koracima ukazuju na potrebu za optimizacijom korisničkog sučelja.
          </p>
        </div>
      </div>
    </div>
  );
};