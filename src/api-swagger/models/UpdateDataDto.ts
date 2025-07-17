/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDocumentScriptDto } from './CreateDocumentScriptDto';
export type UpdateDataDto = {
    fieldName?: string;
    dependenceValue?: Array<string>;
    dependsOnId?: string;
    treeId?: string;
    type?: UpdateDataDto.type;
    legalForm?: Array<'SARL' | 'SAS' | 'SCI' | 'EURL'>;
    listId?: string;
    documents?: Array<CreateDocumentScriptDto>;
    isModifiable?: boolean;
    isControlField?: boolean;
    isMultiItem?: boolean;
    isArchived?: boolean;
};
export namespace UpdateDataDto {
    export enum type {
        STRING = 'STRING',
        NUMBER = 'NUMBER',
        SINGLE_CHOICE = 'SINGLE_CHOICE',
        DATE = 'DATE',
        MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    }
}

