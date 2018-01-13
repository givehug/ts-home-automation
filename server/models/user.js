const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 4,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email',
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
	},
	admin: {
		type: Boolean,
	},
	macs: [{type: String}], // associated mac addresses
	tokens: [{
		access: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
	}],
});

UserSchema.methods.generateAuthToken = async function() {
	const user = this;
	const access = 'auth';
	const token = jwt.sign({
		_id: user._id.toHexString(),
		access,
	}, process.env.JWT_SECRET).toString();

	user.tokens.push({
		access,
		token,
	});

	try {
		await user.save();

		return token;
	} catch (error) {
		console.error('Error generating auth token');
	}
};

UserSchema.methods.removeToken = function(token) {
	const user = this;

	return user.update({$pull: {tokens: {token}}});
};

UserSchema.statics.findByToken = function(token) {
	const User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth',
	});
};

UserSchema.statics.findByCredential = async function(email, password) {
	const User = this;

	try {
		const user = await User.findOne({email});

		if (!user) {
			return Promise.reject();
		}

		await checkPassword(password, user.password);

		return Promise.resolve(user);
	} catch (error) {
		return Promise.reject(error);
	}
};

async function checkPassword(potentialPass, realPass) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(potentialPass, realPass, (err, result) => {
			if (err || !result) {
				reject();
			} else {
				resolve();
			}
		});
	});
}

UserSchema.pre('save', function(next) {
	const user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = {
	User,
	checkPassword,
};
