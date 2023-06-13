import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from './decorators';
import { ValidRoles } from './interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post()
  @Auth(ValidRoles.ADMIN_ROLE, ValidRoles.USER_ROLE)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /*@Get('private3')
  @Auth(ValidRoles.ADMIN_ROLE, ValidRoles.USER_ROLE)
  testinPrivateRoute3(@GetUser() user: User) {
    //console.log(user);
    return {
      ok: true,
      msg: 'Hola Mundo Private 3',
      user,
    };
  }*/

  @Get()
  @Auth(ValidRoles.ADMIN_ROLE, ValidRoles.USER_ROLE)
  findAll(@Query() paginatioDTO: PaginationDto) {
    return this.userService.findAll(paginatioDTO);
  }

  @Get(':id')
  @Auth(ValidRoles.ADMIN_ROLE)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN_ROLE)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN_ROLE)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
