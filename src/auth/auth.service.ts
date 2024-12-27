import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';  // Changed this line
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto : SignUpDto): Promise<{token : string}> {
        const {name, email, password, role} = signUpDto;

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userModel.create({name, email, password : hashedPassword, role});
        const token = this.jwtService.sign({id: user._id});
        return {token}
    }

    async signIn(signInDto : SignInDto) : Promise<{token : string}> {
        const {email, password} = signInDto;

        const user = await this.userModel.findOne({email});

        if(!user) {
            throw new UnauthorizedException("Invalid email and password");
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if(!isPasswordMatched) {
            throw new UnauthorizedException("Invalid email and password");
        }

        const token = this.jwtService.sign({id: user._id});
        return {token}

    }

}
