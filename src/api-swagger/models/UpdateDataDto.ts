/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDocumentScriptDto } from './CreateDocumentScriptDto';
export type UpdateDataDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    fieldName?: string;
    dependsOnId?: string;
    treeId?: string;
    type?: UpdateDataDto.type;
    legalForm?: UpdateDataDto.legalForm;
    listId?: string;
    documents?: Array<CreateDocumentScriptDto>;
    isModifiable?: boolean;
    isControlField?: boolean;
    isMultiItem?: boolean;
};
export namespace UpdateDataDto {
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

