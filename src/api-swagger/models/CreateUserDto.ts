/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateUserDto = {
    email: string;
    username: string;
    password: string;
    role: CreateUserDto.role;
};
export namespace CreateUserDto {
    export enum role {
        ADMIN = 'ADMIN',
        JURIST = 'JURIST',
        OPERATOR = 'OPERATOR',
    }
}

