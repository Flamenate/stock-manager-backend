import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalService } from './rental/rental.service';
import { RentalController } from './rental/rental.controller';

@Module({
  imports: [AuthModule, UserModule, CompanyModule, MongooseModule.forRoot()],
  controllers: [AppController, RentalController],
  providers: [RentalService],
})
export class AppModule {}
