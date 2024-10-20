import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";

export interface BalloonInfo {
  id: number;
  latitude: number;
  longitude: number;
  administrativeDistrict: string;
  districtCode: string;
  risk: number;
  reportCount: number;
  status: string;
  startPredictionTime: string;
}

export function useBalloonApi() {
  return useQuery({
    queryKey: ["getBalloonList"],
    queryFn: () =>
      httpClient<BalloonInfo[]>({
        method: "GET",
        url: `/balloons`,
      }),
  });
}
