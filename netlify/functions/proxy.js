const axios = require("axios");

exports.handler = async (event, context) => {
  const { httpMethod, headers, queryStringParameters, body } = event;

  try {
    const response = await axios({
      method: httpMethod,
      url: `https://audiophile-e-commerce-server.fly.dev${event.path}`,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      params: queryStringParameters,
      data: body,
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
