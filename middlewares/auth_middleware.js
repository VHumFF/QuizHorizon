
function restrictTo(role) {
    return (req, res, next) => {
        const userRole = req.session.user ? req.session.user.role : null;

        if (userRole && userRole === role) {
            // User has the required role, proceed to the next middleware/route
            next();
        } else {
            // User doesn't have the required role, redirect or send an error response
            res.status(403).send('Forbidden');
        }
    };
}

module.exports = restrictTo;