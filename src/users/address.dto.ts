import { IsString, MinLength, MaxLength } from "class-validator";
import IAddress from "./address.interface";

export default class CreateAddressDto implements IAddress {
  @IsString()
  public street: string;
  @IsString()
  @MinLength(2, {
    message: 'A településnév legalább 2 karakter, a $value ennek nem felel meg!',
  })
  @MaxLength(20, {
    message: 'A településnév maximum 20 karakter, a $value ennek nem felel meg!',
  })
  public city: string;
  @IsString()
  public country: string;
}
