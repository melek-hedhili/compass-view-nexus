/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDocumentScriptDto } from './CreateDocumentScriptDto';
export type CreateDataDto = {
    fieldName: string;
    dependenceValue?: Array<string>;
    dependsOnId?: string;
    treeId?: string;
    type: CreateDataDto.type;
    legalForm: Array<'SARL' | 'SAS' | 'SCI' | 'EURL'>;
    listId?: string;
    documents: Array<CreateDocumentScriptDto>;
    isModifiable: boolean;
    isControlField: boolean;
    isMultiItem: boolean;
};
export namespace CreateDataDto {
    export enum type {
        STRING = 'STRING',
        NUMBER = 'NUMBER',
        SINGLE_CHOICE = 'SINGLE_CHOICE',
        DATE = 'DATE',
        MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    }
}

