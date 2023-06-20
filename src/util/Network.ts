import fetch from 'cross-fetch';


export async function HttpSend({
  to,
  formData,
  method = "POST",
  type = "",
  params = {},
  contentType = ""
}) {
  //if(checkToken)
  //isValidToken()
  var FormData = require('form-data');
  var _ = require('lodash')

  let form = null;
  let header = {};

  if (method === "POST") {
    if(contentType !== "application/json"){
      form = new FormData();
      if (typeof formData === "object") {
        for (const [key, value] of Object.entries(formData)) {
          form.append(key, value);
        }
      }
    } else {
      form = JSON.stringify(formData);
      header = { ...header, "Content-Type": "application/json; charset=UTF-8" };
    }
  } else if (method === "PUT") {
    form = JSON.stringify(formData);
    header = { ...header, "Content-Type": "application/json; charset=UTF-8" };
  }
  if (!_.isEmpty(params)) {
    let num = 0;
    _.forOwn(params, function (value, key) {
      if (num === 0) to += "?" + key + "=" + value;
      else to += "&" + key + "=" + value;
      num++;
    });
  }
  // }

  return new Promise((resolve, reject) => {
    fetch( to, {
      method: method,
      body: form,
      headers: header,
    })
      .then(function (response) {
        if (type){
          if(type == 'arrayBuffer')
            return response.arrayBuffer()
          return response.blob();
        }
        return response.json();
      })
      .then((res) => {
        resolve(res);
      }).catch(ct=>{
      });
  });
}

/**
 * Generate query for URL
 * 
 * @param string url 
 * @param array params 
 * @returns string
 */
export function UrlQueryBuilder(url, params) {
  for (let i = 0; i < params.length; i++) {
    if (i === 0) {
      url += "?" + params[i].key + "=" + params[i].value;
    } else {
      url += "&" + params[i].key + "=" + params[i].value;
    }
  }

  return url
}

export function QueryGraphQLBuilder(param) {
  let query = "";
  for (let i = 0; i < param.length; i++) {
    if (i === (param.length - 1)) {
      query += param[i].key + ":" + param[i].value;
    } else {
      query += param[i].key + ":" + param[i].value  + ",";
    }
  }

  return query
}
