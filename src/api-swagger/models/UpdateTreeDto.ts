/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateTreeDto = {
    parentId?: string;
    fieldName?: string;
    index?: number;
    type?: UpdateTreeDto.type;
    isArchived?: boolean;
};
export namespace UpdateTreeDto {
    export enum type {
        SECTION = 'SECTION',
        TITLE = 'TITLE',
        SUB_TITLE = 'SUB_TITLE',
    }
}

