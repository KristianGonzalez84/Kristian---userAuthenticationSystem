const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('User is authenticated');
        return next();
    } else {
        console.log('User is not authenticated');
        return res.status(401).send('Unauthorized');
    }
};

module.exports = isAuthenticated;