import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = await jwt.verify(token, authConfig.secret);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).send({ error: 'Autentique-se' });
  }
};

export default auth;
