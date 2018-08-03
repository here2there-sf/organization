import jwt from 'jsonwebtoken';
import Organization from '../models/organization';
import Constants from '../config/constants';
import Util from '../lib/util';

const { sessionSecret } = Constants.security;

export default function authenticate(req, res, next) {
  const { authorization } = req.headers;
  jwt.verify(authorization, sessionSecret, async (err, decoded) => {
    if (err) {
      return res.sendStatus(Util.code.forbidden);
    }
    // If token is decoded successfully, find user and attach to our request
    // for use in our route or other middleware
    try {
      req.currentUser = decoded;

      req.organizations = await Organization.find({ _user: req.currentUser._id });
      next();
    } catch(err) {
      next(err);
    }
  });
}
