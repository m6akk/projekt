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
import { 
  generateUserBasedRecommendationsExcludingViewed, 
  cosineSimilarity, 
  getRecipeFeatures 
} from '@/utils/recommendations';
import { fetchUserInteractionsFromGA4, analyzeRecipeViewsFromGA4, calculateProfileFromGA4Views } from '@/services/ga4Recommendations';
import { performFunnelAnalysis, generateFunnelInsights, FunnelStep } from '@/services/ga4Funnel';
import { performRetentionAnalysis, generateRetentionInsights, RetentionSegment } from '@/services/ga4Retention';
import RecipeRecommendationCards from '@/components/RecipeRecommendationCards';

const Analytics: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [pageViews, setPageViews] = useState<PageViewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recommendations' | 'funnel' | 'retention'>('dashboard');

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const hasAuth = checkExistingAuth();
      
      if (hasAuth) {
        const storedUserData = sessionStorage.getItem('user_data');
        const token = sessionStorage.getItem('google_access_token');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
        if (token) {
          setAccessToken(token);
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
    const token = sessionStorage.getItem('google_access_token');
    if (token) {
      setAccessToken(token);
    }
    setIsAuthenticated(true);
    await loadAnalyticsData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('google_access_token');
    sessionStorage.removeItem('token_expires');
    sessionStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setAccessToken(null);
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
            <button
              className={`py-4 px-6 border-b-[3px] font-display text-sm uppercase transition-colors ${
                activeTab === 'retention' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('retention')}
            >
              🔄 Vraćanja
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
          <RecommendationsTab accessToken={accessToken} />
        )}

        {activeTab === 'funnel' && (
          <FunnelAnalysisTab accessToken={accessToken} />
        )}

        {activeTab === 'retention' && (
          <RetentionAnalysisTab accessToken={accessToken} />
        )}
      </main>
    </div>
  );
};

// Retention analysis tab component
const RetentionAnalysisTab: React.FC<{ accessToken: string | null }> = ({ accessToken }) => {
  const [retentionData, setRetentionData] = useState<RetentionSegment[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRetention() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await performRetentionAnalysis(accessToken);
        setRetentionData(data);
        setInsights(generateRetentionInsights(data));
      } catch (error) {
        console.error('Error loading retention:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRetention();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Učitavanje analize vraćanja...</p>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-[3px] border-primary/20 p-8">
        <p className="text-gray-600 text-lg">
          🔄 Trebate biti prijavljeni za analizu vraćanja
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6 border-[3px] border-primary/20">
        <h2 className="text-xl font-display font-bold text-primary mb-6">
          🔄 Analiza vraćanja korisnika
        </h2>

        {retentionData.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Nema dostupnih podataka</p>
        ) : (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {retentionData.map((segment) => (
                <div key={segment.segment} className="bg-primary/10 rounded-lg p-4 border-l-4 border-primary">
                  <h3 className="font-display font-bold text-primary mb-2">{segment.segment}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Ukupno korisnika:</span>
                      <span className="font-bold">{segment.totalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Novi korisnici:</span>
                      <span className="font-bold text-blue-600">{segment.newUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Vraćeni korisnici:</span>
                      <span className="font-bold text-green-600">{segment.returningUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-primary/20">
                      <span className="text-gray-700 font-bold">Stopa vraćanja:</span>
                      <span className="font-bold text-primary text-lg">{segment.retentionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Retention rate bars */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-ui font-bold text-gray-700 mb-4">Usporedba stopa vraćanja:</h3>
              <div className="space-y-3">
                {retentionData.map((segment) => (
                  <div key={segment.segment}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-ui text-gray-700">{segment.segment}</span>
                      <span className="text-sm font-bold text-primary">{segment.retentionRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-6">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-full rounded transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.min(segment.retentionRate, 100)}%` }}
                      >
                        {segment.retentionRate > 10 && (
                          <span className="text-white text-xs font-bold">{segment.retentionRate.toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border-[3px] border-secondary/20">
          <h3 className="text-lg font-display font-bold text-foreground mb-4">💡 Uvidi</h3>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-3 bg-secondary/10 rounded-lg border-l-4 border-secondary">
                <p className="text-sm font-ui text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

// Recommendations tab component
const RecommendationsTab: React.FC<{ accessToken: string | null }> = ({ accessToken }) => {
  const recipes = getStoredRecipes();
  const [recommendations, setRecommendations] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        // 1. Dohvati stvarne podatke iz GA4
        const ga4Data = await fetchUserInteractionsFromGA4(accessToken);
        if (!ga4Data) {
          setLoading(false);
          return;
        }

        // 2. Analiziraj koje recepte je korisnik gledao
        const viewedRecipes = analyzeRecipeViewsFromGA4(ga4Data);

        // 3. Generiraj profil na temelju stvarnih pregleda
        const userProfile = calculateProfileFromGA4Views(viewedRecipes, recipes);

        // 4. Generiraj preporuke koristeći GA4 profil, ali isključi pregledane recepte
        const recs = generateUserBasedRecommendationsExcludingViewed(
          userProfile,
          recipes,
          viewedRecipes,
          6
        );

        setRecommendations(recs);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [accessToken, recipes]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Učitavanje preporuka...</p>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-[3px] border-primary/20 p-8">
        <p className="text-gray-600 text-lg">
          📚 Trebate biti prijavljeni za personalizirane preporuke
        </p>
      </div>
    );
  }

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
const FunnelAnalysisTab: React.FC<{ accessToken: string | null }> = ({ accessToken }) => {
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFunnel() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await performFunnelAnalysis(accessToken);
        setFunnelData(data);
        setInsights(generateFunnelInsights(data));
      } catch (error) {
        console.error('Error loading funnel:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFunnel();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Učitavanje funnel analize...</p>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-[3px] border-primary/20 p-8">
        <p className="text-gray-600 text-lg">
          📊 Trebate biti prijavljeni za analizu
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6 border-[3px] border-primary/20">
        <h2 className="text-xl font-display font-bold text-primary mb-6">
          📊 Analiza koraka pretvaranja
        </h2>

        {funnelData.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Nema dostupnih podataka</p>
        ) : (
          <div className="space-y-6">
            {(() => {
              const firstStepUsers = funnelData[0]?.users || 1;
              return funnelData.map((step, index) => {
                // Clamp percentage to max 100% to avoid impossible >100% visuals
                const percentage = Math.min(
                  Math.round((step.users / Math.max(firstStepUsers, 1)) * 100),
                  100
                );

                // If dropOff is negative (increase), show as 0% drop-off
                const dropOff = step.dropOff && step.dropOff > 0 ? step.dropOff : 0;

                return (
                  <div key={step.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-ui">
                        <strong>Korak {index + 1}:</strong> {step.name}
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {step.users} korisnika ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-full rounded transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 15 && (
                          <span className="text-white text-xs font-bold">
                            {percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                    {dropOff > 0 && (
                      <p className="text-xs text-red-600 font-ui">
                        ↓ Drop-off: {dropOff}%
                      </p>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border-[3px] border-secondary/20">
          <h3 className="text-lg font-display font-bold text-foreground mb-4">💡 Uvidi</h3>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-3 bg-secondary/10 rounded-lg border-l-4 border-secondary">
                <p className="text-sm font-ui text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};