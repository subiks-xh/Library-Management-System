// GPS Tracking API Service
const API_BASE = "/api/gps-tracking";

class GPSTrackingAPI {
  constructor() {
    this.baseURL = API_BASE;
  }

  // Get authorization headers
  getHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        error || `HTTP ${response.status}: ${response.statusText}`
      );
    }
    return response.json();
  }

  // Check if student has location permission enabled
  async getPermissionStatus() {
    try {
      const response = await fetch(`${this.baseURL}/permission-status`, {
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching permission status:", error);
      throw error;
    }
  }

  // Update student's location permission
  async updatePermission(isEnabled) {
    try {
      const response = await fetch(`${this.baseURL}/update-permission`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ isEnabled }),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error updating permission:", error);
      throw error;
    }
  }

  // Send location update
  async updateLocation(locationData) {
    try {
      const response = await fetch(`${this.baseURL}/update-location`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(locationData),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  }

  // Get current library occupancy
  async getCurrentOccupancy() {
    try {
      const response = await fetch(`${this.baseURL}/current-occupancy`, {
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching current occupancy:", error);
      throw error;
    }
  }

  // Get entry/exit logs
  async getEntryLogs(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.date) queryParams.append("date", filters.date);
      if (filters.studentId)
        queryParams.append("student_id", filters.studentId);
      if (filters.limit) queryParams.append("limit", filters.limit);
      if (filters.offset) queryParams.append("offset", filters.offset);

      const url = `${this.baseURL}/entry-logs${
        queryParams.toString() ? `?${queryParams}` : ""
      }`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching entry logs:", error);
      throw error;
    }
  }

  // Get analytics data
  async getAnalytics(period = "today") {
    try {
      const response = await fetch(
        `${this.baseURL}/analytics?period=${period}`,
        {
          headers: this.getHeaders(),
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }

  // Get dashboard stats (condensed version for widgets)
  async getDashboardStats() {
    try {
      const response = await fetch(`${this.baseURL}/dashboard-stats`, {
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }

  // Admin: Update library geofence configuration
  async updateGeofence(config) {
    try {
      const response = await fetch(`${this.baseURL}/admin/geofence`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(config),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error updating geofence:", error);
      throw error;
    }
  }

  // Admin: Get geofence configuration
  async getGeofence() {
    try {
      const response = await fetch(`${this.baseURL}/admin/geofence`, {
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching geofence:", error);
      throw error;
    }
  }

  // Get student location history (for admin/librarian)
  async getStudentLocationHistory(studentId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.startDate)
        queryParams.append("start_date", filters.startDate);
      if (filters.endDate) queryParams.append("end_date", filters.endDate);
      if (filters.limit) queryParams.append("limit", filters.limit);

      const url = `${this.baseURL}/student/${studentId}/history${
        queryParams.toString() ? `?${queryParams}` : ""
      }`;
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching student location history:", error);
      throw error;
    }
  }

  // Export data for reports
  async exportData(format = "csv", filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.startDate)
        queryParams.append("start_date", filters.startDate);
      if (filters.endDate) queryParams.append("end_date", filters.endDate);
      if (filters.department)
        queryParams.append("department", filters.department);
      queryParams.append("format", format);

      const response = await fetch(`${this.baseURL}/export?${queryParams}`, {
        headers: {
          ...this.getHeaders(),
          Accept: format === "csv" ? "text/csv" : "application/json",
        },
      });

      if (format === "csv") {
        return response.text();
      }
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  }

  // Real-time updates using Server-Sent Events (SSE)
  subscribeToUpdates(onUpdate, onError) {
    const eventSource = new EventSource(`${this.baseURL}/live-updates`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onUpdate(data);
      } catch (error) {
        console.error("Error parsing live update:", error);
        if (onError) onError(error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("GPS tracking live updates error:", error);
      if (onError) onError(error);
    };

    // Return cleanup function
    return () => {
      eventSource.close();
    };
  }
}

// Create singleton instance
const gpsTrackingAPI = new GPSTrackingAPI();

// Export both the class and the instance
export { GPSTrackingAPI };
export default gpsTrackingAPI;
