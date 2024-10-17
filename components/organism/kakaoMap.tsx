"use client";

import { useCallback, useEffect, useState } from "react";
import { DetailPopup } from "./detailPopup";
import { useRouter } from "next/navigation";
import { Button, Police, Report, LoadingSpinner, ResetLocation } from "../atom";
import { SimpleAlarmDialog } from "./simpleAlarmDialog";
import { useDialogContext } from "@/lib";
import { useKakaomap } from "./useKakaomap";
import { AreaInfo } from "@/api";

declare global {
  interface Window {
    kakao: any;
  }
}

export function KakaoMap() {
  const { push } = useRouter();
  const { isDialogOpen, dialogOpen, dialogClose } = useDialogContext();

  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  let polygons: any[] = []; // polygon 정보 저장

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

  // 카카오맵 스크립트 로드
  const loadKakaoMapScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve(); // 이미 스크립트가 로드된 경우
      } else {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOJSKEY}&autoload=false`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject("카카오 맵 스크립트 로드 실패");
        document.head.appendChild(script);
      }
    });
  };

  const createMap = (latitude: number, longitude: number) => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        const mapOption = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 7,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(map);
        setLoading(false); // 로딩 완료
      }
    });
    // window.kakao.maps.load(() => {
    //   const mapContainer = document.getElementById("map");
    //   if (mapContainer) {
    //     const mapOption = {
    //       center: new window.kakao.maps.LatLng(37.498095, 127.02761),
    //       level: 7,
    //     };
    //     const map = new window.kakao.maps.Map(mapContainer, mapOption);
    //     setMap(map);
    //     setLoading(false);
    //   }
    // });
  };

  // 현재 위치 마커 생성 -> https 없어서 일단 제거
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
    const initializeMap = async () => {
      try {
        await loadKakaoMapScript(); // 카카오맵 스크립트 로드
        const { latitude, longitude } = await getLocation(); // 현재 위치 가져오기
        setCurrentLocation({ latitude, longitude });
        createMap(latitude, longitude); // 지도 생성
      } catch (error) {
        setCurrentLocation({ latitude: 37.498095, longitude: 127.02761 });
        createMap(37.5665, 126.978); // 오류 시 기본 좌표 (서울)로 지도 생성
        setLoading(false);
      }
      // await loadKakaoMapScript();
      // createMap();
    };

    initializeMap(); // 초기화
  }, []);

  // 키가 string이고 값이 number인 Map 객체 선언
  const [eachAreasRisk, setEachAreasRisk] = useState<Map<string, number>>(new Map());
  const [allAreaList, setAllAreaList] = useState<AreaInfo[]>([]);
  const [areaInfo, setAreaInfo] = useState<AreaInfo | null>(null);
  let selectedMarker: any = null;

  // const { balloonList } = useKakaomap();

  const defaultMarkerImage =
    map && new window.kakao.maps.MarkerImage("/assets/balloon.png", new window.kakao.maps.Size(45, 45));
  const selectedMarkerImage =
    map && new window.kakao.maps.MarkerImage("/assets/balloon.png", new window.kakao.maps.Size(55, 55));

  // useEffect(() => {
  //   if (balloonList) setAllAreaList(balloonList);
  // }, [balloonList]);

  useEffect(() => {
    setAllAreaList([
      {
        id: 1,
        latitude: 37.5450159,
        longitude: 127.1368066,
        administrativeDistrict: "서울특별시 강동구 천호동",
        districtCode: "11740",
        risk: 80.8,
        reportCount: 2,
        status: "미처리",
        startPredictionTime: "2024-10-10T18:46:55Z",
      },
      {
        id: 2,
        latitude: 37.488943,
        longitude: 126.91005,
        administrativeDistrict: "서울특별시 동작구 신대방동",
        districtCode: "11590",
        risk: 64.2,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-10T18:46:58Z",
      },
      {
        id: 3,
        latitude: 37.5556222,
        longitude: 126.9055969,
        administrativeDistrict: "서울특별시 마포구 망원동",
        districtCode: "11440",
        risk: 38.1,
        reportCount: 0,
        status: "처리",
        startPredictionTime: "2024-10-10T18:47:00Z",
      },
      {
        id: 4,
        latitude: 37.6480275,
        longitude: 127.0261145,
        administrativeDistrict: "서울특별시 도봉구 쌍문동",
        districtCode: "11320",
        risk: 45.8,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-10T18:47:01Z",
      },
      {
        id: 5,
        latitude: 37.6250518,
        longitude: 127.0197725,
        administrativeDistrict: "서울특별시 강북구 삼양동",
        districtCode: "11305",
        risk: 65.5,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-10T18:47:01Z",
      },
      {
        id: 6,
        latitude: 37.5749343,
        longitude: 127.0255251,
        administrativeDistrict: "서울특별시 동대문구 신설동",
        districtCode: "11230",
        risk: 87.2,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-10T18:47:02Z",
      },
      {
        id: 7,
        latitude: 37.5643562,
        longitude: 127.0152552,
        administrativeDistrict: "서울특별시 중구 무학동",
        districtCode: "11140",
        risk: 41.2,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-10T18:47:03Z",
      },
      {
        id: 8,
        latitude: 37.5869186,
        longitude: 127.0005764,
        administrativeDistrict: "서울특별시 종로구 혜화동",
        districtCode: "11110",
        risk: 17.2,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-10T18:47:04Z",
      },
      {
        id: 9,
        latitude: 38.3316124,
        longitude: 128.5225776,
        administrativeDistrict: "강원도 고성군 죽왕면 오호리",
        districtCode: "48820",
        risk: 77.8,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-10T18:47:05Z",
      },
      {
        id: 10,
        latitude: 37.463776,
        longitude: 126.676525,
        administrativeDistrict: "인천광역시 미추홀구 주안동",
        districtCode: "28177",
        risk: 90.8,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-10T18:47:06Z",
      },
      {
        id: 45,
        latitude: 37.61095726715074,
        longitude: 127.80433964283816,
        administrativeDistrict: "신대리, 남면, 홍천군, 강원특별자치도, 25109, 대한민국",
        districtCode: "51720",
        risk: 172,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-14T02:35:22.016712Z",
      },
      {
        id: 46,
        latitude: 37.57465556376268,
        longitude: 127.86694874198449,
        administrativeDistrict: "25110, 유치리, 남면, 홍천군, 강원특별자치도, 대한민국",
        districtCode: "51720",
        risk: 46,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-14T02:35:22.016782Z",
      },
      {
        id: 47,
        latitude: 37.58817451083508,
        longitude: 127.83607850324894,
        administrativeDistrict: "시동로, 시동리, 남면, 홍천군, 강원특별자치도, 25109, 대한민국",
        districtCode: "51720",
        risk: 14,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-14T02:35:22.016820Z",
      },
      {
        id: 48,
        latitude: 38.218516906274104,
        longitude: 127.38762747515159,
        administrativeDistrict: "청양리, 철원군, 강원특별자치도, 24055, 대한민국",
        districtCode: "51780",
        risk: 143,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-14T03:00:55.951501Z",
      },
      {
        id: 49,
        latitude: 38.221249250410786,
        longitude: 127.40517945786198,
        administrativeDistrict: "24055, 청양리, 철원군, 강원특별자치도, 대한민국",
        districtCode: "51780",
        risk: 68,
        reportCount: 0,
        status: "미처리",
        startPredictionTime: "2024-10-14T03:00:55.951572Z",
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

  // allAreaList가 변경될 때마다 eachAreasRisk를 업데이트
  // useEffect(() => {
  //   if (balloonList && balloonList?.length > 0 && allAreaList.length > 0) {
  //     const newRiskMap = new Map<string, number>();

  //     allAreaList.forEach((area) => {
  //       newRiskMap.set(area.districtCode?.toString(), area.risk);
  //     });

  //     setEachAreasRisk(newRiskMap);
  //   }
  // }, [balloonList, allAreaList]);

  useEffect(() => {
    if (allAreaList.length > 0) {
      const newRiskMap = new Map<string, number>();

      allAreaList.forEach((area) => {
        newRiskMap.set(area.districtCode?.toString(), area.risk);
      });

      setEachAreasRisk(newRiskMap);
    }
  }, [allAreaList]);

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
      position: new window.kakao.maps.LatLng(info.latitude, info.longitude),
      image: defaultMarkerImage,
    });

    // const overlayContent =
    //   '<div style="font-size: 16px; font-weight: 700; position: relative; color: #FFFFFF; top: -20px; left: 2px; pointer-events: none;">' +
    //   info.reportCount +
    //   "</div>";

    // const overlay = new window.kakao.maps.CustomOverlay({
    //   content: overlayContent,
    //   map: map,
    //   position: marker.getPosition(),
    // });

    // overlay.setMap(map);

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
          const administrativeDistrict = feature.properties.SIG_KOR_NM;
          const path = coordinates.map(([lng, lat]: [number, number]) => new window.kakao.maps.LatLng(lat, lng));
          let bgColor = "#ffffff";

          eachAreasRisk.size > 0 &&
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
    if (map && allAreaList && eachAreasRisk) {
      removePolygons();
      drawPolygonsBySelectedJsonFile(map, "data/sig.json");
    }
  }, [map, allAreaList, eachAreasRisk]);

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

  // useEffect(() => {
  //   if (map && currentLocation && balloonList && eachAreasRisk.size > 0) {
  //     setCurrentLocationMarkerOnMap(currentLocation.latitude, currentLocation.longitude); // 마커 생성
  //     settingJsonFileByZoomLevelAndCreateEachPolygons();
  //     window.kakao.maps.event.addListener(map, "zoom_changed", settingJsonFileByZoomLevelAndCreateEachPolygons);
  //   }
  //   // if (map && balloonList && eachAreasRisk.size > 0) {
  //   //   settingJsonFileByZoomLevelAndCreateEachPolygons();
  //   //   window.kakao.maps.event.addListener(map, "zoom_changed", settingJsonFileByZoomLevelAndCreateEachPolygons);
  //   // }
  // }, [map, balloonList, eachAreasRisk, settingJsonFileByZoomLevelAndCreateEachPolygons]);

  useEffect(() => {
    if (map && currentLocation && eachAreasRisk.size > 0) {
      setCurrentLocationMarkerOnMap(currentLocation.latitude, currentLocation.longitude); // 마커 생성
      settingJsonFileByZoomLevelAndCreateEachPolygons();
      window.kakao.maps.event.addListener(map, "zoom_changed", settingJsonFileByZoomLevelAndCreateEachPolygons);
    }
    // if (map && balloonList && eachAreasRisk.size > 0) {
    //   settingJsonFileByZoomLevelAndCreateEachPolygons();
    //   window.kakao.maps.event.addListener(map, "zoom_changed", settingJsonFileByZoomLevelAndCreateEachPolygons);
    // }
  }, [map, eachAreasRisk, settingJsonFileByZoomLevelAndCreateEachPolygons]);

  // ResetLocation 버튼 클릭 시 내 위치로 이동
  const handleResetLocation = () => {
    getLocation()
      .then(({ latitude, longitude }) => {
        setCurrentLocation({ latitude, longitude });
        setCurrentLocationMarkerOnMap(latitude, longitude); // 지도 중심과 마커를 업데이트
      })
      .catch((error) => {
        console.error("위치 정보를 가져오지 못했습니다.", error);
      });
  };

  const handleGoToDetailPage = (areaInfo: AreaInfo) => {
    push(`/${areaInfo.id}?administrativeDistrict=${areaInfo.administrativeDistrict}&risk=${areaInfo.risk}`);
  };

  const handleReport = () => {
    dialogClose(`reportConfirm`);

    setTimeout(() => {
      dialogOpen(`reportResult`);
    }, 100);
  };

  return (
    <div className="w-full relative">
      {loading && (
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <LoadingSpinner />
          <div className="text-[24px] mt-[24px]">지도 로딩중...</div>
        </div>
      )}
      {/* 로딩 스피너 */}
      <div id="map" style={{ width: "100%", height: "100vh" }} />
      {isDialogOpen("reportConfirm") && (
        <SimpleAlarmDialog
          id="reportConfirm"
          title="신고하기"
          message={<div className="body2">현재 위치에 대한 신고를 진행하시겠습니까?</div>}
          options={
            <div className="w-full flex flex-col gap-[8px]">
              <Button variant="sky" className="w-full" onClick={handleReport}>
                접수하기
              </Button>
              <Button variant="text" className="w-full">
                취소
              </Button>
            </div>
          }
        />
      )}
      {isDialogOpen("reportResult") && (
        <SimpleAlarmDialog
          id="reportResult"
          title="알림"
          message={
            <div className="body2 space-y-[2px]">
              <div>신고가 정상 접수되었습니다.</div>
              <div className="text-green pt-[12px]">
                <div>신고일자: 2024.01.01</div>
                <div>신고위치: 서울특별시 동작구 등용로</div>
              </div>
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
          onClick={() => dialogOpen("reportConfirm")}
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
