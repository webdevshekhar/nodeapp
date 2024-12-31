const service = require('../services/index.service');
const utils = require('../../utils/index.util');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const rules = {
            name: { required: true, type: 'string', minLength: 3 },
            email: { required: true, type: 'string', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            password: { required: true, type: 'string', minLength: 6 },
        };

        // Validate request parameters
        const { isValid, errors } = utils.helper.validateParams({ name, email, password }, rules);
        if (!isValid) {
            return res.status(400).json({ msg: 'Validation failed', errors });
        }
        const user = await service.user.registerUser(name, email, password);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

        const data = await service.user.loginUser(email, password);
        res.status(200).json({ message: 'Login successful', data });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }
    try {
        const accessToken = await service.user.getRefreshToken(refreshToken);
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const data = await service.user.getAllUsers();
        res.status(200).json({ msg: 'Users fetched successfully', data });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
