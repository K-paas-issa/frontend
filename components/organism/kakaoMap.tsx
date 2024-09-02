"use client";

import { useEffect, useState } from "react";
import { DetailPopup } from "./detailPopup";

declare global {
  interface Window {
    kakao: any;
  }
}

export interface AreaInfo {
  id: number;
  lat: number;
  lon: number;
  risk: number;
  areaName: string;
  reportCount: number;
  status: string;
}

export function KakaoMap() {
  const [map, setMap] = useState<any>(null);
  let polygons: any[] = []; // polygon 정보 저장
  let detailMode = false; // 지도의 줌 레벨 상태 확인

  // 초기 지도 생성
  const createMap = () => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOJSKEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById("map");
          if (mapContainer) {
            const mapOption = {
              center: new window.kakao.maps.LatLng(37.5665, 126.978),
              level: 7,
            };
            const map = new window.kakao.maps.Map(mapContainer, mapOption);
            setMap(map);
          }
        });
      }
    };
  };

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
        lat: 37.529521713,
        lon: 126.964540921,
        risk: 3.4,
        areaName: "용산구",
        reportCount: 3,
        status: "미처리",
      },
      {
        id: 2,
        lat: 37.57037778,
        lon: 126.9816417,
        risk: 5.1,
        areaName: "종로구",
        reportCount: 10,
        status: "미처리",
      },
      {
        id: 3,
        lat: 37.523611113,
        lon: 126.8983417,
        risk: 1.4,
        areaName: "영등포구",
        reportCount: 1,
        status: "처리",
      },
      {
        id: 4,
        lat: 37.59996944,
        lon: 126.9312417,
        risk: 2.3,
        areaName: "은평구",
        reportCount: 1,
        status: "처리",
      },
    ]);
  }, []);

  // allAreaList가 변경될 때마다 eachAreasRisk를 업데이트
  useEffect(() => {
    const newRiskMap = new Map<string, number>();

    allAreaList.forEach((area) => {
      newRiskMap.set(area.areaName, area.risk);
    });

    setEachAreasRisk(newRiskMap);
  }, [allAreaList]);

  useEffect(() => {
    console.log(eachAreasRisk);
  }, [eachAreasRisk]);

  const onMapClick = () => {
    if (selectedMarker) {
      selectedMarker.setImage(defaultMarkerImage);
      selectedMarker = null;
      setAreaInfo(null);
    }
  };

  useEffect(() => {
    if (map) {
      window.kakao.maps.event.addListener(map, "click", onMapClick);
    }
  }, [map]);

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
      position: new window.kakao.maps.LatLng(info.lat, info.lon),
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

  // 데이터에 따른 구역별 폴리곤 생성
  const createEachPolygon = (map: any, geoJsonData: any) => {
    const newPolygons: any[] = [];

    if (geoJsonData && geoJsonData.features) {
      geoJsonData.features.forEach((feature: any) => {
        if (feature.geometry && feature.geometry.type === "Polygon" && feature.properties) {
          const coordinates = feature.geometry.coordinates[0];
          const areaName = feature.properties.SIG_KOR_NM;
          const path = coordinates.map(([lng, lat]: [number, number]) => new window.kakao.maps.LatLng(lat, lng));
          let bgColor = "#ffffff";

          if (eachAreasRisk.has(areaName)) {
            const riskValue = eachAreasRisk.get(areaName);
            if (riskValue !== undefined) {
              if (riskValue >= 1 && riskValue < 2) {
                bgColor = "#FFE2A7";
              }
              if (riskValue >= 2 && riskValue < 3) {
                bgColor = "#FFB724";
              }
              if (riskValue >= 3 && riskValue < 4) {
                bgColor = "#EB003B";
              }
              if (riskValue >= 4) {
                bgColor = "#8D0023";
              }
            } else {
              console.error(`Risk value for ${areaName} is undefined.`);
            }
          }

          const polygon = new window.kakao.maps.Polygon({
            map: map,
            path: path,
            strokeWeight: 2,
            strokeColor: "#004c80",
            strokeOpacity: 0.8,
            fillColor: bgColor,
            fillOpacity: 0.5,
          });

          newPolygons.push([polygon, areaName]);
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
      drawPolygonsBySelectedJsonFile(map, "data/sido.json");
    }
  };

  useEffect(() => {
    createMap();
  }, []);

  useEffect(() => {
    if (map) {
      settingJsonFileByZoomLevelAndCreateEachPolygons();
      window.kakao.maps.event.addListener(map, "zoom_changed", settingJsonFileByZoomLevelAndCreateEachPolygons);
    }
  }, [map]);

  return (
    <div className="w-full relative">
      <div id="map" style={{ width: "100%", height: "100vh" }} />
      {areaInfo && <DetailPopup info={areaInfo} />}
    </div>
  );
}
