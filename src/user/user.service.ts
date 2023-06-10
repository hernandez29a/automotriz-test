import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(
    // ? Patron Repositorio
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.name = createUserDto.name.toLocaleLowerCase();
    createUserDto.lastname = createUserDto.lastname.toLocaleLowerCase();
    try {
      const user = await this.userModel.create(createUserDto);
      return user;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    updateUserDto.name = updateUserDto.name.toLocaleLowerCase();
    updateUserDto.lastname = updateUserDto.lastname.toLocaleLowerCase();
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // ? Pintar un error
  private handleDBException(error: any) {
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
  }
}
