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

  validateOrganization = (authorization) => {
    return new Promise((resolve, reject) => {
      let options = {
        url: Constants.api.force.base + Constants.api.force.auth,
        method: this.method.get,
        headers: {
          'Authorization': authorization,
        },
      };

      request(options, (error, response, body) => {
        if(response.statusCode === Util.code.bad) {
          let err = new Error();
          err.message = response.body;
          err.statusCode = response.statusCode;
          return reject(err);
        }
        resolve(JSON.parse(body));
      });
    });
  };
}

export default new ApiUtil();
