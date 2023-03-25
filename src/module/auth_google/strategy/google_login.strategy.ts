import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, VerifyCallback} from 'passport-google-oauth20'



@Injectable()
export class GoogleLoginStrategy extends PassportStrategy(Strategy, 'google_login'){
    constructor(){
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_LOGIN,
            scope: ['email', 'profile']
        })
    }

    async validate(accessToken: string ,refreshToken: string ,profile: any, done: VerifyCallback): Promise<unknown | any>{
        const { name, emails } = profile
        
        const user = {
            password: profile.id,
            email: emails[0].value,
            firstName: name.givenName,
        }    
        done(null, user)
    }
}