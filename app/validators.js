module.exports = {
	validateEmail: (email) => {
		const re =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		return re.test(email);
	},

	validatePassword: (password) => {
		if (password.length <= 5) return false;
		return true;
	},
};
