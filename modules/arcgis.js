
const urlToken = 'https://www.arcgis.com/sharing/rest/oauth2/token';
let TOKEN = '';

function post(url, data) {
  let options = {
    method: 'POST',
    body: data,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    }
  };
  return fetch(url, options);
}

function editSuccess(res, op = 'addResults') {
  try {
    let success = res[op][0].success;

    if (success) {
      return true;
    } else {
      console.log(res[op][0].error.description);
      return false
    }
  } catch(err) {
    return false;
  }
}

function urlEncode(params) {
  let urlParams = new URLSearchParams();
  for (let key in params) {
    urlParams.append(key, params[key]);
  }
  return urlParams;
}

async function getToken(credentials = '') {    
  if (credentials) {
    if (!TOKEN) {
      let urlencoded = urlEncode(credentials)
      let response = await post(urlToken, urlencoded);
      let j = await response.json();
      TOKEN = j.access_token;
    }
    return TOKEN
  } else {
    return '';
  }
}

export async function get(url, params = '', credentials = '') {
  let token = await getToken(credentials);
  let query = `/query?f=json&token=${token}&`;
  
  let defaults = {
      where: '1=1',
      outFields: '*',
  }
  
  let allParams = Object.assign({}, defaults, params);

  query += Object.keys(allParams).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(allParams[key])
  }).join('&');

  let response = await fetch(url + query);
  let j = await response.json()
  return j.features;
}

export async function add(url, features, credentials = '') {
  let token = await getToken(credentials);
  url += '/addFeatures';
  
  var urlencoded = new URLSearchParams();
  urlencoded.append("f", "json");
  urlencoded.append("token", token);
  urlencoded.append("features", JSON.stringify(features));

  let response = await post(url, urlencoded);
  let j = await response.json();
  return editSuccess(j, 'addFeatures');
}