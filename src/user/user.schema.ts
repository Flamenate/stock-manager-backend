import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password_hash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
