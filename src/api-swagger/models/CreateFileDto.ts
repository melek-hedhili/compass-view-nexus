/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateFileDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    clientId: string;
    emailId: string;
    fileName: string;
    legalForm: CreateFileDto.legalForm;
    provision: CreateFileDto.provision;
    isUrgent: boolean;
    status?: CreateFileDto.status;
};
export namespace CreateFileDto {
    export enum legalForm {
        SARL = 'SARL',
        SAS = 'SAS',
        SCI = 'SCI',
        EURL = 'EURL',
    }
    export enum provision {
        LEGAL = 'LEGAL',
        ACCOUNTING = 'ACCOUNTING',
        ADMINISTRATIVE = 'ADMINISTRATIVE',
    }
    export enum status {
        UNDER_STUDY = 'UNDER_STUDY',
        PENDING = 'PENDING',
        PENDING_STAR = 'PENDING_STAR',
        TO_BE_ENTERED = 'TO_BE_ENTERED',
        TO_BE_ENTERED_STAR = 'TO_BE_ENTERED_STAR',
        TO_BE_PAID = 'TO_BE_PAID',
        WAITING_FOR_GREFFE = 'WAITING_FOR_GREFFE',
        WAITING_FOR_GREFFE_STAR = 'WAITING_FOR_GREFFE_STAR',
        REJECTED = 'REJECTED',
        COMPLETED = 'COMPLETED',
        BLOCKED = 'BLOCKED',
    }
}

