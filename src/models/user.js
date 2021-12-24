import mongoose from 'mongoose'

const { Schema } = mongoose

const userModel = new Schema({
	email: String,
	password: String,
	name: String,
	phoneNumber: String,
}, { timestamps: true })

export default mongoose.model('User', userModel)