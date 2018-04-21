import * as mongoose from 'mongoose';
import config from '../../../config';

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI);

export default mongoose;
