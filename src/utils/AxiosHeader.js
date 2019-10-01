import axios from 'axios'

export default function withStoredHeaders() {
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  const values = JSON.parse(localStorage.getItem('token'));

  return axios.create({
  	baseURL: 'https://api.backroom.id/',
    headers: {
      'Authorization' : `Bearer ${values.token}`,
    },
  })
}

