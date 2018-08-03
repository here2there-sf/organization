import BaseController from './base.controller';
import Organization from '../models/organization';
import Util from '../lib/util';
import ForceUtil from '../lib/force.util';

class OrganizationController extends BaseController {
  whitelist = [
    'id',
    'alias',
    'email',
    'password',
    'securityToken',
    'type',
  ];

  deleteWhiteList = [
    'id',
  ];

  /** *
   * req.currentUser is populated by middleware
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * */
  create = async (req, res, next) => {
    let loggedIn;
    try {
      const params = this.filterParams(req.body, this.whitelist);

      loggedIn = await ForceUtil.login(params, next);
      if(!loggedIn) return;

      let organization = new Organization({
        ...params,
        _user: req.currentUser._id,
      });

      res.status(Util.code.created).json(await organization.save());
    } catch(err) {
      next(err);
    } finally {
      loggedIn.logout();
    }
  };

  /** *
   * Fetch all organizations
   * req.organizations is populated by middleware
   *
   * @param {Object} req
   * @param {Object} res
   * */
  fetch = async (req, res) => {
    res.json(req.organizations);
  };

  /** *
   * Fetch single organizations
   * req.organizations is populated by middleware
   *
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * @return {function} or null
   * */
  fetchOne = async (req, res, next) => {
    try {
      const { id } = req.params;

      let organization = await Organization.findById(id);
      if (!organization) {
        // Organization not found
        let err = new Error();
        err.status = Util.code.notFound;
        err.message = Util.message.organization.notFound;
        console.log(err);
        return next(err);
      }

      const conn = await ForceUtil.loginEncrypted(organization, next);

      const response = {
        oauth2: {
          instanceUrl: conn.instanceUrl,
          accessToken: conn.accessToken,
        },
        organization: organization.toJSON(),
      };

      res.status(Util.code.ok).json(response);
    } catch(err) {
      // Invalid id
      err.status = err.name ==='CastError' ? Util.code.notFound : Util.code.internalServerError;
      err.message = Util.message.organization.notFound;
      console.log(err);
      next(err);
    }
  };

  /** *
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * */
  update = async (req, res, next) => {
    let loggedIn;
    try {
      const params = this.filterParams(req.body, this.whitelist);

      loggedIn = await ForceUtil.login(params, next);
      if(!loggedIn) return;

      res.status(Util.code.ok).json(await Organization.update({ _id: params.id }, params));
    } catch(err) {
      next(err);
    } finally {
      loggedIn.logout();
    }
  };

  /** *
   * Removes all scheduled backups and the organization
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * */
  delete = async (req, res, next) => {
    try {
      const params = this.filterParams(req.body, this.deleteWhiteList);
      // await Backup.remove({ _organization: params.id });
      await Organization.remove({ _id: params.id });
      res.sendStatus(Util.code.deleted);
    } catch(err) {
      next(err);
    }
  };
}

export default new OrganizationController();
