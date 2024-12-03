import axios from "axios";

// The backend API URL for adding HOD
const apiUrl = "http://localhost:5000/api/masterAdmin/hod";  

// Function to decode JWT token
const decodeJWT = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));  // Decode the JWT payload
    return payload;  // Return the decoded token payload
  } catch (error) {
    throw new Error("Failed to decode token");
  }
};

// Function to add a new HOD
export const addHod = async (hodData) => {
  try {
    // Retrieve the token from sessionStorage
    const token = sessionStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found.");
    }

    // Decode the JWT token to extract the masterAdminId
    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.masterAdmin) {
      throw new Error("Invalid token: masterAdminId missing.");
    }

    // Prepare the data to send to the backend, including masterAdminId
    const dataToSend = {
      ...hodData,  // Include the form data (name, role, username, etc.)
      masterAdmin: decodedToken.masterAdmin,  // Add masterAdminId from decoded token
    };

    // Send a POST request to the backend to add the HOD
    const response = await axios.post(`${apiUrl}/add`, dataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
      },
    });

    // Check if the response is successful
    if (response.status !== 201) {
      throw new Error(`Failed to add HOD: ${response.statusText}`);
    }

    return response.data;  // Return the response data (success message, new HOD details, etc.)
  } catch (err) {
    console.error("Error in addHod service:", err);
    throw err;  // Rethrow the error to be handled by the component
  }
};
