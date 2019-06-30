import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    res.json(401).json({ error: 'Token undefined' });
  }

  const [, token] = header.split(' ');

  if (!token) {
    res.json(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    req.id = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
