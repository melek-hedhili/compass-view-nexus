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
    legalForm: Array<'SARL' | 'SAS' | 'SCI' | 'EURL'>;
    benefit: Array<'CREATION' | 'UPDATE' | 'CESSATION'>;
    type: Array<'LEGAL_ANNOUNCEMENT' | 'INTERNAL' | 'INVOICE' | 'GREFFE' | 'VALIDATION'>;
};

