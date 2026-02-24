// src/app/core/users/users.types.ts
import { User } from '../user/user.types';

export interface UserListItem extends User {
    username?: string;
    phone?: string;
    role?: string;
    lastActive?: Date;
    initials: string; // Calculado del nombre
}
