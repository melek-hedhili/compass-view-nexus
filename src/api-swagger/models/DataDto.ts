/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentScriptDto } from './DocumentScriptDto';
import type { ListDto } from './ListDto';
import type { TreeDto } from './TreeDto';
export type DataDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    fieldName: string;
    dependsOn?: DataDto;
    tree?: TreeDto;
    type: DataDto.type;
    legalForm: DataDto.legalForm;
    list?: ListDto;
    documents: Array<DocumentScriptDto>;
    isModifiable: boolean;
    isControlField: boolean;
    isMultiItem: boolean;
    isArchived: boolean;
    dependenceValue?: string;
};
export namespace DataDto {
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

