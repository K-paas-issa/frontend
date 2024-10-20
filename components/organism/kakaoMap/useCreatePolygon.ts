import { BalloonInfo } from "@/api";
import { useCallback, useState } from "react";

const useCreatePolygon = (map: any, allBalloon: BalloonInfo[]) => {
  let polygons: any[] = []; // polygon 정보 저장

  // 키가 string이고 값이 number인 Map 객체 선언
  const [eachAreasRisk, setEachAreasRisk] = useState<Map<string, number>>(new Map());

  // 데이터에 따른 구역별 폴리곤 생성
  const createEachPolygon = (map: any, geoJsonData: any) => {
    const newPolygons: any[] = [];

    if (geoJsonData && geoJsonData.features) {
      geoJsonData.features.forEach((feature: any) => {
        if (feature.geometry && feature.geometry.type === "Polygon" && feature.properties) {
          const coordinates = feature.geometry.coordinates[0];
          const district_code = feature.properties.SIG_CD;
          const administrativeDistrict = feature.properties.SIG_KOR_NM;
          const path = coordinates.map(([lng, lat]: [number, number]) => new window.kakao.maps.LatLng(lat, lng));
          let bgColor = "#ffffff";

          eachAreasRisk.size >= 0 &&
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

          newPolygons.push([polygon, administrativeDistrict]);
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
  const settingJsonFileByZoomLevelAndCreateEachPolygons = useCallback(() => {
    if (map && allBalloon && eachAreasRisk) {
      removePolygons();
      drawPolygonsBySelectedJsonFile(map, "data/sig.json");
    }
  }, [map, allBalloon, eachAreasRisk]);

  return {
    eachAreasRisk,
    setEachAreasRisk,
    settingJsonFileByZoomLevelAndCreateEachPolygons,
  };
};

export { useCreatePolygon };
