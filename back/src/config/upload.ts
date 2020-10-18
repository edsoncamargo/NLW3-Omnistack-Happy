import multer from 'multer';

import path from 'path';

export default {
    storage: multer.diskStorage({
        destination: path.join(__dirname, '..', '..', 'uploads'),
        filename: (request, file, call) => {
            const name = file.originalname.replace(/ /g, '');
            const fileName = `${Date.now()}-${name}`;
            call(null, fileName);
        },
    })
};