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
    legalForm: Array<'SARL' | 'SAS' | 'SCI' | 'EURL'>;
    list?: ListDto;
    documents: Array<DocumentScriptDto>;
    isModifiable: boolean;
    isControlField: boolean;
    isMultiItem: boolean;
    isArchived: boolean;
    dependenceValue?: Array<string>;
};
export namespace DataDto {
    export enum type {
        STRING = 'STRING',
        NUMBER = 'NUMBER',
        SINGLE_CHOICE = 'SINGLE_CHOICE',
        DATE = 'DATE',
        MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    }
}

