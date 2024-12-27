import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService){}

    @Post('/signup')
    signUp(@Body() signupDto : SignUpDto): Promise<{token: string}> {
        return this.auth.signUp(signupDto)
    }

    @Post('/signin')
    signIp(@Body() signipDto : SignInDto): Promise<{token: string}> {
        return this.auth.signIn(signipDto)
    }
}
