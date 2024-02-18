import { Request, Response } from 'express';
import  Person  from '../types/person';
import Respuesta  from '../types/response';
import { generateToken } from '../config/auth/auth';
import queryDB from './database';

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
    external_id];

  await queryDB(query, values);

  const respuesta: Respuesta = {
    status: 201,
    msj: "Usuario creado exitosamente",
    datos: person
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
      msj: "Usuario no encontrado o credenciales incorrectas"
    });
    return;
  }
  
  const token = generateToken({ correo, clave });

  res.status(200).json({
    status: 200,
    msj: "Usuario logueado exitosamente",
    token: token
  });

}

export { registerPerson, loginPerson };