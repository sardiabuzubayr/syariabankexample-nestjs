import { Body, Controller, Get, Param, Post, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthDto } from '../dto/auth.dto';
import { AccessTokenGuard } from 'src/security/access_token.guard';
import { Public } from 'src/util/public.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get("/list_user")
  async listUser(@Query('keywords') keywords:string,  @Query('page') page:number, @Query('limit') limit:number, @Res() res: Response) {
    res.status(200).json({error_code:0, data: await this.userService.getUsers(keywords, [], limit, page)});
  }

  @Public()
  @Post('/auth/signin')
  signin(@Body() data: AuthDto) {
    return this.userService.signIn(data);
  }
}
