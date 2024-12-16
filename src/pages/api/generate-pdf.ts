import {NextApiRequest, NextApiResponse} from "next";
import {readFileSync, writeFileSync} from "fs";
import path from "path";
import createReport from "docx-templates";
import qr from 'qr-image'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const template = readFileSync(
        path.resolve('C:\\Users\\Amine\\Desktop\\coupon-template.docx')
    );

    const data = {
        firstName: 'Amine',
        lastName: 'Lias'
    }

    const buffer = await createReport({
        template,
        data,
        cmdDelimiter: ['{', '}'],
        additionalJsContext: {
            qrCode: () => {
                const qrImage = qr.imageSync(JSON.stringify(data), {type: 'png', margin: 2, size: 4});
                return {width: 6, height: 6, data: qrImage, extension: '.png'};
            },
        }
    });

    writeFileSync(path.resolve('C:\\Users\\Amine\\Desktop\\coupon-template-output.docx'), buffer);

    res.json({success: true})
}