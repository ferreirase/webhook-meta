import { Prop } from '@nestjs/mongoose';
import { IsString, IsNotEmpty } from 'class-validator';

export type UpdateUserResponse = {
  _id: string;
  name: string;
  email: string;
  refresh_token?: string;
};

export default class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name?: string;

  @IsNotEmpty()
  @IsString()
  readonly email?: string;

  @IsNotEmpty()
  @IsString()
  readonly password?: string;

  @IsNotEmpty()
  @IsString()
  readonly phone?: string;

  @IsNotEmpty()
  @IsString()
  readonly organization?: string;

  @IsNotEmpty()
  @IsString()
  readonly sector?: string;

  @Prop({ type: String, default: null })
  @IsNotEmpty()
  refresh_token?: string;

  constructor(user?: Partial<UpdateUserDto>) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.phone = user.phone;
    this.sector = user.sector;
    this.refresh_token = user.refresh_token;
  }
}
