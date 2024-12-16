import { Blob } from "buffer";
import path from "path";
import * as fs from "fs/promises";

class FileService {
	private readonly root

	constructor() {
		if (process.env.UPLOAD_DIR) this.root = process.env.UPLOAD_DIR
		else throw Error('No file upload directory is specified')
	}

	save = async (bucket: string, blob: Blob, filename: string = crypto.randomUUID()): Promise<string> => {
		try {
			await fs.mkdir(path.join(this.root, bucket), { recursive: true })
		} catch (err: any) {
			if (err.code !== 'EEXIST') throw err;
		}
		const ref = `${bucket}/${filename}`
		const filePath = path.join(this.root, ref);
		await fs.writeFile(filePath, Buffer.from(await blob.arrayBuffer()));
		return ref
	}

	replace = async (fileRef: string, blob: Blob) => {
		const filePath = path.join(this.root, fileRef);
		await fs.writeFile(filePath, Buffer.from(await blob.arrayBuffer()));
	}

	delete = async (fileRef: string) => {
		const filePath = path.join(this.root, fileRef);
		await fs.rm(filePath);
	}

	get = async (fileRef: string) => {
		const filePath = path.join(this.root, fileRef);
		return await fs.readFile(filePath);
	}
}

let fileService: FileService;

if (process.env.NODE_ENV === 'production') fileService = new FileService();
else {
	if (!global.fileService) global.fileService = new FileService();
	fileService = global.fileService;
}
export default fileService;
