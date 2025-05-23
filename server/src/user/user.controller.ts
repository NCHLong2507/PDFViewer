import { Controller,Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from './DTO/UserDTO';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService){}

  @Post('find-by-email')
  async findUserByEmail(@Body() body: { email: string }) {
    const user = await this.userService.findbyEmail(body.email);
    const userDTO = plainToInstance(UserDTO,user,{excludeExtraneousValues:true});
    return {
      status:"success",
      user: userDTO
    }
  }
}
