import * as fs from 'fs';
import * as path from 'path';

const directoryPath = 'images';

const deleteFile = async (fileNameWithoutExtension: string) => {

  const allowedExtensions = new Set(['.jpg', '.jpeg', '.png']);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error al leer el directorio:', err);
      return;
    }

    const filesToDelete = files.filter(file => {
      const { name, ext } = path.parse(file);
      return name === fileNameWithoutExtension && allowedExtensions.has(ext);
    });

    filesToDelete.forEach(file => {
      fs.unlink(path.join(directoryPath, file), err => {
        if (err) {
          console.error('Error al eliminar el archivo:', err);
        } else {
          console.log(`Archivo eliminado con éxito: ${file}`);
        }
      });
    });
  });


};

export default deleteFile;