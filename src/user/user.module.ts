import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserController } from './user.controller';
import { CompanyService } from 'src/company/company.service';
import { Company, CompanySchema } from 'src/company/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
  ],
  providers: [UserService, CompanyService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
