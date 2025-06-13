/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateClientDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    clientName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    jounals?: UpdateClientDto.jounals;
    creationPrice?: number;
    modificationPrice?: number;
    submissionPrice?: number;
    delegatePayment?: string;
};
export namespace UpdateClientDto {
    export enum jounals {
        LOCAL = 'LOCAL',
        NATIONAL = 'NATIONAL',
        BODACC = 'BODACC',
    }
}

