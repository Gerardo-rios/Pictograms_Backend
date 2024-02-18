import { Response } from 'express';
import Pictograma from '../types/pictograma';
import Respuesta from '../types/response';
import queryDB from './database';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function registerPictograma (req: any, res: Response) {
    
  if (!req.file) {
    return res.status(400).json({
      status: 400,
      msj: "No se ha enviado un archivo"
    });
  }

  if (req.fileValidationError) {
    return res.status(400).json({
      status: 400,
      msj: req.fileValidationError
    });
  }
  
  const { nombre, descripcion, external_id } = req.body;

  const pictograma: Pictograma = {
    nombre,
    descripcion,
    external_id,
    archivo: req.file.filename
  };

  const query = `
        INSERT INTO pictograma 
            (name, description, image_url, external_id) 
        VALUES 
            (?, ?, ?, ?)
        `;

  const values = [
    pictograma.nombre, 
    pictograma.descripcion, 
    pictograma.archivo, 
    pictograma.external_id
  ];
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbResult: any = await queryDB(query, values);

  if (dbResult.affectedRows === 0) {
    return res.status(500).json({
      status: 500,
      msj: "Error al guardar el pictograma en la bd"
    });
  }

  const respuesta: Respuesta = {
    status: 201,
    msj: "Pictograma creado exitosamente",
    datos: pictograma
  };

  res.status(201).json(respuesta);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAllPictogramas (req: any, res: Response) {
  const query = `
            SELECT * FROM pictograma
        `;
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbResult: any = await queryDB(query, []);
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datos = dbResult.map((pictograma: any) => {
    return {
      id: pictograma.id,
      nombre: pictograma.name,
      descripcion: pictograma.description,
      archivo: pictograma.image_url,
      external_id: pictograma.external_id
    };
  });

  const respuesta: Respuesta = {
    status: 200,
    msj: "Pictogramas encontrados",
    datos: datos
  };
    
  res.status(200).json(respuesta);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPictogramaById (req: any, res: any) {
  const query = `
            SELECT * FROM pictograma WHERE external_id = ?
        `;
    
  const values = [req.params.id];
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbResult: any = await queryDB(query, values);
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datos = dbResult.map((pictograma: any) => {
    return {
      id: pictograma.id,
      nombre: pictograma.name,
      descripcion: pictograma.description,
      archivo: pictograma.image_url,
      external_id: pictograma.external_id
    };
  });

  const respuesta: Respuesta = {
    status: 200,
    msj: "Pictograma encontrado",
    datos: datos
  };

  res.status(200).json(respuesta);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function modifyPictograma (req: any, res: Response) {

  if (!req.file) {
    return res.status(400).json({
      status: 400,
      msj: "No se ha enviado un archivo"
    });
  }
    
  if (req.fileValidationError) {
    return res.status(400).json({
      status: 400,
      msj: req.fileValidationError
    });
  }

  const { nombre, descripcion, external_id } = req.body;

  const query = `
            UPDATE pictograma 
            SET name = ?, description = ?, image_url = ?, external_id = ?
            WHERE external_id = ?
        `;

  const values = [
    nombre, 
    descripcion, 
    req.file.filename,
    external_id[0], 
    external_id[1]
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbResult: any = await queryDB(query, values);

  if (dbResult.affectedRows === 0) {
    return res.status(500).json({
      status: 500,
      msj: "Error al modificar el pictograma en la bd"
    });
  }

  const respuesta: Respuesta = {
    status: 200,
    msj: "Pictograma modificado exitosamente",
    datos: {
      nombre,
      descripcion,
      archivo: req.file.filename,
    }
  };

  res.status(200).json(respuesta);

}


export { registerPictograma, getAllPictogramas, getPictogramaById, modifyPictograma };