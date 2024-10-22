export interface ReportInfo {
  id: number;
  latitude: number;
  longitude: number;
  reportCount: number;
}

export interface ReportHistory {
  id: number;
  createdAt: string;
  reportLocation: string;
  status: string;
  message: string;
}
