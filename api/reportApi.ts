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

export interface ReportHistoryResponse {
  id: number;
  serialCode: string;
  isCheckedStatus: boolean;
  reportedLatitude: number;
  reportedLongitude: number;
  centerLatitude: number;
  centerLongitude: number;
  streetAddress: string;
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

// export function useReportHistoryApi(codes: string[]) {
//   return useQuery({
//     queryKey: ["getReportHistoryList"],
//     queryFn: () =>
//       httpClient<ReportHistoryResponse[]>({
//         method: "GET",
//         url: `/balloons/report/status?codes=${codes}`,
//       }),
//   });
// }

export function useReportHistoryApi() {
  return useMutation({
    mutationFn: (codes: string[]) => {
      return httpClient<ReportHistoryResponse[]>({
        method: "GET",
        url: `/balloons/report/status?codes=${codes}`,
      });
    },
  });
}
