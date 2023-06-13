import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ErrorHandleService } from 'src/common/exception/exception.controller';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/user/interfaces/jwt-interface.payload';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  //private readonly logger = new Logger('UserService');
  constructor(
    private readonly errorHandler: ErrorHandleService,
    // ? Patron Repositorio
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({
      email: email,
    });

    //console.log(user);
    if (!user) {
      throw new NotFoundException(`Credential not valids email`);
    }
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Credential not valids password`);
    // ? retornar el JWT
    return { user, token: this.getJwtToken({ id: user.id }) };
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...restoData } = createUserDto;
    restoData.name = restoData.name.toLocaleLowerCase();
    restoData.lastname = restoData.lastname.toLocaleLowerCase();
    try {
      const user = await this.userModel.create({
        ...restoData,
        password: bcrypt.hashSync(password, 10),
      });
      // validar y quitar
      /*const data = {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        addres: user.address,
        img: user.img,
        rol: user.rol,
      };*/

      // ? retornar el jwt de acceso
      return {
        user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 1 } = paginationDto;
    const pagination = (offset - 1) * limit;
    const [total, users] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.find().limit(limit).skip(pagination).select('-__v'),
    ]);
    const totalpages = Math.ceil((total * 1) / limit);
    const paginating = {
      before: offset - 1,
      current: offset,
      after: offset + 1,
      total,
      totalpages,
    };
    return { users, paginating };
    //return this.userModel.find();
  }

  async findOne(term: string) {
    let user: User;
    if (!user) {
      throw new NotFoundException(
        `User with id, name: ${term} it's not in the bd`,
      );
    }

    return user;
    //return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user: User;
    let pass = String;

    const { password, ...restoData } = updateUserDto;

    if (restoData.name) {
      updateUserDto.name = updateUserDto.name.toLocaleLowerCase();
    }

    if (restoData.lastname) {
      updateUserDto.lastname = updateUserDto.lastname.toLocaleLowerCase();
    }

    // ? validar que la contraseña enviada es diferente a la que esta en la bd y actualizarla
    if (password) {
      pass = bcrypt.hashSync(password, 10);
      //console.log(pass);
    }

    const data = {
      password: pass,
      ...restoData,
    };

    try {
      user = await this.userModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      return user;
    } catch (error) {
      this.errorHandler.errorHandleException(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`user id: ${id} not found`);
    }
    return 'user deleted successfully';
  }

  // ? Pintar un error
  /*private handleDBException(error: any) {
    console.log(error);
    //console.log(error.index, error.code, error.keyPattern);
    if (error.code === '11000') {
      throw new BadRequestException(
        `user created ${JSON.stringify(error.keyPattern)}`,
      );
    }
    //this.logger.error(error);
    throw new BadRequestException(
      `user created ${JSON.stringify(error.keyValue)}`,
    );
  }*/
}
