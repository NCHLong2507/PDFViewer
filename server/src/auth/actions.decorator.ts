import { SetMetadata } from '@nestjs/common';

export const CHECK_ACTION_KEY = 'check_action';
export const CheckAction = (action: string) => SetMetadata(CHECK_ACTION_KEY, action);