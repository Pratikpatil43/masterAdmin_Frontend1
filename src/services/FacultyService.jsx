// import axios from "axios";

// // The backend API URL for adding faculty
// const apiUrl = "http://localhost:5000/api/masterAdmin/faculty";  

// // Function to decode JWT token
// const decodeJWT = (token) => {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));  // Decode the JWT payload
//     return payload;  // Return the decoded token payload
//   } catch (error) {
//     throw new Error("Failed to decode token");
//   }
// };

// // Function to add a new Faculty
// export const addFaculty = async (facultyData) => {
//   try {
//     // Retrieve the token from sessionStorage
//     const token = sessionStorage.getItem("token");

//     if (!token) {
//       throw new Error("No authentication token found.");
//     }

//     // Decode the JWT token to extract the masterAdminId
//     const decodedToken = decodeJWT(token);
//     if (!decodedToken || !decodedToken.masterAdmin) {
//       throw new Error("Invalid token: masterAdminId missing.");
//     }

//     // Prepare the data to send to the backend, including masterAdminId
//     const dataToSend = {
//       ...facultyData,  // Include the form data (name, facultyUsername, password, etc.)
//       masterAdmin: decodedToken.masterAdmin,  // Add masterAdminId from decoded token
//     };

//     // Send a POST request to the backend to add the faculty
//     const response = await axios.post(`${apiUrl}/add`, dataToSend, {
//       headers: {
//         Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
//       },
//     });

//     // Check if the response is successful
//     if (response.status !== 201) {
//       throw new Error(`Failed to add Faculty: ${response.statusText}`);
//     }

//     return response.data;  // Return the response data (success message, new faculty details, etc.)
//   } catch (err) {
//     console.error("Error in addFaculty service:", err);
//     throw err;  // Rethrow the error to be handled by the component
//   }
// };
