/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientDto } from './ClientDto';
import type { UserDto } from './UserDto';
export type FileDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    client: ClientDto;
    intervenant: UserDto;
    fileName: string;
    legalForm: FileDto.legalForm;
    provision: FileDto.provision;
    status: FileDto.status;
    isUrgent: boolean;
};
export namespace FileDto {
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

