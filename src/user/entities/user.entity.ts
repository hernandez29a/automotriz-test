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
    select: false,
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
}

export const UserSchema = SchemaFactory.createForClass(User);
