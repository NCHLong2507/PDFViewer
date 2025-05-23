import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Document, DocumentDocument } from './schema/document.schema';
import { DocumentPermission } from './schema/document_permission.schema';
import mongoose from 'mongoose';
import { DocumentDTO } from './DTO/documentDTO';
import { plainToInstance } from 'class-transformer';
import { CollaboratorRole } from './schema/document_permission.schema';
import { UserService } from 'src/user/user.service';
import { NotFoundError } from 'rxjs';
import { DocumentPermissionDTO } from './DTO/document_permissionDTO';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel('Document')
    private documentModel: Model<Document>,
    @InjectModel('DocumentPermission')
    private documentPermisionModel: Model<DocumentPermission>,
    private userService: UserService,
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
      .populate('owner', { name: 1, email: 1 });
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
      .populate('owner', 'name email');
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
      .populate('owner', 'name email');
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
      .populate('owner', 'name email')
    if (!document) {
      throw new BadRequestException('Document is invalid or being removed');
    }
    let role: string;
    const collaborator = await this.documentPermisionModel
      .find({ document: documentID })
      .populate('user', 'name email');
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

  async GetDocumentPermission(_id:string): Promise<DocumentPermissionDTO[]> {
    if (!_id) {
      throw new BadRequestException('Missing data');
    }  
    const documentID = new mongoose.Types.ObjectId(_id);
    const collaborator = await this.documentPermisionModel.find({document:documentID}).populate('user','_id name email'); 
    const collaboratorDTO = plainToInstance(DocumentPermissionDTO, collaborator,{excludeExtraneousValues:true});
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
    const document = await this.documentModel
      .findById(documentID)
    if (!document) {
      throw new BadRequestException('Document not found');
    }
    const newRole =
      role === 'Viewer' ? CollaboratorRole.VIEWER : CollaboratorRole.EDITOR;
    const users = await Promise.all(
      emailList.map((email) => this.userService.findbyEmail(email)),
    );
    users.forEach((user, index) => {
      if (!user) {
        throw new NotFoundException(`User not found: ${data.emailList[index]}`);
      }
    });
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
    await document.save();
  }
}
