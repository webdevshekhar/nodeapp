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
            return res.status(400).json({ result: 0, msg: 'Validation failed', errors });
        }

        const user = await service.admin.register(name, email, password);
        res.status(201).json({ msg: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ result: 0, msg: 'All fields are required' });

        const data = await service.admin.login(email, password);
        if (data.result == -1) {
            return res.status(400).json({ msg: data?.msg });
        }
        return res.status(200).json({ msg: 'Login successful', data });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ msg: 'Refresh token is required' });
    }
    try {
        const accessToken = await service.admin.getRefreshToken(refreshToken);
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(403).json({ msg: 'Invalid or expired refresh token' });
    }
};
