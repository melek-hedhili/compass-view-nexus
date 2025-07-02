/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TreeDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    fieldName: string;
    parent?: TreeDto;
    index: number;
    type: TreeDto.type;
    isArchived: boolean;
};
export namespace TreeDto {
    export enum type {
        SECTION = 'SECTION',
        TITLE = 'TITLE',
        SUB_TITLE = 'SUB_TITLE',
    }
}

