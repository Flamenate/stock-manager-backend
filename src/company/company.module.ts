import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './company.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    UserModule,
  ],
  providers: [CompanyService],
  exports: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
