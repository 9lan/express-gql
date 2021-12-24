require('events').EventEmitter.prototype._maxListeners = 100
require('dotenv').config()

import http from 'http'
import express from 'express'
import {
	ApolloError,
	ApolloServer,
	AuthenticationError,
	makeExecutableSchema
} from 'apollo-server-express'
import mongoose from 'mongoose'

import { schema as typeDefs, resolvers } from './graphql'
// import { jwtService } from "./services/jwt-service";
// import { JwtPayload } from "jsonwebtoken";
// import { AppError } from "./definitions/common";

import app from './instances/express'
// import { sequelizeCumagini, sequelizeTesting } from './instances/sequelize'

/*=============================================
=            ROUTES                           =
=============================================*/

app.get("/", function (req, res) {
	res.status(200);
	res.send({ status: 200, message: "WELCOME : " + process.env.APP_NAME });
});

// const authenticatedUser = (token) => {
//   try {
//     const usesrSession = jwtService.verifyPayload(token);
//     return [usesrSession, null];
//   } catch (e) {
//     return [null, { message: "Your session expired, please Sign in again." }];
//   }
// };

app.use('/assets', express.static('assets'))

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
	resolverValidationOptions: { requireResolversForResolveType: false }
})

const server = new ApolloServer({
	schema,
	// context: async ({ req, connection }) => {
	//   if (connection) return connection.context;

	//   const token = req.headers.authorization;

	//   const context = {
	//     secret: process.env.JWT_SECRET,
	//     token,
	//     userSession: null,
	//     user: null,
	//   };

	//   if (token) {
	//     const [userSession, authErr] = authenticatedUser(token);
	//     if (authErr) throw new AuthenticationError(authErr.message);

	//     const user = await models.UserFarmalab.findOne({
	//       where: { id: userSession.id },
	//     });
	//     if (!user) throw new ApolloError("User Not Found", "USER_NOT_FOUND");

	//     context.userSession = userSession;
	//     context.user = user;
	//   }
	//   return context;
	// },
	// formatError(err) {
	// 	if (err.extensions.code === "INTERNAL_SERVER_ERROR") {
	// 		console.error(JSON.stringify(err));
	// 	}

	// 	return err;
	// },
})

if (process.env.ALLOW_ORIGIN) {
	server.applyMiddleware({
		app,
		cors: { origin: process.env.ALLOW_ORIGIN.split(";") },
		path: "/graphql",
	});
} else {
	server.applyMiddleware({ app, path: "/graphql" });
}

// sequelizeTesting
// 	.authenticate()
// 	.then(() => {
// 		console.log('Connection has been established successfully.');
// 	})
// 	.catch(err => {
// 		console.error('Unable to connect to the database:', err);
// 	});

const httpServer = http.createServer(app);

httpServer.listen({ port: process.env.PORT }, async () => {
	mongoose.connect(process.env.MONGODB_CUMAGINI_HOST,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
		.then(() => {
			console.log("\n\n🚀  Server ready at http://localhost:" + process.env.PORT);
			console.log(
				"🚀  GraphQL ready at http://localhost:" + process.env.PORT + "/graphql"
			);
		})
		.catch(err => console.log(err))
});
