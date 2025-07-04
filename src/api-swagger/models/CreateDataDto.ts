/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDocumentScriptDto } from './CreateDocumentScriptDto';
export type CreateDataDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    fieldName: string;
    dependenceValue?: string;
    dependsOnId?: string;
    treeId?: string;
    type: CreateDataDto.type;
    legalForm: CreateDataDto.legalForm;
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
        BOOLEAN = 'BOOLEAN',
        DATE = 'DATE',
        MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    }
    export enum legalForm {
        SARL = 'SARL',
        SAS = 'SAS',
        SCI = 'SCI',
        EURL = 'EURL',
    }
}

