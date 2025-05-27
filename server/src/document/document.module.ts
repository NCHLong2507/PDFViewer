import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from './schema/document.schema';
import { InvitationSchema } from './schema/invitation.schema';
import { DocumentPermissionSchema } from './schema/document_permission.schema';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Document',
        schema: DocumentSchema,
      },
      {
        name: 'DocumentPermission',
        schema: DocumentPermissionSchema
      },
      {
        name: 'DocumentInvitation',
        schema: InvitationSchema
      }
    ]),
    UserModule,
    JwtModule, 
    MailModule
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
 