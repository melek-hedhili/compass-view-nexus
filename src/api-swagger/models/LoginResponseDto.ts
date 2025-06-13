/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginResponseDto = {
    _id: string;
    role: LoginResponseDto.role;
    access_token: string;
};
export namespace LoginResponseDto {
    export enum role {
        ADMIN = 'ADMIN',
        JURIST = 'JURIST',
        OPERATOR = 'OPERATOR',
    }
}

