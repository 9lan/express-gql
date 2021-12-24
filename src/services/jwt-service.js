import jwt from "jsonwebtoken";

const getPayload = (token) => {
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET, {
			ignoreExpiration: true,
		})
		delete payload.iat;
		delete payload.exp;

		return [payload, null];
	} catch (e) {
		return [null, { message: e.message }];
	}
};

const verifyPayload = (token) => {
	const payload = jwt.verify(token, process.env.JWT_SECRET, {
		ignoreExpiration: true,
	})

	return payload;
};

const signPayload = (payload, expiresIn) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

	return token;
};

export const jwtService = { getPayload, verifyPayload, signPayload };
