import express from "express";
import { Request, Response } from "express";
import morgan from "morgan";
import { verifyToken } from "../auth/auth";
import routerPerson from "../../routes/person";
import routerPictograma from "../../routes/pictograma";
import path from "path";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('', express.static(path.resolve('images')));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world with Typescript and Express!");
});

app.get("/ruta-protegida", verifyToken, (req: Request, res: Response) => {
  res.send("Acceso concedido a la ruta protegida, información del usuario: ");
});

app.use("", routerPerson);
app.use("", routerPictograma);

export default app;
