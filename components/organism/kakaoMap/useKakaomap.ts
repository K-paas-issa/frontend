import { BalloonInfo, ReportInfo, useBalloonApi } from "@/api";
import { useDialogContext } from "@/lib";
import { useEffect, useState } from "react";

const useKakaomap = () => {
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { data: balloonList, error: isBalloonListError } = useBalloonApi();
  const { dialogOpen } = useDialogContext();

  const [allBalloon, setAllBalloon] = useState<BalloonInfo[]>([]);
  const [balloonInfo, setBalloonInfo] = useState<BalloonInfo | null>(null);
  let selectedMarker: any = null;

  const defaultReportMarkerImage =
    map && new window.kakao.maps.MarkerImage("/assets/default_marker.png", new window.kakao.maps.Size(55, 60));

  const defaultMarkerImage =
    map && new window.kakao.maps.MarkerImage("/assets/balloon.png", new window.kakao.maps.Size(45, 45));
  const selectedMarkerImage =
    map && new window.kakao.maps.MarkerImage("/assets/balloon.png", new window.kakao.maps.Size(55, 55));

  const loadKakaoMapScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve();
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
        setLoading(false);
      }
    });
  };

  const changeMarkerImage = (marker: any) => {
    if (selectedMarker) {
      selectedMarker.setImage(defaultMarkerImage);
    }

    marker.setImage(selectedMarkerImage);
    selectedMarker = marker;
  };

  const createBalloonMarker = (info: BalloonInfo) => {
    let marker = new window.kakao.maps.Marker({
      id: info.id,
      map: map,
      position: new window.kakao.maps.LatLng(info.latitude, info.longitude),
      image: defaultMarkerImage,
    });

    window.kakao.maps.event.addListener(marker, "click", function () {
      changeMarkerImage(marker);
      setBalloonInfo(info);
    });

    return marker;
  };

  const createReportMarker = (info: ReportInfo) => {
    let marker = new window.kakao.maps.Marker({
      map: map,
      position: new window.kakao.maps.LatLng(info.centerLatitude, info.centerLongitude),
      image: defaultReportMarkerImage,
    });

    const overlayContent =
      '<div style="font-size: 16px; font-weight: 700; position: relative; color: #FFFFFF; top: -30px; left: 1px; pointer-events: none;">' +
      info.reportCount +
      "</div>";

    const overlay = new window.kakao.maps.CustomOverlay({
      content: overlayContent,
      map: map,
      position: marker.getPosition(),
    });

    overlay.setMap(map);

    return marker;
  };

  const onMapClick = () => {
    if (selectedMarker) {
      selectedMarker.setImage(defaultMarkerImage);
      selectedMarker = null;
      setBalloonInfo(null);
    }
  };

  useEffect(() => {
    if (map) {
      window.kakao.maps.event.addListener(map, "click", onMapClick);
    }
  }, [map]);

  useEffect(() => {
    if (balloonList) setAllBalloon(balloonList);
  }, [balloonList]);

  useEffect(() => {
    if (isBalloonListError) {
      dialogOpen(`isBalloonError`);
    }
  }, [dialogOpen, isBalloonListError]);

  return {
    loadKakaoMapScript,
    createMap,
    map,
    loading,
    setLoading,
    allBalloon,
    setAllBalloon,
    balloonInfo,
    createBalloonMarker,
    createReportMarker,
    onMapClick,
    balloonList,
  };
};

export { useKakaomap };
