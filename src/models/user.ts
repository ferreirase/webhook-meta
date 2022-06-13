import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  organization: string;
  sector: string;
}

@Schema()
export default class User {
  @Prop({ type: Types.ObjectId })
  @IsNotEmpty()
  @ApiProperty()
  _id: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  organization: string;

  @Prop()
  @IsNotEmpty()
  @ApiProperty()
  sector: string;

  @Prop({ type: String, default: null })
  @IsNotEmpty()
  @ApiProperty()
  refresh_token?: string;

  constructor(user?: Partial<User>) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.phone = user.phone;
    this.sector = user.sector;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
