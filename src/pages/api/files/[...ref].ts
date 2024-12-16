import { NextApiRequest, NextApiResponse } from 'next'
import fileService from "@/common/services/FileService";
import { fileTypeFromBuffer } from "file-type";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const ref = (req.query['ref'] as string[]).join('/')
	const buffer = await fileService.get(ref)
	res.setHeader('Cache-Control', 'private');
	res.setHeader('Content-Length', buffer.length);
	const fileType = await fileTypeFromBuffer(buffer)
	if (fileType?.mime) {
		res.setHeader('Content-type', fileType.mime);
	}
	res.send(buffer)
}