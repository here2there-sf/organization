import Util from './util';
import jsforce from 'jsforce';
import EncryptionUtil from '../lib/encryption.util';


class ForceUtil {
  /** *
   * HELPER
   * Login to Salesforce
   *
   * @param {object} params
   * @param {function} next
   * @return {Promise<UserInfo|*>}
   * */
  login = async (params, next) => {
    let conn = new jsforce.Connection();

    try {
      await conn.login(params.email, params.password + params.securitytoken);
      return conn;
    } catch(err) {
      err.message = Util.message.salesforce.loginError;
      err.status = Util.code.bad;
      console.log(err);
      next(err);
    }
  };

  loginEncrypted = async (params, next) => {
    let conn = new jsforce.Connection();

    try {
      await conn.login(params.email, EncryptionUtil.decryptText(params.password) + params.securitytoken);
      return conn;
    } catch(err) {
      err.message = Util.message.salesforce.loginError;
      err.status = Util.code.bad;
      console.log(err);
      next(err);
    }
  };
}

export default new ForceUtil();
