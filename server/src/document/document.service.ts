import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Document, DocumentDocument } from './schema/document.schema';
import { DocumentPermission } from './schema/document_permission.schema';
import { Invitation } from './schema/invitation.schema';
import mongoose from 'mongoose';
import { DocumentDTO } from './DTO/documentDTO';
import { plainToInstance } from 'class-transformer';
import { CollaboratorRole } from './schema/document_permission.schema';
import { UserService } from 'src/user/user.service';
import { DocumentPermissionDTO } from './DTO/document_permissionDTO';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from '@nestjs/jwt';
import axios from 'axios';
import cloudinary from 'src/cloudinary.config';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel('Document')
    private documentModel: Model<Document>,
    @InjectModel('DocumentPermission')
    private documentPermisionModel: Model<DocumentPermission>,
    @InjectModel('DocumentInvitation')
    private documentInvitationModel: Model<Invitation>,
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async getDocumentLazyLoading(
    id: string,
    desc: boolean = true,
  ): Promise<DocumentDTO[]> {
    const page = parseInt(id, 10);
    const limit = 10;
    const skip = page * limit;
    const updatedAt = desc ? -1 : 1;
    const documents = await this.documentModel
      .find()
      .sort({ updatedAt })
      .skip(skip)
      .limit(limit)
      .populate('owner', 'name email picture');
    const documentDTOs = plainToInstance(DocumentDTO, documents, {
      excludeExtraneousValues: true,
    });
    return documentDTOs;
  }

  async createDocument(
    name: string,
    fileUrl: string,
    ownerId: string,
  ): Promise<DocumentDTO> {
    if (!name || !fileUrl || !ownerId) {
      throw new BadRequestException('Missing name or email or fileUrl');
    }
    const owner = new mongoose.Types.ObjectId(ownerId);
    const newdocument = await this.documentModel.create({
      owner,
      name,
      fileUrl,
    });
    const populatedDocument = await this.documentModel
      .findById(newdocument._id)
      .populate('owner', 'name email picture');
    const documentDTO = plainToInstance(DocumentDTO, populatedDocument, {
      excludeExtraneousValues: true,
    });
    return documentDTO;
  }

  async getDocumentCount(): Promise<number> {
    return await this.documentModel.countDocuments();
  }

  async getDocumentInfor(_id: string): Promise<DocumentDTO> {
    if (!_id) {
      throw new BadRequestException('Missing id');
    }
    const documentID = new mongoose.Types.ObjectId(_id);
    const foundDocument = await this.documentModel
      .findById(documentID)
      .populate('owner', 'name email picture');
    const retdocument = plainToInstance(DocumentDTO, foundDocument, {
      excludeExtraneousValues: true,
    });
    return retdocument;
  }

  async getDocumentPermissionPerUser(
    _id: string,
    email: string,
  ): Promise<string[]> {
    if (!_id || !email) {
      throw new BadRequestException('Missing data');
    }

    const documentID = new mongoose.Types.ObjectId(_id);

    const document = await this.documentModel
      .findById(documentID)
      .populate('owner', 'name email picture');
    if (!document) {
      throw new BadRequestException('Document is invalid or being removed');
    }
    let role: string;
    const collaborator = await this.documentPermisionModel
      .find({ document: documentID })
      .populate('user', 'name email picture');
    const collaboratorList = plainToInstance(
      DocumentPermissionDTO,
      collaborator,
      { excludeExtraneousValues: true },
    );
    const owner = document.owner as any;
    if (owner.email === email) {
      role = 'Owner';
    } else {
      const matchedCollaborator = collaboratorList.find((collab) => {
        const user = collab.user as any;
        return user?.email === email;
      });
      if (!matchedCollaborator) {
        return [];
      }
      role = matchedCollaborator?.role.toString();
    }
    const allowed_actions = {
      Editor: ['DOWNLOAD', 'VIEW', 'EDIT'],
      Viewer: ['DOWNLOAD', 'VIEW'],
      Owner: ['DOWNLOAD', 'VIEW', 'EDIT', 'ADD'],
    };
    return allowed_actions[role];
  }

  async GetDocumentPermission(_id: string): Promise<DocumentPermissionDTO[]> {
    if (!_id) {
      throw new BadRequestException('Missing data');
    }
    const documentID = new mongoose.Types.ObjectId(_id);
    const collaborator = await this.documentPermisionModel
      .find({ document: documentID })
      .populate('user', '_id name email picture');
    const collaboratorDTO = plainToInstance(
      DocumentPermissionDTO,
      collaborator,
      { excludeExtraneousValues: true },
    );
    return collaboratorDTO;
  }

  async UpdateDocumentAcessControl(
    _id: string,
    collaborator: DocumentPermissionDTO[],
  ) {
    if (!_id) {
      throw new BadRequestException('Missing data');
    }
    const documentID = new mongoose.Types.ObjectId(_id);
    const document = await this.documentModel
      .findById(documentID)
      .populate('owner', 'email');
    if (!document) {
      throw new BadRequestException('Document not found');
    }
    const collaboratorDocuments = await this.documentPermisionModel
      .find({ document: documentID })
      .populate('user', 'name email');
    for (const collab of collaborator) {
      const email = collab.user.email;
      const role = collab.role;
      if (!email || !role) {
        throw new BadRequestException(
          'Email or role is missing in collaborator data',
        );
      }

      let collaboratorToUpdate = collaboratorDocuments.find(
        (collab) => (collab.user as any).email === email,
      );

      if (collaboratorToUpdate) {
        if (role === 'Remove') {
          await this.documentPermisionModel.deleteOne({
            _id: collaboratorToUpdate._id,
          });
        } else {
          const newRole =
            role === 'Viewer'
              ? CollaboratorRole.VIEWER
              : CollaboratorRole.EDITOR;
          collaboratorToUpdate.role = newRole;
          await collaboratorToUpdate.save();
        }
      } else {
        throw new BadRequestException(
          `User with email ${email} is not a collaborator of this document`,
        );
      }
    }
  }

  async AddDocumentAccessControl(
    _id: string,
    data: { emailList: string[]; role: string },
  ) {
    if (!_id) {
      throw new BadRequestException('Missing data');
    }
    const { emailList, role } = data;
    const documentID = new mongoose.Types.ObjectId(_id);
    const document = await this.documentModel.findById(documentID);
    if (!document) {
      throw new BadRequestException('Document not found');
    }
    const newRole =
      role === 'Viewer' ? CollaboratorRole.VIEWER : CollaboratorRole.EDITOR;
    const users = await Promise.all(
      emailList.map((email) => this.userService.findbyEmail(email)),
    );

    const unregisterdEmails = emailList.filter(
      (_, index) => users[index] === null,
    );
    if (unregisterdEmails.length > 0) {
      await Promise.all(
        unregisterdEmails.map((email) =>
          this.handleUnregistedUser(email, document, newRole),
        ),
      );
      return;
    }

    const collaborator = await this.documentPermisionModel.find({
      document: documentID,
    });
    const existingUserIds = new Set(
      (collaborator ?? []).map((c) => c.user.toString()),
    );
    const newCollaborators = users.filter(
      (user) => user && !existingUserIds.has(user._id.toString()),
    );
    await Promise.all(
      newCollaborators.filter(Boolean).map(
        (user) =>
          user &&
          this.documentPermisionModel.create({
            document: documentID,
            user: new mongoose.Types.ObjectId(user._id),
            role: newRole,
          }),
      ),
    );
    Promise.all(
      newCollaborators.map((user) =>
        this.mailService.sendEmail({
          subject: `Bạn đã được thêm quyền ${newRole} cho tài liệu "${document.name}"`,
          template: 'document-access-control-notification',
          email: user?.email as string,
          context: {
            documentName: document.name,
            documentLink: `http://localhost:5173/document/documentdetailed?id=${_id}`,
          },
        }),
      ),
    );
    await document.save();
  }

  async handleUnregistedUser(
    email: string,
    document: DocumentDocument,
    role: CollaboratorRole,
  ) {
    const invitation = await this.documentInvitationModel.create({
      document: document._id,
      email,
      role,
    });
    const payload = {
      email,
      document: document._id.toString(),
      role: role.toString(),
      invitation: invitation._id.toString(),
    };
    const invitation_token = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: process.env.JWT_INVITATION_KEY,
    });
    this.mailService.sendEmail({
      subject: `Invitation to access the document "${document.name}" as a ${role}`,
      template: 'invitation-access-control',
      email,
      context: {
        documentName: document.name,
        documentLink: `http://localhost:5173/auth/signup?invitation_token=${invitation_token}`,
      },
    }); 
  }
  async verifyInvitationToken(invitation_token: string): Promise<{
    status: boolean;
    message?: string;
    documentName?: string;
    documentID?: string;
    email?: string;
  }> {
    try {
      const payload = await this.jwtService.verifyAsync(invitation_token, {
        secret: process.env.JWT_INVITATION_KEY,
      });

      const {
        email,
        document: documentId,
        role,
        invitation: invitationId,
      } = payload;

      const invitation =
        await this.documentInvitationModel.findById(invitationId);
      if (!invitation || invitation.status !== 'pending') {
        return {
          status: false,
          message: 'Invalid or expired invitation token',
        };
      }

      if (invitation.email !== email) {
        throw new BadRequestException(
          'You must register with the email in the invitation',
        );
      }

      if (invitation.document.toString() !== documentId) {
        return {
          status: false,
          message: 'Invalid document ID in invitation token',
        };
      }

      const document = await this.documentModel.findById(documentId);
      if (!document) {
        return { status: false, message: 'Document not found' };
      }

      const user = await this.userService.findbyEmail(email);
      if (!user) {
        throw new BadRequestException(
          'You must login/register with the email in the invitation',
        );
      }

      invitation.status = 'accepted';
      await invitation.save();

      await this.documentPermisionModel.create({
        document: document._id,
        user: user._id,
        role,
      });

      return {
        status: true,
        documentName: document.name,
        documentID: document._id.toString(),
        email,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof TokenExpiredError) {
        console.error('TokenExpiredError:', error.message);
        throw new UnauthorizedException('Invitation token has expired.');
      }
      throw new UnauthorizedException(error.message);
    }
  }
  async uploadFromDrive(
    fileData: {
      fileId: string;
      fileName: string;
      mimeType: string;
      webViewLink: string;
      access_token: string;
    },
    userId: string,
  ): Promise<DocumentDTO> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/drive/v3/files/${fileData.fileId}?alt=media&key=${process.env.GOOGLE_API_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${fileData.access_token}`, 
          },
          responseType: 'stream',
        },
      );

      const uploadResult: { secure_url: string } = await new Promise(
        (resolve, reject) => {
          const sanitizedFileName = fileData.fileName.replace(
            /[^a-zA-Z0-9-_]/g,
            '-',
          );
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'Document',
              resource_type: 'auto',
              public_id: sanitizedFileName,
            },
            (error, result) => {
              if (error) return reject(new BadRequestException(error.message));
              if (!result)
                return reject(
                  new BadRequestException('Upload failed, result is undefined'),
                );
              resolve(result);
            },
          );
          response.data.pipe(stream);
        },
      );

      const documentDTO = this.createDocument(
        fileData.fileName,
        uploadResult.secure_url,
        userId,
      );
      return documentDTO;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'Failed to upload file from Google Drive: ' + err.message,
      );
    }
  }
}
