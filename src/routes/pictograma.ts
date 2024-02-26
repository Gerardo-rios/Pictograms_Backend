import { Router, Request } from "express";
import { 
    registerPictograma, 
    getAllPictogramas, 
    getPictogramaById, 
    modifyPictograma 
} from "../controllers/pictograma";
import { verifyToken } from "../config/auth/auth";
import uploadMiddleware from "../config/fileStorage/multer";

const routerPictograma = Router();

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
