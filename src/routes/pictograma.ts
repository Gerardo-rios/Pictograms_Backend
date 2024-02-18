import { Router, Request } from "express";
import { 
    registerPictograma, 
    getAllPictogramas, 
    getPictogramaById, 
    modifyPictograma 
} from "../controllers/pictograma";
import multer from "multer";
import path from "path";
import { verifyToken } from "../config/auth/auth";

const routerPictograma = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (req.body.external_id) {
        cb(null, `${req.body.external_id}${fileExtension}`);
        return;
    } else {
        req.body.external_id = Math.random().toString(36).substring(2);
        cb(null, `${req.body.external_id}${fileExtension}`);
    }
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
    req.fileValidationError = "Tipo no permitido solo se acepta jpeg o png";
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single("archivo");

function uploadMiddleware(req: any, res: any, next: any){
    upload(req, res, function (err: any) {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({
                    status: 400,
                    msj: "Se esperaba un archivo de imagen"
                });
            }
            return res.status(500).json({
                status: 500,
                msj: "Verifique el archivo a subir"
            });
        } else if (err) {
            return res.status(500).json({
                status: 500,
                msj: "Error al subir el archivo"
            });
        }
        next();
    });
}

routerPictograma.post(
  "/pictograma/save",
  uploadMiddleware,
  registerPictograma
);


routerPictograma.get(
    "/pictogramas", 
    verifyToken, 
    async (req, res) =>{
        await getAllPictogramas(req, res);
    }
);

routerPictograma.get(
    "/pictograma/:id",
    verifyToken,
    async (req, res) => {
        await getPictogramaById(req, res);
    }
);

routerPictograma.put(
    "/pictogramas/update",
    uploadMiddleware,
    modifyPictograma,
);

export default routerPictograma;
