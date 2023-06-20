import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { Users } from './models/user.model';
import { AccessTokenStrategy } from './strategies/access_token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh_token.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, UserRepository, {
    provide: 'UserModel',
    useValue: Users,
  }, AccessTokenStrategy, RefreshTokenStrategy],
  exports:[UserService]
})
export class AuthModule {}
