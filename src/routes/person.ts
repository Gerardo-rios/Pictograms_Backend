import { Router } from "express";
import { registerPerson, loginPerson } from "../controllers/person";

const routerPerson = Router();

routerPerson.post("/persona/usuario/save", registerPerson);

routerPerson.post("/inicio_sesion", loginPerson);

export default routerPerson;