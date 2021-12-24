import fs from 'fs'
import * as uuid from 'uuid'

export const getBufferFromStream = (stream, maxSize) => {
	const chunks = []
	let totalLength = 0
	return new Promise((resolve, reject) => {
		stream.on('data', (chunk) => {
			chunks.push(chunk);
			totalLength += chunk.length
			if (totalLength > maxSize) {
				stream.destroy();
				reject(`File is too big, maximum filesize is ${maxSize / 1000} kb`)
			}
		})
		stream.on('end', () => {
			const buffer = Buffer.concat(chunks)
			resolve(buffer);
		})
		stream.on('err', (err) => {
			reject(err)
		})
	})
}

export const getFileBase64 = async (filename) => {
	if (!fs.existsSync(filename)) return { __typename: 'NotFound' };

	const file = await fs.promises.readFile(filename);
	const buffer = new Buffer.from(file, 'binary').toString('base64')

	return { __typename: 'Success', buffer };
}

export const createFile = async (folderPath, buffer, ext) => {
	const filename = uuid.v4() + "." + ext;
	const filepath = folderPath + '/' + filename;
	if (fs.existsSync(filepath)) return { __typename: 'Error', message: 'Filename collision! please try one more time.' };

	await fs.promises.writeFile(filepath, buffer);

	return { __typename: 'Success', filepath, filename };
}

export const createFileFromBuffer = async (filepath, buffer) => {
	await fs.promises.writeFile(filepath, buffer);
}

export const createDir = (folderPath) => {
	if (fs.existsSync(folderPath)) {
		return { __typename: 'Error', message: 'Folder already existed!' };
	}

	fs.mkdirSync(folderPath, { recursive: true });

	return { __typename: 'Success' };
}