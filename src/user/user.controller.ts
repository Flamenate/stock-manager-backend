import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { CompanyService } from 'src/company/company.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private companyService: CompanyService,
  ) {}

  @Get()
  async findUsersById(@Query('ids') encodedIds: string) {
    return this.userService.findManyByIds(
      JSON.parse(decodeURI(encodedIds))['ids'],
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = this.userService.findById(id);
    if (!user) throw new NotFoundException();

    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id/companies')
  async getUserCompanies(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException();

    return this.companyService.findUserCompanies(id);
  }
}
