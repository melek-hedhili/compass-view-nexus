/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateDocumentDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    documentName: string;
    shortName: string;
    legalForm: CreateDocumentDto.legalForm;
    benefit: CreateDocumentDto.benefit;
    type: CreateDocumentDto.type;
};
export namespace CreateDocumentDto {
    export enum legalForm {
        SARL = 'SARL',
        SAS = 'SAS',
        SCI = 'SCI',
        EURL = 'EURL',
    }
    export enum benefit {
        CREATION = 'CREATION',
        UPDATE = 'UPDATE',
        CESSATION = 'CESSATION',
    }
    export enum type {
        LEGAL_ANNOUNCEMENT = 'LEGAL_ANNOUNCEMENT',
        INTERNAL = 'INTERNAL',
        INVOICE = 'INVOICE',
        GREFFE = 'GREFFE',
        VALIDATION = 'VALIDATION',
    }
}

