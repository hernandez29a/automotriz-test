import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose/dist';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    index: true,
  })
  name: string;

  @Prop({
    index: true,
    required: true,
  })
  lastname: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: 'no-hay direccion',
  })
  address: string;

  @Prop({
    default: 'no-posee-imagen',
  })
  img: string;

  @Prop({
    default: 'USER_ROLE',
  })
  rol: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.method('toJSON', function () {
  const { __v, _id, password, ...user } = this.toObject();

  //user.uid = _id;
  return user;
});
