"use client";

import { useEffect } from "react";
import { DetailPopup } from "../detailPopup";
import { useRouter } from "next/navigation";
import { Button, Report, LoadingSpinner, ResetLocation, Note } from "../../atom";
import { SimpleAlarmDialog } from "../simpleAlarmDialog";
import { useDialogContext } from "@/lib";
import { useKakaomap } from "./useKakaomap";
import { BalloonInfo, ReportHistory } from "@/api";
import { ReportDialog } from "../reportDialog";
import { useMyLocation } from "./useMyLocation";
import { useCreatePolygon } from "./useCreatePolygon";
import { useReport } from "./useReport";
import { ReportHistoryDialog } from "../reportHistoryDialog";

declare global {
  interface Window {
    kakao: any;
  }
}

export function KakaoMap() {
  const { push } = useRouter();
  const { isDialogOpen, dialogOpen } = useDialogContext();
  const {
    loadKakaoMapScript,
    createMap,
    map,
    loading,
    setLoading,
    allBalloon,
    balloonInfo,
    createBalloonMarker,
    createReportMarker,
    balloonList,
  } = useKakaomap();
  const { currentLocation, setCurrentLocation, getLocation, setCurrentLocationMarkerOnMap, handleResetLocation } =
    useMyLocation(map);
  const { eachAreasRisk, setEachAreasRisk, settingJsonFileByZoomLevelAndCreateEachPolygons } = useCreatePolygon(
    map,
    allBalloon
  );
  const { allReport, selectedImage, handleImageUpload, handleImageRemove, handleReport } = useReport(currentLocation);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadKakaoMapScript();
        const { latitude, longitude } = await getLocation();
        setCurrentLocation({ latitude, longitude });
        createMap(latitude, longitude);
      } catch (error) {
        setCurrentLocation({ latitude: 37.498095, longitude: 127.02761 });
        createMap(37.5665, 126.978);
        setLoading(false);
      }
    };

    initializeMap();
  }, []);

  // 행정구역별 위험도 색상 칠하기 위한 사전 작업
  useEffect(() => {
    if (balloonList && balloonList?.length >= 0 && allBalloon.length >= 0) {
      const newRiskMap = new Map<string, number>();

      allBalloon.forEach((area) => {
        newRiskMap.set(area.districtCode?.toString(), area.risk);
      });

      setEachAreasRisk(newRiskMap);
    }
  }, [balloonList, allBalloon]);

  // 풍선 마커 생성
  useEffect(() => {
    if (map && allBalloon.length >= 0) {
      const areas = allBalloon;
      if (areas) {
        if (areas.length === 1) {
          createBalloonMarker(areas[0]);
        } else {
          areas.map((area) => {
            createBalloonMarker(area);
          });
        }
      }
    }
  }, [map, allBalloon]);

  // 신고 수 마커 생성
  useEffect(() => {
    if (map && allReport.length >= 0) {
      const reports = allReport;
      if (reports) {
        if (reports.length === 1) {
          createReportMarker(reports[0]);
        } else {
          reports.map((report) => {
            createReportMarker(report);
          });
        }
      }
    }
  }, [map, allReport]);

  // 폴리곤 그리고 내 위치 마커 생성
  useEffect(() => {
    if (map && currentLocation && balloonList && eachAreasRisk.size >= 0) {
      setCurrentLocationMarkerOnMap(currentLocation.latitude, currentLocation.longitude);
      settingJsonFileByZoomLevelAndCreateEachPolygons();
      window.kakao.maps.event.addListener(map, "zoom_changed", settingJsonFileByZoomLevelAndCreateEachPolygons);
    }
  }, [map, balloonList, eachAreasRisk, settingJsonFileByZoomLevelAndCreateEachPolygons]);

  const handleGoToDetailPage = (balloonInfo: BalloonInfo) => {
    push(`/${balloonInfo.id}?administrativeDistrict=${balloonInfo.administrativeDistrict}&risk=${balloonInfo.risk}`);
  };

  return (
    <div className="w-full relative">
      {loading && (
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <LoadingSpinner />
          <div className="text-[24px] mt-[24px]">지도 로딩중...</div>
        </div>
      )}
      <div id="map" style={{ width: "100%", height: "100vh" }} />
      {isDialogOpen("reportHistory") && <ReportHistoryDialog id="reportHistory" />}
      {isDialogOpen("report") && (
        <ReportDialog
          id="report"
          onReport={handleReport}
          selectedImage={selectedImage}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />
      )}
      {isDialogOpen("reportSuccess") && (
        <SimpleAlarmDialog
          id="reportSuccess"
          title="알림"
          message={
            <div className="body2 space-y-[2px]">
              <div>신고가 정상 접수되었습니다.</div>
            </div>
          }
          options={
            <Button variant="sky" className="w-full">
              확인
            </Button>
          }
        />
      )}
      {isDialogOpen("reportFailed") && (
        <SimpleAlarmDialog
          id="reportFailed"
          title="알림"
          message={
            <div className="body2 space-y-[2px]">
              <div>신고가 정상적으로 요청되지 않았습니다.</div>
            </div>
          }
          options={
            <Button variant="sky" className="w-full">
              확인
            </Button>
          }
        />
      )}
      {isDialogOpen("isBalloonError") && (
        <SimpleAlarmDialog
          id="isBalloonError"
          title="알림"
          message={<div>풍선 위치정보를 가져오지 못했습니다.</div>}
          options={
            <Button variant="sky" className="w-full">
              확인
            </Button>
          }
        />
      )}
      {!loading && (
        <div>
          <Button
            variant="iconButton"
            className={`flex items-center justify-between p-[10px] w-[48px] z-10 absolute bg-white ${
              balloonInfo ? "bottom-[240px] right-[18px]" : "bottom-[134px] right-[18px]"
            }`}
            onClick={() => dialogOpen("reportHistory")}
          >
            <Note />
          </Button>
          <Button
            variant="iconButton"
            className={`flex items-center justify-between p-[10px] w-[48px] z-10 absolute bg-white ${
              balloonInfo ? "bottom-[185px] right-[18px]" : "bottom-[79px] right-[18px]"
            }`}
            onClick={() => dialogOpen("report")}
          >
            <Report color="red" />
          </Button>
          <Button
            variant="iconButton"
            className={`flex items-center justify-between p-[10px] w-[48px] z-10 absolute bg-white ${
              balloonInfo ? "bottom-[130px] right-[18px]" : "bottom-[24px] right-[18px]"
            }`}
            onClick={handleResetLocation}
          >
            <ResetLocation />
          </Button>
        </div>
      )}
      {balloonInfo && (
        <div className="relative w-[98%] mx-auto">
          <DetailPopup info={balloonInfo} onClick={() => handleGoToDetailPage(balloonInfo)} />
        </div>
      )}
    </div>
  );
}
