import User from "../../models/user"
import { jwtService } from "../../services/jwt-service"
import { passwordService } from "../../services/password-service"
import { ApolloError } from 'apollo-server'

export const login = async (_, { input }) => {
	const { email, password } = input
	try {
		const user = await User.findOne({ email })

		if (!user) throw new Error(`User with email ${email} is not found`)

		if (!(await passwordService.compare(user.password, password))) {
			throw new Error("Wrong password!")
		}

		const token = jwtService.signPayload(
			{ id: user.id, email: user.email },
			process.env.TOKEN_EXPIRATION_ENDUSER
		)

		return {
			__typename: "LoginOK",
			user: {
				...user.toObject({ getters: true }),
			},
			token,
		}

	} catch (err) {
		return {
			__typename: "Error",
			err: err.message,
		};
	}
}

export const signUpUser = async (_, { input }) => {
	const { email, password } = input

	const checkUser = await User.findOne({ email })

	let user;

	if (checkUser) {
		const error = new ApolloError('This email has already been registered')
		return error
	} else {
		const newUser = new User({
			...input,
			password: await passwordService.toHash(password),
			email: email.toLowerCase(),
		})
		user = newUser
		await user.save()
	}

	return {
		__typename: "RegisterOK",
		user: user.toObject({ getters: true }),
	};
}

export default {
	Query: {
		login,
	},
	Mutation: {
		signUpUser,
	}
}