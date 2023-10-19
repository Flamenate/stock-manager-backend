import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Company, CompanyDocument, Product } from './company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';

export interface PartialCompany {
  _id: string;
  owner: string;
  employee_count: string;
}

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    private userService: UserService,
  ) {}

  async findUserCompanies(userId: string): Promise<PartialCompany[]> {
    return await this.companyModel.find(
      {
        $or: [
          { owner: new Types.ObjectId(userId) },
          { employees: new Types.ObjectId(userId) },
        ],
      },
      { name: 1, owner: 1, employee_count: { $size: '$employees' } },
    );
  }

  async findCompanyById(id: string | Types.ObjectId): Promise<Company> {
    return await this.companyModel.findById(id);
  }

  async createCompany(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyDocument> {
    const createdCompany = new this.companyModel({
      name: createCompanyDto.name,
      employees: [],
      owner: createCompanyDto.owner_id,
      stock: [],
    }).save();
    return createdCompany;
  }

  async addProduct(
    companyId: string,
    createProductDto: CreateProductDto,
  ): Promise<Product[]> {
    const company = await this.companyModel.findById(companyId);

    if (!company) throw new NotFoundException('Company not found.');
    if (
      company.stock.find(
        (product: Product) => product.name == createProductDto.name,
      )
    )
      throw new BadRequestException('Product already exists.');

    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      companyId,
      { $addToSet: { stock: createProductDto } },
      { new: true },
    );
    return updatedCompany.stock;
  }

  async editProduct(
    companyId: string,
    productName: string,
    newProduct: CreateProductDto,
  ): Promise<Product[]> {
    const company = await this.companyModel.findById(companyId);
    if (!company) throw new NotFoundException('Company not found.');

    await this.companyModel.updateOne(
      { _id: companyId },
      { $pull: { stock: { name: productName } } },
    );
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      companyId,
      { $addToSet: { stock: newProduct } },
      { new: true },
    );
    return updatedCompany.stock;
  }

  async deleteProduct(companyId: string, name: string): Promise<Product[]> {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      companyId,
      { $pull: { stock: { name } } },
      { new: true },
    );
    return updatedCompany.stock;
  }

  async addEmployee(companyId: string, userEmail: string): Promise<User[]> {
    const company = await this.companyModel.findById(companyId);
    if (!company) throw new NotFoundException('Company not found.');

    const user = await this.userService.findByEmail(userEmail);
    if (!user) throw new NotFoundException('User not found.');

    if (
      company.employees.includes(user._id) ||
      user._id.toString() == company.owner.toString()
    )
      throw new BadRequestException('User is already an employee.');

    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      companyId,
      { $push: { employees: user._id } },
      { new: true },
    );
    const employees = await this.userService.findManyByIds(
      updatedCompany.employees,
    );
    return employees;
  }

  async dismissEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<User[]> {
    const company = await this.companyModel.findById(companyId);
    if (!company) throw new NotFoundException('Company not found.');

    if (!company.employees.find((id) => id.toString() == employeeId))
      throw new BadRequestException('That user does not work at this company.');

    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      companyId,
      { $pull: { employees: employeeId } },
      { new: true },
    );
    const employees = await this.userService.findManyByIds(
      updatedCompany.employees,
    );
    return employees;
  }

  async searchProducts(companyId: string, query: string): Promise<Product[]> {
    const company = await this.companyModel.findById(companyId);
    if (!company) throw new NotFoundException('Company not found.');

    const pattern = new RegExp(`.*${query}.*`, 'gi');
    return company.stock.filter((product: Product) =>
      product.name.match(pattern),
    );
  }
}
