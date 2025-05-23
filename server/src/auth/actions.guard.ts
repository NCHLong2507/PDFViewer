import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ACTION_KEY } from './actions.decorator';
import { DocumentService } from 'src/document/document.service';
@Injectable()
export class ActionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly documentService: DocumentService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action = this.reflector.get<string>(CHECK_ACTION_KEY, context.getHandler());
    if (!action) return true; 

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const documentId = request.query.id || request.params.id;

    if (!user || !documentId) {
      throw new ForbiddenException('Missing user or document ID');
    }

    const actions = await this.documentService.getDocumentPermissionPerUser(user.id, documentId);

    if (!actions.includes(action)) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return true;
  }
}
