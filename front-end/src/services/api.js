// src/api/dashboardApi.js
import mockData from '../data/mockData'; // adjust the path as needed

export const getDashboardData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8080/getDetails?username=Subhash17', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    console.log(data);

    // If response data is empty or not returned, use mock data
    if (!data) {
      console.warn('No data returned from GET request, using mock data.');
      return mockData;
    }

    return data;
  } catch (error) {
    console.error('Error posting dashboard data, using mock data:', error);
    return mockData;
  }
};

export const submitFinancialData = async (data) => {
  data.userDetails = {
    ...data.userDetails,
    username: 'Subhash17'
  };

  try {
    const response = await fetch('http://127.0.0.1:8080/addDetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    console.log(data);
    return response.data;
  } catch (error) {
    console.error('Error submitting financial data:', error);
    // For development, return success even if the API call fails
    return { success: true };
  }
};


export const queryChatbot = async (question, financialData) => {
  try {
    let finalData = `${financialData} \n ${question}`
    const response = await fetch(
      "http://localhost:3000/api/v1/prediction/669d3a0c-91db-452e-bcc3-b3a75755fd19",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "question": finalData
        })
      }
    );
    const result = await response.json();
    console.log("chat result");
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error querying chatbot:', error);
    return { response: "I'm sorry, I'm having trouble connecting to the server. Please try again later." };
  }
};