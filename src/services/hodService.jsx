import axios from "axios";

// The backend API URL for adding HOD
const apiUrl = "https://attendancetracker-backend1.onrender.com/api/masterAdmin/hod/add";  

// Function to decode JWT token
const decodeJWT = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));  // Decode the JWT payload
    return payload;
  } catch (error) {
    throw new Error("Failed to decode token");
  }
};

// Function to add a new HOD
export const addHod = async (hodData) => {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found.");
    }

    const decodedToken = decodeJWT(token);

    if (!decodedToken || !decodedToken.masterAdmin) {
      throw new Error("Invalid token: masterAdminId missing.");
    }

    const dataToSend = {
      ...hodData,
      masterAdmin: decodedToken.masterAdmin,
    };

    const response = await axios.post(apiUrl, dataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 201) {
      throw new Error(`Failed to add HOD: ${response.statusText}`);
    }

    return response.data;
  } catch (err) {
    console.error("Error in addHod service:", err);
    throw err;
  }
};
