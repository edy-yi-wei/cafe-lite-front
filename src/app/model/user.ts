import { Role } from '../model/role';

export class User {
    userId: number = 0;
    userName: string = '';
    userPassword: string = '';
    role: Role;
}