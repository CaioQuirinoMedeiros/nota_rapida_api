import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = await jwt.verify(token, authConfig.secret);

    const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).send({ error: 'Please authenticate' });
  }
};

export default auth;
