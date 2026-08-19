import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  createCompany(
    @CurrentUser() user: any,
    @Body('name') name: string,
  ) {
    return this.companiesService.createCompany(user.sub, user.email, user.role, name);
  }

  @Post('join')
  joinCompany(
    @CurrentUser() user: any,
    @Body('companyId') companyId: string,
  ) {
    return this.companiesService.joinCompany(user.sub, user.email, user.role, companyId);
  }
}
