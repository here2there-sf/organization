import authenticate from './authenticate';
import Organization from '../models/organization';
import Backup from '../models/backup';
import Util from '../lib/util';

class AccessControlOwner {

  // Organization owner access control
  organization = () => {
    return (req, res, next) => authenticate(req, res, async (err) => {
      try {
        const organization = await Organization.findOne({
          $and: [
            { _user: req.currentUser._id },
            { _id: req.body.id },
          ],
        });
        if (!organization) {
          let err = new Error();
          err.message = Util.message.organization.notFound;
          err.status = Util.code.notFound;
          return next(err);
        }

        next();
      } catch(err) {
        err.message = Util.message.organization.notFound;
        err.status = Util.code.notFound;
        next(err);
      }
    });
  };

  // Backup owner access control
  backup = () => {
    return (req, res, next) => authenticate(req, res, async (err) => {
      // error when _id dne
      const allowed = await Backup.find({
        $and: [
          { _id: req.body._id },
          { _organization: { $in: req.organizations } },
        ],
      });

      if (err || !req.currentUser || !allowed) {
        res.sendStatus(Util.code.forbidden);
        return;
      }
      next();
    });
  };

}

export default new AccessControlOwner();
