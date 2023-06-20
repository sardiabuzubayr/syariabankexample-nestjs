import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { CommonData } from 'src/modules/common.data';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import ResponseData from 'src/util/response';
import * as moment from 'moment'
import { getOffset } from 'src/helpers/general_helper';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
     private userRepository:  UserRepository,
     private jwtService: JwtService,
     private configService: ConfigService,
  ) {
  }

  getUsers(keywords:string, filters:[], limit:number, page:number):Promise<CommonData>{
    let offset = getOffset(limit, page)
    let data = this.userRepository.getAll(keywords, filters, limit, offset);
    return data
  }

  async signIn(data: AuthDto) {
    const user = await this.userRepository.getOneByUsername(data.username);
    let response = new ResponseData()

    if (user) {
      const passwordMatches = await bcrypt.compare(data.password, user.password);

      if (!passwordMatches){
        return response.setData(null).setErrorCode("404")
      } else{
        const tokens = await this.getToken(user.user_id, user.username);
        await this.updateRefreshToken(user.user_id, tokens.refresh_token);
        return response.setData(tokens).setErrorCode("0");
      }
    }
    
    return {error_code:400, messages:'Users not found'}
  }

  async getToken(userId: number, username: string) {
    const expiredAt = moment().add(parseInt(process.env.JWT_REFRESH_TOKEN_LIFE), 'days').unix()

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
        },
      ),
    ]);

    return {
      access_token:accessToken,
      refresh_token:refreshToken,
      expired_at:expiredAt
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const salt = await bcrypt.genSalt();

    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    // await this.userRepository.update(userId, {
    //   refreshToken: hashedRefreshToken,
    // });
  }
}
