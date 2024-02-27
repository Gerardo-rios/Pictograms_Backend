import { Request, Response } from "express";
import Person from "../types/person";
import Respuesta from "../types/response";
import { generateToken } from "../config/auth/auth";
import queryDB from "./database";

async function registerPerson (req: Request, res: Response) {
  const person: Person = req.body;
  const query = `
    INSERT INTO persona 
        (name, last_name, dni, email, password, external_id) 
    VALUES 
        (?, ?, ?, ?, ?, ?)
    `;

  const external_id = Math.random().toString(36).substring(2);

  const values = [
    person.nombres,
    person.apellidos,
    person.dni,
    person.correo,
    person.clave,
    external_id,
  ];

  await queryDB(query, values);

  const respuesta: Respuesta = {
    status: 201,
    msj: "Usuario creado exitosamente",
    datos: person,
  };

  res.status(201).json(respuesta);
}

async function loginPerson (req: Request, res: Response) {
  const { correo, clave } = req.body;

  const query = `
        SELECT * FROM persona WHERE email = ? AND password = ?
    `;

  const values = [correo, clave];

  const dbResult = await queryDB(query, values);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((dbResult as any).length === 0) {
    res.status(404).json({
      status: 401,
      msj: "Usuario no encontrado o credenciales incorrectas",
    });
    return;
  }

  const token = generateToken({ correo, clave });

  res.status(200).json({
    status: 200,
    msj: "Usuario logueado exitosamente",
    token: token,
  });
}

async function getPersonById (req: Request, res: Response) {
  const id = req.params.id;
  const query = `
    SELECT * FROM persona WHERE external_id = ?
  `;
  const values = [id];
  const dbResult = await queryDB(query, values);
  res.status(200).json({
    status: 200,
    msj: "Usuario encontrado",
    datos: dbResult,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updatePerson (req: any, res: Response) {
  if (!req.file) {
    return res.status(400).json({
      status: 400,
      msj: "No se ha enviado un archivo",
    });
  }

  if (req.fileValidationError) {
    return res.status(400).json({
      status: 400,
      msj: req.fileValidationError,
    });
  }

  const { nombres, apellidos, correo, clave, external_id } = req.body;

  const person: Person = {
    nombres,
    apellidos,
    correo,
    clave,
    external_id,
    foto: req.file.filename,
  };

  const query = `
    UPDATE persona 
    SET name = ?, last_name = ?, email = ?, password = ?, photo = ?
    WHERE external_id = ?
  `;

  const values = [
    person.nombres,
    person.apellidos,
    person.correo,
    person.clave,
    person.foto,
    person.external_id,
  ];

  const dbResponse = await queryDB(query, values);

  res.status(200).json({
    status: 200,
    msj: "Usuario actualizado exitosamente",
    datos: dbResponse,
  });
}

async function deletePerson (req: Request, res: Response) {
  const id = req.params.id;
  const query = `
    DELETE FROM persona WHERE external_id = ?
  `;
  const values = [id];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbResult: any = await queryDB(query, values);

  if (dbResult.affectedRows === 0) {
    res.status(404).json({
      status: 404,
      msj: "Usuario no encontrado",
    });
    return;
  }

  res.status(200).json({
    status: 200,
    msj: "Usuario eliminado correctamente",
    datos: [],
  });
}

async function getPersons (req: Request, res: Response) {
  const query = `
    SELECT name, last_name, type, email, external_id, dni, photo FROM persona
  `;
  const dbResult = await queryDB(query, []);
  res.status(200).json({
    status: 200,
    msj: "Usuarios encontrados",
    datos: dbResult,
  });
}

export {
  registerPerson,
  loginPerson,
  getPersonById,
  updatePerson,
  deletePerson,
  getPersons,
};
