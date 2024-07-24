"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export function Map() {
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
            const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
            setMap(kakaoMap);
          }
        });
      }
    };
  };

  // 지도 zoom level 에 따른 다른 json 파일 선택
  const settingJsonFileByZoomLevel = () => {
    const level = map.getLevel();
    if (!detailMode && level <= 10) {
      detailMode = true;
      removePolygons();
      createPolygonAndAreaData(map, "data/sig.json");
    } else if (detailMode && level > 10) {
      detailMode = false;
      removePolygons();
      createPolygonAndAreaData(map, "data/sido.json");
    }
  };

  // 선택한 json 파일을 활용하여 폴리곤과 지역 이름 데이터 생성
  const createPolygonAndAreaData = (map: any, file: string) => {
    fetch(file)
      .then((res) => res.json())
      .then((data) => {
        const newPolygons = createPolygonAndArea(map, data);
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

  // 데이터에 따른 구역별 폴리곤 생성
  const createPolygonAndArea = (map: any, geoJsonData: any) => {
    const newPolygons: any[] = [];

    if (geoJsonData && geoJsonData.features) {
      geoJsonData.features.forEach((feature: any) => {
        if (feature.geometry && feature.geometry.type === "Polygon" && feature.properties) {
          const coordinates = feature.geometry.coordinates[0];
          const areaName = feature.properties.SIG_KOR_NM;
          const path = coordinates.map(([lng, lat]: [number, number]) => new window.kakao.maps.LatLng(lat, lng));

          const polygon = new window.kakao.maps.Polygon({
            map: map,
            path: path,
            strokeWeight: 2,
            strokeColor: "#004c80",
            strokeOpacity: 0.8,
            fillColor: "#fff",
            fillOpacity: 0.5,
          });

          newPolygons.push([polygon, areaName]);
        }
      });
    }
    return newPolygons;
  };

  useEffect(() => {
    createMap();
  }, []);

  useEffect(() => {
    if (map) {
      settingJsonFileByZoomLevel();
      window.kakao.maps.event.addListener(map, "zoom_changed", settingJsonFileByZoomLevel);
    }
  }, [map]);

  return <div id="map" style={{ width: "100%", height: "100vh" }} />;
}
