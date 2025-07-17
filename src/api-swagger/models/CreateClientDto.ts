/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateClientDto = {
    clientName: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    jounals?: CreateClientDto.jounals;
    accounts?: Array<string>;
    creationPrice?: number;
    modificationPrice?: number;
    submissionPrice?: number;
    delegatePayment?: string;
};
export namespace CreateClientDto {
    export enum jounals {
        LOCAL = 'LOCAL',
        NATIONAL = 'NATIONAL',
        BODACC = 'BODACC',
    }
}

