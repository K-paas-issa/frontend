import { useBalloonApi } from "@/api";
import { useDialogContext } from "@/lib";
import React, { useEffect, useState } from "react";

const useMyLocation = (map: any) => {
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

  return { currentLocation, setCurrentLocation, getLocation, setCurrentLocationMarkerOnMap, handleResetLocation };
};

export { useMyLocation };
