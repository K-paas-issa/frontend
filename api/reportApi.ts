import { useMutation, useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export interface ReportInfo {
  id: number;
  latitude: number;
  longitude: number;
  reportCount: number;
}

export interface ReportHistory {
  id: number;
  serialCode: string;
  isCheckedStatus: boolean | null;
  reportedLatitude: number;
  reportedLongitude: number;
  reportedTime: string;
  centerLatitude: number;
  centerLongitude: number;
  streetAddress: string;
}

export interface ReportRequest {
  image: FormData;
  request: {
    longitude: number;
    latitude: number;
  };
}

export interface ReportResponse {
  code: string;
}

export interface ReportHistoryRequest {
  code: string[];
}

export function useReportApi() {
  return useMutation({
    mutationFn: ({ image }: ReportRequest) => {
      return httpClient<ReportResponse>({
        method: "POST",
        url: "/balloons/report",
        data: image,
      });
    },
  });
}

export function useReportHistoryApi() {
  return useMutation({
    mutationFn: (codes: string[]) => {
      return httpClient<ReportHistory[]>({
        method: "GET",
        url: `/balloons/report/status?codes=${codes}`,
      });
    },
  });
}
