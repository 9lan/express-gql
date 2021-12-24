import express from 'express'
import cors from 'cors'

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '3mb' }))

if (process.env.ALLOW_ORIGIN) {
	app.use(cors({ origin: process.env.ALLOW_ORIGIN.split(";") }));
} else {
	app.use(cors());
}

export default app;
