// JWT Authentication Middleware

// ye middleware json web token ko verify/required kiya
const jwt = require('jsonwebtoken');
//jsonwebtoken pehele se hi install hota hai with npm i jsonwebtoken

const authMiddleware = async (req, res, next) => {
    try {
        
    
        const authHeader = req.headers.authorization;

        // ye check krega ki token hai ya nhi
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.',
            });
        }
            //agar token nhi mila tho ye error aayega

        
        const token = authHeader.split(' ')[1];

        // Verify krega token with secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to request object...This makes user data available in the next middleware/route handler
        
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        
        next();
    } catch (error) {
        // agar oken nhi mila ya invalid hai to ye error aayega
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token has expired. Please login again.',
            });
        }

        return res.status(401).json({
            success: false,
            error: 'Invalid token. Authentication failed.',
        });
    }
};

module.exports = authMiddleware;
