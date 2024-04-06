const BASE_URL = 'http://localhost:8000'; // Replace with your API base URL

// Helper function for making GET requests
export const getApi = async (url) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {mode:'no-cors'});
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in GET request:', error);
    throw error;
  }
  // fetch('https://example.com/api/endpoint')
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error('Response not ok');
  //   }
  //   return response.json(); // Parse as JSON
  // })
  // .then(data => {
  //   // Handle the response data
  //   console.log(data);
  // })
  // .catch(error => {
  //   // Handle errors
  //   console.error('Error:', error.message);
  // });
};

// Helper function for making POST requests
export const postApi = async (url, data) => {
  // try {
  //   const response = await fetch(`${BASE_URL}${url}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //     mode:'no-cors',
  //   });
  //   console.log(response)
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }
  //   const responseData = await response.json();
  //   console.log(responseData)
  //   return responseData;
  // } catch (error) {
  //   console.error('Error in POST request:', error);
  //   throw error;
  // }
  // fetch(`${BASE_URL}${url}`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  //   mode:'no-cors',
  // })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     console.log(response)
  //     return response.json(); // Parse the JSON response data
  //   })
  //   .then(data => {
  //     // Handle the response data
  //     console.log(data);
  //   })
  //   .catch(error => {
  //     // Handle errors
  //     console.error('Error:', error.message);
  //   });
  
};
