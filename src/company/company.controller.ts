import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('companies')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    const company = this.companyService.findCompanyById(id);
    if (!company) throw new NotFoundException();

    return company;
  }

  @Post()
  async create(@Body() createDto: CreateCompanyDto) {
    return await this.companyService.createCompany(createDto);
  }

  @Get(':companyId/stock')
  async getProducts(
    @Param('companyId') companyId: string,
    @Query('query') encodedQuery: string,
  ) {
    return await this.companyService.searchProducts(
      companyId,
      decodeURI(encodedQuery),
    );
  }

  @Post(':companyId/stock')
  async addProduct(
    @Param('companyId') companyId: string,
    @Body() createDto: CreateProductDto,
  ) {
    return await this.companyService.addProduct(companyId, createDto);
  }

  @Patch(':companyId/stock/:productName')
  async patchProduct(
    @Param('companyId') companyId: string,
    @Param('productName') productName: string,
    @Body() newProductDto: CreateProductDto,
  ) {
    return await this.companyService.editProduct(
      companyId,
      decodeURI(productName),
      newProductDto,
    );
  }

  @Delete(':companyId/stock/:productName')
  async deleteProduct(
    @Param('companyId') companyId: string,
    @Param('productName') productName: string,
  ) {
    return await this.companyService.deleteProduct(
      companyId,
      decodeURI(productName),
    );
  }

  @Post(':companyId/employees')
  async addEmployee(
    @Param('companyId') companyId: string,
    @Body('userEmail') userEmail: string,
  ) {
    return await this.companyService.addEmployee(companyId, userEmail);
  }

  @Delete(':companyId/employees/:employeeId')
  async dismissEmployee(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return await this.companyService.dismissEmployee(companyId, employeeId);
  }
}
