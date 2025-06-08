import { SetMetadata } from '@nestjs/common';

export const CHECK_ACTION_KEY = 'check_action';
export const CheckAction = (...actions: string[]) => SetMetadata(CHECK_ACTION_KEY, actions);
