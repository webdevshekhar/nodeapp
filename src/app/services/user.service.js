const model = require('../models/index.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (name, email, password) => {
    const existingUser = await model.user.findOne({ email });
    if (existingUser) throw new Error('User already exists with this email!');
    const user = await model.user.create({ name, email, password });
    return user;
};

exports.loginUser = async (email, password) => {
    const user = await model.user.findOne({ email });
    if (!user) throw new Error('Invalid email or password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

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
    const user = await model.user.findById(decodedToken.id);
    if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
    return accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

exports.getAllUsers = async () => {
    try {
        const users = await model.user.find({}, { refreshToken: 0 }).lean();
        return users;
    } catch (error) {
        throw new Error('Error: ' + error.message);
    }
};
