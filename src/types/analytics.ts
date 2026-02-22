export interface AnalyticsData {
  totalUsers: number;
  totalSessions: number;
  totalPageviews: number;
  avgDuration: string; // formatirano kao "Xm Ys"
  bounceRate: number;
  totalEvents: number;
  deviceData: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  sourceData: Record<string, number>;
  dailyUsers: Array<{ date: string; users: number }>;
}

export interface PageViewData {
  name: string;
  views: number;
}

// Tip za odgovor iz Google Analytics API-ja
export interface GAReportResponse {
  rows?: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
}