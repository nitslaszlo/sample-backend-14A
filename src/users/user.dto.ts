import { IsOptional, IsString, IsMongoId, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import CreateAddressDto from "./address.dto";
import { Schema } from "mongoose";
import IUser from "./user.interface";
import "reflect-metadata";

export default class CreateUserDto implements IUser {
  // @IsString()
  // public firstName: string;

  // @IsString()
  // public lastName: string;

  @IsMongoId()
  @IsOptional()
  public _id: Schema.Types.ObjectId;

  @IsString()
  public name: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  public address?: CreateAddressDto;
}
