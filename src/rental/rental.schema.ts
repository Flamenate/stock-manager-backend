import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Company } from 'src/company/company.schema';
import { User } from 'src/user/user.schema';

export type RentalDocument = mongoose.HydratedDocument<Rental>;

@Schema()
export class Rental {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  company: Company;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  issuer: User;
}

export const RentalSchema = SchemaFactory.createForClass(Rental);
