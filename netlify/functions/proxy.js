const axios = require("axios");

exports.handler = async (event, context) => {
  const { httpMethod, headers, queryStringParameters, body } = event;

  try {
    const response = await axios({
      method: httpMethod,
      url: `https://audiophile-e-commerce-server.fly.dev${event.path}`,
      headers: {
        ...headers,
        "Access-Control-Allow-Origin":
          "https://audiophile-e-commerce-beneatock.netlify.app",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      params: queryStringParameters,
      data: body,
      withCredentials: true,
    });
    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify(error.response?.data || {}),
    };
  }
};
