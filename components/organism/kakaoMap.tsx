"use client";

import { useEffect, useState } from "react";
import { DetailPopup } from "./detailPopup";
import { useRouter } from "next/navigation";
import { Button, Police, Report, ResetLocation } from "../atom";
import { SimpleAlarmDialog } from "./simpleAlarmDialog";
import { useDialogContext } from "@/lib";

declare global {
  interface Window {
    kakao: any;
  }
}

export interface AreaInfo {
  id: number;
  latitude: number;
  longitude: number;
  risk: number;
  administrative_district: string;
  district_code: number;
  reportCount: number;
  status: string;
}

export function KakaoMap() {
  const { push } = useRouter();
  const { dialogOpen, dialogClose } = useDialogContext();

  const [map, setMap] = useState<any>(null);
  let polygons: any[] = []; // polygon 정보 저장
  let detailMode = false; // 지도의 줌 레벨 상태 확인
  // 사용자의 현재 위치
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState<any>(null);

  const myLocationMarkerImage =
    map && new window.kakao.maps.MarkerImage("/assets/myLocation.png", new window.kakao.maps.Size(40, 40));

  // 현재 위치 가져오기
  const getLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error("위치 정보를 가져오지 못했습니다.", error);
            reject(error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        alert("Geolocation을 지원하지 않는 브라우저입니다.");
        reject(new Error("Geolocation is not supported"));
      }
    });
  };

  // 초기 지도 생성
  const createMap = (latitude: number, longitude: number) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOJSKEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById("map");
          if (mapContainer) {
            const mapOption = {
              center: new window.kakao.maps.LatLng(latitude, longitude),
              level: 7,
            };
            const map = new window.kakao.maps.Map(mapContainer, mapOption);
            setMap(map);
          }
        });
      }
    };
  };

  // 현재 위치 마커 생성
  const setCurrentLocationMarkerOnMap = (latitude: number, longitude: number) => {
    const location = new window.kakao.maps.LatLng(latitude, longitude);

    // 기존 마커 제거
    if (currentLocationMarker) {
      currentLocationMarker.setMap(null);
    }

    // 현재 위치 마커 생성
    const marker = new window.kakao.maps.Marker({
      map: map,
      position: location,
      image: myLocationMarkerImage,
    });

    setCurrentLocationMarker(marker);
    map.setCenter(location);
  };

  useEffect(() => {
    getLocation()
      .then(({ latitude, longitude }) => {
        setCurrentLocation({ latitude, longitude });
        createMap(latitude, longitude); // 지도 중심을 사용자 위치로 설정
      })
      .catch((error) => {
        console.error("위치 설정 오류:", error);
        createMap(37.5665, 126.978); // 오류 시 기본 좌표 (서울)로 지도 생성
      });
  }, []);

  // 키가 string이고 값이 number인 Map 객체 선언
  const [eachAreasRisk, setEachAreasRisk] = useState<Map<string, number>>(new Map());
  const [allAreaList, setAllAreaList] = useState<AreaInfo[]>([]);
  const [areaInfo, setAreaInfo] = useState<AreaInfo | null>(null);
  let selectedMarker: any = null;

  const defaultMarkerImage =
    map && new window.kakao.maps.MarkerImage("/assets/default_marker.png", new window.kakao.maps.Size(38, 42));
  const selectedMarkerImage =
    map && new window.kakao.maps.MarkerImage("/assets/selected_marker.png", new window.kakao.maps.Size(38, 42));

  useEffect(() => {
    setAllAreaList([
      {
        id: 1,
        latitude: 37.529521713,
        longitude: 126.964540921,
        risk: 65.5,
        administrative_district: "서울특별시 강북구 천호동",
        district_code: 42720,
        reportCount: 3,
        status: "미처리",
      },
      {
        id: 2,
        latitude: 37.57037778,
        longitude: 126.9816417,
        risk: 87.2,
        administrative_district: "서울특별시 동대문구 신설동",
        district_code: 42730,
        reportCount: 10,
        status: "미처리",
      },
      {
        id: 3,
        latitude: 37.523611113,
        longitude: 126.8983417,
        risk: 17.2,
        administrative_district: "강원도 고성군 죽왕면 오호리",
        district_code: 42750,
        reportCount: 2,
        status: "처리",
      },
      {
        id: 3,
        latitude: 37.5643562,
        longitude: 127.0152552,
        risk: 31,
        administrative_district: "서울특별시 중구 무학동",
        district_code: 42790,
        reportCount: 7,
        status: "처리",
      },
    ]);
  }, []);

  const onMapClick = () => {
    if (selectedMarker) {
      selectedMarker.setImage(defaultMarkerImage);
      selectedMarker = null;
      setAreaInfo(null);
    }
  };

  // 마커 생성
  const changeMarkerImage = (marker: any) => {
    if (selectedMarker) {
      selectedMarker.setImage(defaultMarkerImage);
    }

    marker.setImage(selectedMarkerImage);
    selectedMarker = marker;
  };

  const createMarker = (info: AreaInfo) => {
    let marker = new window.kakao.maps.Marker({
      id: info.id,
      map: map,
      position: new window.kakao.maps.LatLng(info.latitude, info.longitude),
      image: defaultMarkerImage,
    });

    const overlayContent =
      '<div style="font-size: 16px; font-weight: 700; position: relative; color: #FFFFFF; top: -20px; left: 2px; pointer-events: none;">' +
      info.reportCount +
      "</div>";

    const overlay = new window.kakao.maps.CustomOverlay({
      content: overlayContent,
      map: map,
      position: marker.getPosition(),
    });

    overlay.setMap(map);

    window.kakao.maps.event.addListener(marker, "click", function () {
      changeMarkerImage(marker);
      setAreaInfo(info);
    });

    return marker;
  };

  // 데이터에 따른 구역별 폴리곤 생성
  const createEachPolygon = (map: any, geoJsonData: any) => {
    const newPolygons: any[] = [];

    if (geoJsonData && geoJsonData.features) {
      geoJsonData.features.forEach((feature: any) => {
        if (feature.geometry && feature.geometry.type === "Polygon" && feature.properties) {
          const coordinates = feature.geometry.coordinates[0];
          const district_code = feature.properties.SIG_CD;
          const administrative_district = feature.properties.SIG_KOR_NM;
          const path = coordinates.map(([lng, lat]: [number, number]) => new window.kakao.maps.LatLng(lat, lng));
          let bgColor = "#ffffff";

          eachAreasRisk.forEach((value, key) => {
            if (key === district_code.toString()) {
              const riskValue = value;

              if (riskValue !== undefined) {
                if (riskValue >= 1 && riskValue < 25) {
                  bgColor = "#BAE975";
                }
                if (riskValue >= 25 && riskValue < 50) {
                  bgColor = "#FFD066";
                }
                if (riskValue >= 50 && riskValue < 75) {
                  bgColor = "#FF9C00";
                }
                if (riskValue >= 75) {
                  bgColor = "#FF3E2F";
                }
              }
            }
          });

          const polygon = new window.kakao.maps.Polygon({
            map: map,
            path: path,
            strokeWeight: 2,
            strokeColor: "#004c80",
            strokeOpacity: 0.8,
            fillColor: bgColor,
            fillOpacity: 0.5,
          });

          newPolygons.push([polygon, administrative_district]);
        }
      });
    }
    return newPolygons;
  };

  // 선택한 json 파일을 활용하여 폴리곤에 따른 지역 이름과 데이터 생성
  const drawPolygonsBySelectedJsonFile = (map: any, file: string) => {
    fetch(file)
      .then((res) => res.json())
      .then((data) => {
        const newPolygons = createEachPolygon(map, data);
        polygons = newPolygons;
      })
      .catch((error) => console.error("데이터 로딩 실패", error));
  };

  // 모든 폴리곤 제거
  const removePolygons = () => {
    polygons.forEach(([polygon]) => {
      polygon.setMap(null);
    });
    polygons = [];
  };

  // 지도 zoom level 에 따른 다른 json 파일 선택
  const settingJsonFileByZoomLevelAndCreateEachPolygons = () => {
    const level = map.getLevel();
    if (!detailMode && level <= 10) {
      detailMode = true;
      removePolygons();
      drawPolygonsBySelectedJsonFile(map, "data/sig.json");
    } else if (detailMode && level > 10) {
      detailMode = false;
      removePolygons();
      drawPolygonsBySelectedJsonFile(map, "data/sig.json");
    }
  };

  // allAreaList가 변경될 때마다 eachAreasRisk를 업데이트
  useEffect(() => {
    const newRiskMap = new Map<string, number>();

    allAreaList.forEach((area) => {
      newRiskMap.set(area.district_code.toString(), area.risk);
    });

    setEachAreasRisk(newRiskMap);
  }, [allAreaList]);

  useEffect(() => {
    if (map) {
      window.kakao.maps.event.addListener(map, "click", onMapClick);
    }
  }, [map]);

  useEffect(() => {
    if (map && allAreaList.length > 0) {
      const areas = allAreaList;
      if (areas) {
        if (areas.length === 1) {
          createMarker(areas[0]);
        } else {
          areas.map((area) => {
            createMarker(area);
          });
        }
      }
    }
  }, [map, allAreaList]);

  useEffect(() => {
    if (map && currentLocation) {
      setCurrentLocationMarkerOnMap(currentLocation.latitude, currentLocation.longitude); // 마커 생성
      settingJsonFileByZoomLevelAndCreateEachPolygons();
      window.kakao.maps.event.addListener(map, "zoom_changed", settingJsonFileByZoomLevelAndCreateEachPolygons);
    }
  }, [map]);

  // ResetLocation 버튼 클릭 시 내 위치로 이동
  const handleResetLocation = () => {
    getLocation()
      .then(({ latitude, longitude }) => {
        setCurrentLocation({ latitude, longitude });
        setCurrentLocationMarkerOnMap(latitude, longitude); // 지도 중심과 마커를 업데이트
      })
      .catch((error) => {
        console.error("위치 정보를 다시 가져오지 못했습니다.", error);
      });
  };

  const handleGoToDetailPage = (areaInfo: AreaInfo) => {
    push(
      `/${areaInfo.district_code}?administrative_district=${areaInfo.administrative_district}&risk=${areaInfo.risk}`
    );
  };

  return (
    <div className="w-full relative">
      <SimpleAlarmDialog
        title="신고하기"
        message={
          <div className="body2 space-y-[2px]">
            <div>현재 위치는 아래와 같습니다.</div>
            <div className="text-blue subtitle2">
              {currentLocation?.latitude} / {currentLocation?.longitude}
            </div>
            <div>현재 위치에 대한 신고를 진행하시겠습니까?</div>
          </div>
        }
        onClose={() => {
          dialogClose();
        }}
        options={
          <div className="w-full flex flex-col gap-[8px]">
            <Button variant="sky">접수하기</Button>
            <Button variant="text">취소</Button>
          </div>
        }
      />
      <div id="map" style={{ width: "100%", height: "100vh" }} />
      <div>
        <Button
          variant="iconButton"
          className={`flex items-center justify-between p-[10px] w-[48px] z-10 absolute bg-white ${
            areaInfo ? "bottom-[240px] right-[18px]" : "bottom-[134px] right-[18px]"
          }`}
        >
          <Police />
        </Button>
        <Button
          variant="iconButton"
          className={`flex items-center justify-between p-[10px] w-[48px] z-10 absolute bg-white ${
            areaInfo ? "bottom-[185px] right-[18px]" : "bottom-[79px] right-[18px]"
          }`}
          onClick={dialogOpen}
        >
          <Report />
        </Button>
        <Button
          variant="iconButton"
          className={`flex items-center justify-between p-[10px] w-[48px] z-10 absolute bg-white ${
            areaInfo ? "bottom-[130px] right-[18px]" : "bottom-[24px] right-[18px]"
          }`}
          onClick={handleResetLocation}
        >
          <ResetLocation />
        </Button>
      </div>

      {areaInfo && (
        <div className="relative w-[98%] mx-auto">
          <DetailPopup info={areaInfo} onClick={() => handleGoToDetailPage(areaInfo)} />
        </div>
      )}
    </div>
  );
}
