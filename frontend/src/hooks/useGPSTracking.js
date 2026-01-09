import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import gpsTrackingAPI from "../services/gpsTrackingAPI";

// Default library location (you can customize this)
const LIBRARY_LOCATION = {
  latitude: 13.0827,
  longitude: 80.2707,
  radius: 100, // 100 meters
};

// Calculate distance between two GPS coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// API functions
const sendLocationUpdate = async (locationData) => {
  return gpsTrackingAPI.updateLocation(locationData);
};

const checkPermissionStatus = async () => {
  return gpsTrackingAPI.getPermissionStatus();
};

export const useGPSTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isInsideLibrary, setIsInsideLibrary] = useState(false);
  const [lastEntryEvent, setLastEntryEvent] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("prompt");
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(false);

  const watchIdRef = useRef(null);
  const locationHistoryRef = useRef([]);
  const lastUpdateTimeRef = useRef(0);
  const entryTimeoutRef = useRef(null);

  // Check if location services are supported
  const isLocationSupported = "geolocation" in navigator;

  // Check permission status
  const checkPermissions = useCallback(async () => {
    if (!isLocationSupported) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    try {
      // Check browser permission
      const result = await navigator.permissions.query({ name: "geolocation" });
      setPermissionStatus(result.state);

      // Check server-side permission
      const serverPermission = await checkPermissionStatus();
      setIsPermissionEnabled(serverPermission.isEnabled);

      return result.state === "granted" && serverPermission.isEnabled;
    } catch (error) {
      console.error("Error checking permissions:", error);
      setError("Failed to check location permissions");
      return false;
    }
  }, [isLocationSupported]);

  // Handle location updates
  const handleLocationUpdate = useCallback(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const timestamp = Date.now();

      // Update current location state
      setCurrentLocation({
        latitude,
        longitude,
        accuracy,
        timestamp,
      });

      // Calculate distance from library
      const distanceFromLibrary = calculateDistance(
        latitude,
        longitude,
        LIBRARY_LOCATION.latitude,
        LIBRARY_LOCATION.longitude
      );

      const wasInsideLibrary = isInsideLibrary;
      const isCurrentlyInside = distanceFromLibrary <= LIBRARY_LOCATION.radius;

      setIsInsideLibrary(isCurrentlyInside);

      // Add to location history (keep last 10 points)
      locationHistoryRef.current = [
        ...locationHistoryRef.current.slice(-9),
        {
          latitude,
          longitude,
          accuracy,
          timestamp,
          distanceFromLibrary,
          isInsideLibrary: isCurrentlyInside,
        },
      ];

      // Throttle API calls (minimum 30 seconds between updates)
      const timeSinceLastUpdate = timestamp - lastUpdateTimeRef.current;
      const shouldSendUpdate =
        timeSinceLastUpdate > 30000 || wasInsideLibrary !== isCurrentlyInside; // Always send on entry/exit

      if (shouldSendUpdate) {
        try {
          const response = await sendLocationUpdate({
            latitude,
            longitude,
            accuracy,
            timestamp: new Date().toISOString(),
            distanceFromLibrary,
            isInsideLibrary: isCurrentlyInside,
          });

          lastUpdateTimeRef.current = timestamp;

          // Handle entry/exit events
          if (response.eventType) {
            setLastEntryEvent({
              type: response.eventType,
              timestamp: new Date().toISOString(),
              location: { latitude, longitude },
            });

            // Show notification
            if (response.eventType === "entry") {
              toast.success("Welcome to the library! 📚", {
                duration: 4000,
                position: "top-center",
              });
            } else if (response.eventType === "exit") {
              toast.success(
                `Thanks for visiting! Duration: ${
                  response.durationMinutes || 0
                } minutes`,
                {
                  duration: 4000,
                  position: "top-center",
                }
              );
            }
          }
        } catch (error) {
          console.error("Error sending location update:", error);
          // Don't show error toast for location updates to avoid spam
        }
      }
    },
    [isInsideLibrary]
  );

  // Handle location errors
  const handleLocationError = useCallback((error) => {
    let errorMessage = "Unknown location error";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location access denied by user";
        setPermissionStatus("denied");
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out";
        break;
      default:
        errorMessage = "An unknown error occurred while retrieving location";
        break;
    }

    setError(errorMessage);
    console.error("Geolocation error:", error);
  }, []);

  // Start GPS tracking
  const startTracking = useCallback(async () => {
    if (!isLocationSupported) {
      setError("Geolocation is not supported");
      return false;
    }

    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      setError("Location permission not granted or not enabled");
      return false;
    }

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    try {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        handleLocationUpdate,
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        }
      );

      // Start watching position
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        handleLocationError,
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 30000, // Accept location up to 30 seconds old
        }
      );

      setIsTracking(true);
      setError(null);
      console.log("GPS tracking started");
      return true;
    } catch (error) {
      console.error("Error starting GPS tracking:", error);
      setError("Failed to start location tracking");
      return false;
    }
  }, [
    isLocationSupported,
    checkPermissions,
    handleLocationUpdate,
    handleLocationError,
  ]);

  // Stop GPS tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (entryTimeoutRef.current) {
      clearTimeout(entryTimeoutRef.current);
      entryTimeoutRef.current = null;
    }

    setIsTracking(false);
    setCurrentLocation(null);
    setIsInsideLibrary(false);
    locationHistoryRef.current = [];
    console.log("GPS tracking stopped");
  }, []);

  // Initialize tracking on mount if permissions are granted
  useEffect(() => {
    const initializeTracking = async () => {
      const hasPermission = await checkPermissions();
      if (hasPermission) {
        startTracking();
      }
    };

    initializeTracking();

    // Cleanup on unmount
    return () => {
      stopTracking();
    };
  }, [checkPermissions, startTracking, stopTracking]);

  // Restart tracking when permission changes
  useEffect(() => {
    if (permissionStatus === "granted" && isPermissionEnabled && !isTracking) {
      startTracking();
    } else if (
      (permissionStatus === "denied" || !isPermissionEnabled) &&
      isTracking
    ) {
      stopTracking();
    }
  }, [
    permissionStatus,
    isPermissionEnabled,
    isTracking,
    startTracking,
    stopTracking,
  ]);

  // Request location permission
  const requestPermission = useCallback(() => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPermissionStatus("granted");
          handleLocationUpdate(position);
          resolve(true);
        },
        (error) => {
          setPermissionStatus("denied");
          handleLocationError(error);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }, [handleLocationUpdate, handleLocationError]);

  return {
    // State
    isTracking,
    currentLocation,
    isInsideLibrary,
    lastEntryEvent,
    error,
    permissionStatus,
    isPermissionEnabled,
    isLocationSupported,
    locationHistory: locationHistoryRef.current,

    // Actions
    startTracking,
    stopTracking,
    requestPermission,
    checkPermissions,

    // Computed values
    distanceFromLibrary: currentLocation
      ? calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          LIBRARY_LOCATION.latitude,
          LIBRARY_LOCATION.longitude
        )
      : null,
  };
};

export default useGPSTracking;
