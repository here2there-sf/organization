import BaseController from './base.controller';
import Backup from '../models/backup';
import Util from '../lib/util';

class BackupController extends BaseController {
  whitelist = ['frequency', 'organization'];
  deleteWhiteList = ['id'];

  create = async (req, res, next) => {
    try {
      let params = this.filterParams(req.body, this.whitelist);
      let backup = new Backup({
        ...params,
        _organization: params.organization,
      });

      res.status(Util.code.created).json(await backup.save());
    } catch(err) {
      next(err);
    }
  };

  /** *
   * Fetch all backups
   * req.backups is populated by middleware
   *
   * @param {Object} req
   * @param {Object} res
   * */
  fetch = async (req, res) => {
    let backups = await Backup.aggregate([
      {
        $match: { _organization: { $in: req.organizations.map( (organization) => organization._id ) } },
      },
      {
        $lookup: {
          from: 'organizations',
          localField: '_organization',
          foreignField: '_id',
          as: 'organization',
        },
      },
      {
        $project: {
          'organization.password': false,
          'organization.securitytoken': false,
          'organization._id': false,
          'organization._user': false,
          'organization.__v': false,
          'organization.createdAt': false,
          'organization.updatedAt': false,
        },
      },
    ]);
    res.json(backups);
  };

  /** *
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   * */
  delete = async (req, res, next) => {
    try {
      const params = this.filterParams(req.body, this.deleteWhiteList);
      await Backup.remove({ _id: params.id });
      res.sendStatus(Util.code.deleted);
    } catch(err) {
      next(err);
    }
  };
}

export default new BackupController();
