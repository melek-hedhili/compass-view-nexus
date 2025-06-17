/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    email: string;
    username: string;
    role: UserDto.role;
};
export namespace UserDto {
    export enum role {
        ADMIN = 'ADMIN',
        JURIST = 'JURIST',
        OPERATOR = 'OPERATOR',
    }
}

