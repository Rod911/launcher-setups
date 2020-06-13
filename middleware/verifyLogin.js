const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('auth-token');
    
    if (!token) return res.status(401).json({ success: false, error: 'Not Logged In' });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(400).json({ success: false, error: 'Invalid Token' });
    }
}