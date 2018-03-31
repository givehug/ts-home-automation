import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as validator from 'validator';
import config from '../../../config';
import mongoose from '../db/mongoose';

const UserSchema = new mongoose.Schema({
	admin: {
		type: Boolean,
	},
	email: {
		minlength: 1,
		required: true,
		trim: true,
		type: String,
		unique: true,
		validate: {
			message: '{VALUE} is not a valid email',
			validator: validator.isEmail,
		},
	},
	name: {
		minlength: 4,
		required: true,
		trim: true,
		type: String,
	},
	password: {
		minlength: 8,
		required: true,
		type: String,
	},
	tokens: [{
		access: {
			required: true,
			type: String,
		},
		token: {
			required: true,
			type: String,
		},
	}],
});

UserSchema.methods.generateAuthToken = async function() {
	const user = this;
	const access = 'auth';
	const token = jwt.sign({
		_id: user._id.toHexString(),
		access,
	}, config.JWT_SECRET).toString();

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
	this.tokens = this.tokens.filter(t => t.token !== token);
	this.save();
};

UserSchema.statics.findByToken = function(token) {
	const User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, config.JWT_SECRET);
	} catch (e) {
		return Promise.reject(e);
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.access': 'auth',
		'tokens.token': token,
	});
};

UserSchema.statics.findByCredential = async function(email, password) {
	const User = this;

	try {
		const user = await User.findOne({email});

		if (!user) {
			return Promise.reject(null);
		}

		await checkPassword(password, user.password);

		return Promise.resolve(user);
	} catch (error) {
		return Promise.reject(error);
	}
};

export async function checkPassword(potentialPass, realPass) {
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

export const User = mongoose.model('User', UserSchema);
