import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ErrorHandleService } from 'src/common/exception/exception.controller';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserService {
  //private readonly logger = new Logger('UserService');
  constructor(
    private readonly errorHandler: ErrorHandleService,
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
      this.errorHandler.errorHandleException(error);
    }
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

    if (updateUserDto.name) {
      updateUserDto.name = updateUserDto.name.toLocaleLowerCase();
    }

    if (updateUserDto.lastname) {
      updateUserDto.lastname = updateUserDto.lastname.toLocaleLowerCase();
    }

    try {
      user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
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
