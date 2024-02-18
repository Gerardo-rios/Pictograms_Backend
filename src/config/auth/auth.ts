import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      status: 403,
      msj: "Se requiere un token para autenticación."
    }); 
  }

  try {
    jwt.verify(token as string, SECRET_KEY as jwt.Secret);
    next();
  } catch (error) {
    return res.status(401).send(
      {
        status: 401,
        msj: "Token inválido o expirado."
      }
    );
  }
};

const generateToken = (user: { correo: string; clave: string }) => {
  return jwt.sign(user , SECRET_KEY as jwt.Secret, {
    expiresIn: "1h",
  });
};

export { verifyToken, generateToken };
