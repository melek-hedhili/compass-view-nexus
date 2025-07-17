/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateClientDto = {
    clientName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    jounals?: UpdateClientDto.jounals;
    accounts?: Array<string>;
    creationPrice?: number;
    modificationPrice?: number;
    submissionPrice?: number;
    delegatePayment?: string;
    isArchived?: boolean;
};
export namespace UpdateClientDto {
    export enum jounals {
        LOCAL = 'LOCAL',
        NATIONAL = 'NATIONAL',
        BODACC = 'BODACC',
    }
}

