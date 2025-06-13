/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateUserDto = {
    email?: string;
    username?: string;
    password?: string;
    role?: UpdateUserDto.role;
};
export namespace UpdateUserDto {
    export enum role {
        ADMIN = 'ADMIN',
        JURIST = 'JURIST',
        OPERATOR = 'OPERATOR',
    }
}

