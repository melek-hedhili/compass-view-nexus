/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientDto } from './ClientDto';
import type { FileDto } from './FileDto';
export type EmailDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    client: ClientDto;
    file: FileDto;
    from: string;
    to: string;
    subject: string;
    date: string;
    textBody: string;
    htmlBody: string;
    isArchived: boolean;
};

