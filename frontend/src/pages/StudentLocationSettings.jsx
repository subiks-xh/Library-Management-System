import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import gpsTrackingAPI from "../services/gpsTrackingAPI";
import {
  MapPinIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  EyeSlashIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

// API calls using the GPS tracking service
const fetchLocationPermissionStatus = async () => {
  return gpsTrackingAPI.getPermissionStatus();
};

const updateLocationPermission = async ({ isEnabled }) => {
  return gpsTrackingAPI.updatePermission(isEnabled);
};

function StudentLocationSettings() {
  const [locationPermission, setLocationPermission] = useState("prompt"); // "granted", "denied", "prompt"
  const [isLocationSupported, setIsLocationSupported] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Query for current permission status
  const { data: permissionData, refetch: refetchPermission } = useQuery({
    queryKey: ["location-permission-status"],
    queryFn: fetchLocationPermissionStatus,
  });

  // Mutation for updating permission
  const updatePermissionMutation = useMutation({
    mutationFn: updateLocationPermission,
    onSuccess: (data) => {
      toast.success(
        data.isEnabled
          ? "GPS tracking enabled successfully!"
          : "GPS tracking disabled successfully!"
      );
      refetchPermission();
    },
    onError: (error) => {
      toast.error("Failed to update GPS tracking settings");
      console.error("Permission update error:", error);
    },
  });

  // Check browser location support and permission
  useEffect(() => {
    const checkLocationSupport = async () => {
      if (!("geolocation" in navigator)) {
        setIsLocationSupported(false);
        return;
      }

      try {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        setLocationPermission(result.state);

        // Listen for permission changes
        result.onchange = () => {
          setLocationPermission(result.state);
        };
      } catch (error) {
        console.error("Error checking location permission:", error);
      }
    };

    checkLocationSupport();
  }, []);

  const requestLocationPermission = () => {
    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationPermission("granted");
        setIsGettingLocation(false);
        toast.success("Location access granted!");
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = "Location access denied";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access was denied. Please enable in browser settings.";
            setLocationPermission("denied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage =
              "An unknown error occurred while retrieving location.";
            break;
        }

        toast.error(errorMessage);
        console.error("Location error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const toggleGPSTracking = async (enable) => {
    if (enable && locationPermission !== "granted") {
      // First request browser permission
      requestLocationPermission();
      return;
    }

    // Update server-side permission
    updatePermissionMutation.mutate({ isEnabled: enable });
  };

  const getPermissionStatusIcon = () => {
    switch (locationPermission) {
      case "granted":
        return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
      case "denied":
        return <XCircleIcon className="h-8 w-8 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getPermissionStatusText = () => {
    switch (locationPermission) {
      case "granted":
        return "Location access granted";
      case "denied":
        return "Location access denied";
      default:
        return "Location access not requested";
    }
  };

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("chrome")) {
      return "Click the location icon in the address bar and select 'Allow'";
    } else if (userAgent.includes("firefox")) {
      return "Click 'Share Location' when prompted, or check the shield icon in the address bar";
    } else if (userAgent.includes("safari")) {
      return "Go to Safari > Preferences > Websites > Location and allow access";
    } else if (userAgent.includes("edge")) {
      return "Click the location icon in the address bar and select 'Allow'";
    } else {
      return "Please allow location access when prompted by your browser";
    }
  };

  if (!isLocationSupported) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Location Not Supported
          </h3>
          <p className="text-red-700">
            Your browser does not support location services. Please use a modern
            browser like Chrome, Firefox, Safari, or Edge to use GPS tracking
            features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title flex items-center">
          <MapPinIcon className="h-8 w-8 mr-3 text-primary-600" />
          GPS Location Settings
        </h1>
        <p className="page-subtitle">
          Manage your location preferences for automatic library entry tracking
        </p>
      </div>

      {/* Current Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {getPermissionStatusIcon()}
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Location Permission Status
              </h3>
              <p className="text-sm text-gray-500">
                {getPermissionStatusText()}
              </p>
            </div>
          </div>

          {locationPermission === "granted" && (
            <div className="text-right">
              <div className="text-sm text-gray-500">GPS Tracking</div>
              <div
                className={`text-lg font-medium ${
                  permissionData?.isEnabled ? "text-green-600" : "text-gray-400"
                }`}
              >
                {permissionData?.isEnabled ? "Enabled" : "Disabled"}
              </div>
            </div>
          )}
        </div>

        {/* Main Toggle */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-base font-medium text-gray-900">
                Enable GPS Library Tracking
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Automatically track your library visits using your device's
                location. This eliminates the need for manual check-ins.
              </p>
            </div>
            <button
              onClick={() => toggleGPSTracking(!permissionData?.isEnabled)}
              disabled={updatePermissionMutation.isLoading || isGettingLocation}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2
                ${permissionData?.isEnabled ? "bg-green-600" : "bg-gray-200"}
                ${
                  updatePermissionMutation.isLoading || isGettingLocation
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                  transition duration-200 ease-in-out
                  ${
                    permissionData?.isEnabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start">
            <InformationCircleIcon className="h-6 w-6 text-blue-500 mt-1" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                How GPS Tracking Works
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Your device's location is checked when you're near the
                    library
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Automatic entry is logged when you enter the library
                    premises
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Exit is recorded when you leave the library area</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>No manual check-in or check-out required</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start">
            <ShieldCheckIcon className="h-6 w-6 text-green-500 mt-1" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Privacy & Security
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>
                    Location data is only used for library entry tracking
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Data is encrypted and stored securely</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>You can disable tracking anytime</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Location is not shared with third parties</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Instructions */}
      {locationPermission !== "granted" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <CogIcon className="h-6 w-6 text-blue-500 mt-1" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Enable Location Access
              </h3>
              <p className="text-blue-800 mb-3">
                To use GPS tracking, you need to allow location access in your
                browser:
              </p>
              <p className="text-sm text-blue-700 mb-4">
                {getBrowserInstructions()}
              </p>
              <button
                onClick={requestLocationPermission}
                disabled={isGettingLocation}
                className="btn-primary flex items-center"
              >
                {isGettingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Request Location Access
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Location Display */}
      {currentLocation && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Current Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-gray-500">Latitude</label>
              <span className="font-mono text-gray-900">
                {currentLocation.latitude.toFixed(6)}
              </span>
            </div>
            <div>
              <label className="block text-gray-500">Longitude</label>
              <span className="font-mono text-gray-900">
                {currentLocation.longitude.toFixed(6)}
              </span>
            </div>
            <div>
              <label className="block text-gray-500">Accuracy</label>
              <span className="text-gray-900">
                {Math.round(currentLocation.accuracy)}m
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {permissionData?.isEnabled && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Your GPS Tracking Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {permissionData?.entryCount || 0}
              </div>
              <div className="text-sm text-gray-500">Library Visits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {permissionData?.lastUpdated ? "Active" : "Inactive"}
              </div>
              <div className="text-sm text-gray-500">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {permissionData?.lastUpdated
                  ? new Date(permissionData.lastUpdated).toLocaleDateString()
                  : "Never"}
              </div>
              <div className="text-sm text-gray-500">Last Updated</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentLocationSettings;
