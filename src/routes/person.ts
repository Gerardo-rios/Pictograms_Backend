import { Router } from "express";
import {
  registerPerson,
  loginPerson,
  getPersonById,
  deletePerson,
  getPersons,
  updatePerson,
} from "../controllers/person";
import { verifyToken } from "../config/auth/auth";
import uploadMiddleware from "../config/fileStorage/multer";

const routerPerson = Router();

routerPerson.post("/persona/usuario/save", registerPerson);

routerPerson.post("/inicio_sesion", loginPerson);

routerPerson.get("/persona/buscar/:id", verifyToken, getPersonById);

routerPerson.get("/persona/borrar/:id", verifyToken, deletePerson);

routerPerson.get("/personas", getPersons);

routerPerson.put(
  "/persona/actualizar",
  uploadMiddleware,
  verifyToken,
  updatePerson
);

export default routerPerson;
