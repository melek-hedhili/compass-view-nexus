/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientDto } from '../models/ClientDto';
import type { CreateClientDto } from '../models/CreateClientDto';
import type { PaginatedClientDto } from '../models/PaginatedClientDto';
import type { UpdateClientDto } from '../models/UpdateClientDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClientService {
    /**
     * @returns string
     * @throws ApiError
     */
    public static clientControllerGetAllJournals(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/client/journals',
        });
    }
    /**
     * @returns PaginatedClientDto
     * @throws ApiError
     */
    public static clientControllerFindAll({
        page,
        perPage,
        value,
        searchFields,
        additionalFields,
    }: {
        page?: string,
        perPage?: string,
        value?: string,
        searchFields?: Array<string>,
        additionalFields?: Array<string>,
    }): CancelablePromise<PaginatedClientDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/client',
            query: {
                'page': page,
                'perPage': perPage,
                'value': value,
                'searchFields': searchFields,
                'additionalFields': additionalFields,
            },
        });
    }
    /**
     * @returns ClientDto The record has been successfully created.
     * @throws ApiError
     */
    public static clientControllerCreate({
        requestBody,
    }: {
        requestBody: CreateClientDto,
    }): CancelablePromise<ClientDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/client',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ClientDto
     * @throws ApiError
     */
    public static clientControllerFindOne({
        id,
    }: {
        id: string,
    }): CancelablePromise<ClientDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/client/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ClientDto
     * @throws ApiError
     */
    public static clientControllerUpdate({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateClientDto,
    }): CancelablePromise<ClientDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/client/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ClientDto
     * @throws ApiError
     */
    public static clientControllerRemove({
        id,
    }: {
        id: string,
    }): CancelablePromise<ClientDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/client/{id}',
            path: {
                'id': id,
            },
        });
    }
}
