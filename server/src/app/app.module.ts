import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { ConfigModule} from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { DocumentModule } from 'src/document/document.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AnnotationModule } from 'src/annotation/annotation.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'), 
      serveRoot: '/assets', 
    }),
    MongooseModule.forRoot(process.env.DATABASE as string), 
    UserModule, 
    AuthModule, 
    MailModule,
    DocumentModule,
    AppModule,
    AnnotationModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
