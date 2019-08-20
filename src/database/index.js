import mongoose from 'mongoose';
import databaseConfig from '../config/database';

export default mongoose
  .connect(process.env.MONGO_URL, databaseConfig)
  .catch(err => console.log(err));
