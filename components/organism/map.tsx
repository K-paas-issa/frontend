"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export function Map() {
  const loadKakaoMapScript = () => {
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
            new window.kakao.maps.Map(mapContainer, mapOption);
          }
        });
      }
    };
  };

  useEffect(() => {
    loadKakaoMapScript();
  }, []);

  return <div id="map" style={{ width: "100%", height: "100vh" }} />;
}
