import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { Category } from "../schema/book.schema"
import { User } from "src/auth/schemas/user.schema"


export class UpdateBookDto {
    @IsOptional()
    @IsString()
    readonly title : string

    @IsOptional()
    @IsString()
    readonly description : string

    @IsOptional()
    @IsNumber()
    readonly price : number

    @IsOptional()
    @IsEnum(Category, {message : 'Please enter correct category'})
    readonly category : Category

    @IsOptional()
    @IsString()
    readonly author : string

    @IsEmpty({ message : 'You are not allowed to set user'})
    readonly user : User
}