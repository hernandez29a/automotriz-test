import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync } from 'fs';
import { Model } from 'mongoose';
import { join } from 'path';
import { ErrorHandleService } from 'src/common/exception/exception.controller';
import { User } from 'src/user/entities/user.entity';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(
    private readonly errorHandler: ErrorHandleService,
    // ? Patron Repositorio
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  getStaticFile(imageName: string) {
    const path = join(__dirname, '../../static/users', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException(`No user found with image: ${imageName}`);
    }
    return path;
  }

  //? metodo para salvar inagel de perfil en la bd
  async updateFile(id: string, img: string) {
    // ? Validar que el usuario exista en la bd
    let user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`usuario con el id: ${id} no estan en la bd`);
    }

    if (user.img) {
      const pathImage = join(__dirname, '../../static/users', user.img);
      //console.log(pathImage);
      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
      }
    }

    // ? validar si el usuario tiene una imagen borrar imagen de la bd y colocar la nueva imagen
    try {
      user.img = img;
      user = await this.userModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      return user;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }
}
