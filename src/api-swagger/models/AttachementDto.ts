/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttachementObjectDto } from './AttachementObjectDto';
import type { DocumentDto } from './DocumentDto';
import type { EmailDto } from './EmailDto';
import type { FileDto } from './FileDto';
export type AttachementDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    originalFile: AttachementObjectDto;
    ocrFile?: AttachementObjectDto;
    file?: FileDto;
    email?: EmailDto;
    document?: DocumentDto;
    updatedByAi: boolean;
    readByOcr: boolean;
};

