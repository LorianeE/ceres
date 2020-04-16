import axios from 'axios';

async function mapBody(response, bodyOnly) {
  if (bodyOnly) {
    return response.data;
  }
  return {
    headers: response.headers,
    body: response.data,
  };
}

const httpClient = {
  async get(url, bodyOnly = true) {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    return mapBody(response, bodyOnly);
  },

  async post(url, body, bodyOnly = true) {
    const response = await axios.post(url, body, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return mapBody(response, bodyOnly);
  },

  async put(url, body, bodyOnly = true) {
    const response = await axios.put(url, body, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return mapBody(response, bodyOnly);
  },

  async delete(url) {
    return axios.delete(url, {
      method: 'DELETE',
      withCredentials: true,
    });
  },
};

export default httpClient;
