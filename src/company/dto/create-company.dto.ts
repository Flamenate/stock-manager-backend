import { Types } from 'mongoose';

export type CreateCompanyDto = {
  name: string;
  owner_id: string | Types.ObjectId;
};
