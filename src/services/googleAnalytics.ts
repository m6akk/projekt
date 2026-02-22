import { CONFIG } from '../config/config';
import { AnalyticsData, GAReportResponse, PageViewData } from '../types/analytics';

// Deklaracija Google API na Window objektu
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => any;
        };
      };
    };
  }
}

// Globalni token (spremamo ga u memory, ali ćemo ga čuvati i u sessionStorage)
let accessToken: string | null = null;

/**
 * Inicijalizacija Google auth-a
 */
export const initGoogleAuth = (callback: (response: any) => void) => {
  return new Promise((resolve, reject) => {
    // Provjeri da li je Google Identity Services učitan
    if (typeof window.google === 'undefined') {
      setTimeout(() => resolve(initGoogleAuth(callback)), 100);
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/userinfo.profile',
      callback: (response: any) => {
        callback(response);
        resolve(response);
      },
    });

    // Pokreni auth flow
    tokenClient.requestAccessToken();
  });
};

/**
 * Provjera da li je korisnik već autenticiran
 */
export const checkExistingAuth = (): boolean => {
  const token = sessionStorage.getItem('google_access_token');
  const expires = sessionStorage.getItem('token_expires');
  const userData = sessionStorage.getItem('user_data');

  if (token && expires && Date.now() < parseInt(expires)) {
    accessToken = token;
    return true;
  }
  
  return false;
};

/**
 * Dohvat korisničkih podataka
 */
export const fetchUserInfo = async (token: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch user info');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

/**
 * Obrada token odgovora
 */
export const handleTokenResponse = (response: any): { success: boolean; userData?: any } => {
  if (response.error) {
    console.error('Auth error:', response.error);
    return { success: false };
  }

  accessToken = response.access_token;
  sessionStorage.setItem('google_access_token', accessToken!);
  sessionStorage.setItem('token_expires', String(Date.now() + (response.expires_in * 1000)));

  return { success: true };
};

/**
 * GLAVNA FUNKCIJA: Dohvat analitičkih podataka
 */
export const fetchGoogleAnalyticsData = async (): Promise<AnalyticsData | null> => {
  if (!accessToken) {
    console.error('No access token available');
    return null;
  }

  const propertyId = CONFIG.GA_PROPERTY_ID;
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const requestBody = {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [
      { name: 'date' },
      { name: 'deviceCategory' },
      { name: 'sessionDefaultChannelGroup' }
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'eventCount' }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data: GAReportResponse = await response.json();
    
    if (!response.ok) {
      console.error('GA API Error:', data);
      return null;
    }

    return processAnalyticsData(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

/**
 * Obrada podataka iz API-ja
 */
const processAnalyticsData = (data: GAReportResponse): AnalyticsData => {
  let totalUsers = 0;
  let totalSessions = 0;
  let totalPageviews = 0;
  let totalDuration = 0;
  let totalBounce = 0;
  let totalEvents = 0;
  
  const deviceData = { desktop: 0, mobile: 0, tablet: 0 };
  const sourceData: Record<string, number> = {};
  const dailyMap: Record<string, number> = {};

  if (data.rows) {
    data.rows.forEach(row => {
      const date = row.dimensionValues[0]?.value || '';
      const device = row.dimensionValues[1]?.value?.toLowerCase() || 'unknown';
      const source = row.dimensionValues[2]?.value || 'unknown';

      const users = parseInt(row.metricValues[0]?.value) || 0;
      const sessions = parseInt(row.metricValues[1]?.value) || 0;
      const pageviews = parseInt(row.metricValues[2]?.value) || 0;
      const duration = parseFloat(row.metricValues[3]?.value) || 0;
      const bounce = parseFloat(row.metricValues[4]?.value) || 0;
      const events = parseInt(row.metricValues[5]?.value) || 0;

      totalUsers += users;
      totalSessions += sessions;
      totalPageviews += pageviews;
      totalDuration += duration;
      totalBounce += bounce;
      totalEvents += events;

      // Device data
      if (device in deviceData) {
        deviceData[device as keyof typeof deviceData] += users;
      }

      // Source data
      sourceData[source] = (sourceData[source] || 0) + users;

      // Daily data (aggregate per date)
      dailyMap[date] = (dailyMap[date] || 0) + users;
    });
  }

  const rowCount = data.rows?.length || 1;
  const avgDurationSeconds = totalDuration / rowCount;
  const minutes = Math.floor(avgDurationSeconds / 60);
  const seconds = Math.floor(avgDurationSeconds % 60);

  // Format daily data
  const dailyUsers = Object.entries(dailyMap)
    .map(([date, users]) => ({ date, users }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalUsers,
    totalSessions,
    totalPageviews,
    avgDuration: `${minutes}m ${seconds}s`,
    bounceRate: Number((totalBounce / rowCount).toFixed(2)),
    totalEvents,
    deviceData,
    sourceData,
    dailyUsers
  };
};

/**
 * Dohvat podataka za najpopularnije stranice
 */
export const fetchPageViewsData = async (): Promise<PageViewData[]> => {
  if (!accessToken) return [];

  const propertyId = CONFIG.GA_PROPERTY_ID;
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

  const requestBody = {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    // Include both pageTitle and pagePath so we can show human titles and unique paths
    dimensions: [{ name: 'pageTitle' }, { name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (!response.ok || !data.rows) return [];

    return data.rows.map((row: any) => ({
      name: `${row.dimensionValues[0]?.value || 'Unknown'} (${row.dimensionValues[1]?.value || '/'})`,
      views: parseInt(row.metricValues[0]?.value) || 0
    }));
  } catch (error) {
    console.error('Error fetching page views:', error);
    return [];
  }
};