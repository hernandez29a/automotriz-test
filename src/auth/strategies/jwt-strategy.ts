import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-interface.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // ? Patron Repositorio
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.userModel.findOne({
      email: email,
    });

    if (!user) throw new UnauthorizedException(`Token not valid`);
    //console.log({ user });
    return user;
  }
}
