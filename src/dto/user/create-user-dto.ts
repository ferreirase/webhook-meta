import { Prop } from '@nestjs/mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

export type CreateUserResponse = {
  _id: string;
  name: string;
  email: string;
};

export default class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  readonly organization: string;

  @IsNotEmpty()
  @IsString()
  readonly sector: string;

  @Prop({ type: String, default: null })
  @IsNotEmpty()
  refresh_token?: string;

  constructor(user?: Partial<CreateUserDto>) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.phone = user.phone;
    this.sector = user.sector;
    this.refresh_token = user.refresh_token;
  }
}
