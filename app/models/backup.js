import mongoose from 'mongoose';
import Util from '../lib/util';
const Schema = mongoose.Schema;

const BackupSchema = new Schema({
  frequency: {
    type: Number,
    default: Util.constant.week,
  },
  _organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required.'],
  },
}, {
  timestamps: true,
});

BackupSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    obj.id = obj._id;
    delete obj._id;

    obj.organization = obj._organization;
    delete obj._organization;

    delete obj.__v;
    return obj;
  },
});

BackupSchema.statics = {
  async exists(id, next) {
    try {
      if (!id) {
        let err = new Error;
        err.message = Util.message.backup.notFound;
        err.status = Util.code.notFound;
        console.log(err);
        return next(err);
      }
      return await this.findById(id);
    } catch(err) {
      err.message = Util.message.backup.notFound;
      err.status = Util.code.notFound;
      console.log(err);
      next(err);
    }
  },
};

const BackupModel = mongoose.model('Backup', BackupSchema);

export default BackupModel;
