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
    return new Promise((resolve) => {
      let options = {
        url: Constants.api.force.base + Constants.api.force.auth,
        method: this.method.post,
        headers: {
          'Authorization': authorization,
        },
      };

      request(options, (error, response, body) => {
        if(response.statusCode === Util.code.bad) {
          return resolve(null);
        }
        resolve(JSON.parse(body));
      });
    });
  };
}

export default new ApiUtil();
