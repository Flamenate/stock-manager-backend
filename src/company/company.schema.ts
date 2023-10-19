import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CompanyDocument = mongoose.HydratedDocument<Company>;

export type Product = {
  name: string;
  description: string;
  stock_count: string;
  unit_price_euro: number;
  image_url: string;
};

@Schema()
export class Company {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  owner: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    required: true,
  })
  employees: mongoose.Schema.Types.ObjectId[];

  @Prop()
  stock: Product[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
