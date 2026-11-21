import { useCallback, useState } from "react";

function geoErrorMessage(err) {
  switch (err?.code) {
    case 1:
      return "Location permission was denied. Allow location for this site (lock icon in the address bar, then Site settings, then Location) and try again.";
    case 2:
      return "Your device couldn't work out its position. Turn on GPS / location services and try again.";
    case 3:
      return "Getting the location took too long. Move to an open area and try again.";
    default:
      return "Couldn't get your location. Please try again.";
  }
}

/** Browser Geolocation API only. No paid map services. */
export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accuracy, setAccuracy] = useState(null);

  const reset = useCallback(() => {
    setError("");
    setAccuracy(null);
  }, []);

  const locate = useCallback((onSuccess) => {
    setError("");
    setAccuracy(null);

    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setError("This browser doesn't support location access.");
      return;
    }
    if (!window.isSecureContext) {
      setError("Location only works on a secure (HTTPS) page or on localhost. Open the site using its https:// link.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        setAccuracy(Math.round(pos.coords.accuracy));
        onSuccess({
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        });
      },
      (err) => {
        setLoading(false);
        setError(geoErrorMessage(err));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  return { locate, loading, error, accuracy, reset };
}
