import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Util from '../lib/util';
import EncryptionUtil from '../lib/encryption.util';


const OrganizationSchema = new Schema({
  alias: {
    type: String,
    required: [true, 'Alias is required.'],
    validate: {
      async validator(alias) {
        return await OrganizationModel.findOne({
          $and: [{ alias }, { _user: this._user }],
        }).then((organization) => {
          return !organization;
        })
          .catch(() => {
            return false;
          });
      }, message: '{VALUE} is already in use.',
    },
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Email is required'],
    validate: {
      validator(email) {
        // eslint-disable-next-line max-len
        const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
        return emailRegex.test(email);
      }, message: '{VALUE} is not a valid email.',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  securityToken: {
    type: String,
    required: [true, 'Security Token is required.'],
  },
  type: {
    type: String,
    required: [true, 'Type is required.'],
  },
  _user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User is required'],
  },
}, {
  timestamps: true,
});

// Strip out password field when sending organization object to client
OrganizationSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    obj.id = obj._id;
    delete obj._id;
    obj.user = obj._user;
    delete obj._user;

    delete obj.password;
    delete obj.securityToken;
    delete obj.__v;

    return obj;
  },
});

OrganizationSchema
  .pre('save', async function(done) {
    // Encrypt password before saving the document
    await new Promise(async (resolve) => {
      if (this.isModified('password')) {
        this.password = await EncryptionUtil.encryptText(this.password);
        resolve();
      } else {
        resolve();
      }
    });
    // Encrypt securityToken before saving the document
    await new Promise(async (resolve) => {
      if (this.isModified('securityToken')) {
        this.securityToken = await EncryptionUtil.encryptText(this.securityToken);
        resolve();
      } else {
        resolve();
      }
    });
    done();
  });

OrganizationSchema.statics = {
  async exists(id, next) {
    try {
      if (!id) {
        let err = new Error;
        err.message = Util.message.organization.notFound;
        err.status = Util.code.notFound;
        console.log(err);
        return next(err);
      }
      return await this.findById(id);
    } catch(err) {
      err.message = Util.message.organization.notFound;
      err.status = Util.code.notFound;
      console.log(err);
      next(err);
    }
  },
};

const OrganizationModel = mongoose.model('Organization', OrganizationSchema);

export default OrganizationModel;
