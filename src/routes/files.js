import express from 'express';
import multer from 'multer';
import { extname, resolve } from 'path';
import csvtojson from 'csvtojson';

const router = new express.Router();

const storage = multer.diskStorage({
  destination: resolve(__dirname, '..', '..', 'uploads'),
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post('/files', upload.single('data'), async (req, res) => {
  const csvPath = req.file.path;
  const jsonArray = await csvtojson({ delimiter: ';' }).fromFile(csvPath);

  return res.send(jsonArray);
});

export default router;
