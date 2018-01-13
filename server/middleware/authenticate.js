const {User} = require('./../models/user');

const authenticate = async(req, res, next) => {
	const token = req.header('x-auth');

	try {
		const user = await User.findByToken(token);

		if (!user) {
			return res.sendStatus(401);
		}

		req.user = user;
		req.token = token;

		next();
	} catch (error) {
		res.sendStatus(401);
	}
};

module.exports = {authenticate};
