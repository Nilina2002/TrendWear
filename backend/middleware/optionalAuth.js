import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Optional authentication middleware - doesn't fail if no token
// Sets req.user if token is valid, otherwise req.user is undefined
export const optionalAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            return next();
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            
            if (user) {
                req.user = user;
            } else {
                req.user = null;
            }
        } catch (error) {
            // Invalid token, but continue without user
            req.user = null;
        }
        
        next();
    } catch (error) {
        console.error('Optional auth middleware error:', error);
        req.user = null;
        next();
    }
};
