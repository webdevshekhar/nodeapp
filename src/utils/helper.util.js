module.exports = {
    validateParams: (params, rules) => {
        const errors = {};
        Object.keys(rules).forEach((field) => {
            const value = params[field];
            const fieldRules = rules[field];
            if (fieldRules.required && (value === undefined || value === null || value === '')) {
                errors[field] = `${field} is required`;
                return;
            }
            if (fieldRules.type && typeof value !== fieldRules.type) {
                errors[field] = `${field} must be of type ${fieldRules.type}`;
                return;
            }
            if (fieldRules.minLength && value.length < fieldRules.minLength) {
                errors[field] = `${field} must be at least ${fieldRules.minLength} characters long`;
                return;
            }
            if (fieldRules.regex && !fieldRules.regex.test(value)) {
                errors[field] = `${field} is invalid`;
                return;
            }
        });
        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    }
};
