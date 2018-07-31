import Constants from '../config/constants';
import Util from '../lib/util';
import request from 'request';

class ApiUtil {
  constructor() {}

  method = {
    get: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE',
  };

  validateOrganization = (authorization, params) => {
    console.log(params);
    return new Promise((resolve) => {
      let options = {
        url: Constants.api.force.base + Constants.api.force.auth,
        method: this.method.post,
        headers: {
          'Authorization': authorization,
          'content-type': 'application/json',
        },
        body: JSON.stringify(params),
      };

      console.log(options);
      request(options, (error, response, body) => {
        if(response.statusCode === Util.code.bad) {
          return resolve(null);
        }
        resolve(response.statusCode);
      });
    });
  };
}

export default new ApiUtil();
