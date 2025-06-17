/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDocumentDto } from '../models/CreateDocumentDto';
import type { DocumentDto } from '../models/DocumentDto';
import type { PaginatedDocumentDto } from '../models/PaginatedDocumentDto';
import type { UpdateDocumentDto } from '../models/UpdateDocumentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DocumentService {
    /**
     * @returns PaginatedDocumentDto
     * @throws ApiError
     */
    public static documentControllerFindAll({
        page,
        perPage,
        searchValue,
        searchFields,
        additionalFields,
        filters,
    }: {
        page?: string,
        perPage?: string,
        searchValue?: string,
        searchFields?: Array<string>,
        additionalFields?: Array<string>,
        filters?: string,
    }): CancelablePromise<PaginatedDocumentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/document',
            query: {
                'page': page,
                'perPage': perPage,
                'searchValue': searchValue,
                'searchFields': searchFields,
                'additionalFields': additionalFields,
                'filters': filters,
            },
        });
    }
    /**
     * @returns DocumentDto The record has been successfully created.
     * @throws ApiError
     */
    public static documentControllerCreate({
        requestBody,
    }: {
        requestBody: CreateDocumentDto,
    }): CancelablePromise<DocumentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/document',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns DocumentDto
     * @throws ApiError
     */
    public static documentControllerFindOne({
        id,
    }: {
        id: string,
    }): CancelablePromise<DocumentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/document/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns DocumentDto
     * @throws ApiError
     */
    public static documentControllerUpdate({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateDocumentDto,
    }): CancelablePromise<DocumentDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/document/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns DocumentDto
     * @throws ApiError
     */
    public static documentControllerRemove({
        id,
    }: {
        id: string,
    }): CancelablePromise<DocumentDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/document/{id}',
            path: {
                'id': id,
            },
        });
    }
}
