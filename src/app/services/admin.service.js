const model = require('../models/index.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (name, email, password) => {
    const existingUser = await model.admin.findOne({ email });
    if (existingUser) throw new Error('User already exists with this email!');
    const user = await model.admin.create({ name, email, password });
    return user;
};

exports.login = async (email, password) => {
    const user = await model.admin.findOne({ email });
    if (!user) return { result: -1, msg: 'Invalid email or password' };
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { result: -1, msg: 'Invalid email or password' };

    const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return {
        ...user._doc,
        accessToken,
        refreshToken
    };
};

exports.getRefreshToken = async (refreshToken) => {
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await model.admin.findById(decodedToken.id);
    if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
    return accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};
