const axios = require("axios");

exports.handler = async (event, context) => {
  const { httpMethod, path, headers, queryStringParameters, body } = event;

  try {
    const url = new URL(
      decodeURIComponent(event.path.split(".netlify/functions/proxy/")[1])
    );

    for (const i in queryStringParameters) {
      url.searchParams.append(i, queryStringParameters[i]);
    }

    const response = await axios({
      method: httpMethod,
      url,
      headers: {
        ...headers,
        "content-type": "application/json",
        accept: "*/*",
        host: url.host,
      },
      body,
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
