/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDocumentDataDto } from '../models/CreateDocumentDataDto';
import type { DocumentDataDto } from '../models/DocumentDataDto';
import type { GetFileDocumentDataResponseDto } from '../models/GetFileDocumentDataResponseDto';
import type { UpdateDocumentDataDto } from '../models/UpdateDocumentDataDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DocumentDataService {
    /**
     * @returns GetFileDocumentDataResponseDto
     * @throws ApiError
     */
    public static documentDataControllerFindAll({
        id,
    }: {
        id: string,
    }): CancelablePromise<Array<GetFileDocumentDataResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/document-data/file/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns GetFileDocumentDataResponseDto
     * @throws ApiError
     */
    public static documentDataControllerFillDocumentData({
        id,
    }: {
        id: string,
    }): CancelablePromise<Array<GetFileDocumentDataResponseDto>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/document-data/file/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns DocumentDataDto The record has been successfully created.
     * @throws ApiError
     */
    public static documentDataControllerCreate({
        requestBody,
    }: {
        requestBody: CreateDocumentDataDto,
    }): CancelablePromise<DocumentDataDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/document-data',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns DocumentDataDto
     * @throws ApiError
     */
    public static documentDataControllerFindOne({
        id,
    }: {
        id: string,
    }): CancelablePromise<DocumentDataDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/document-data/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns DocumentDataDto
     * @throws ApiError
     */
    public static documentDataControllerUpdate({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateDocumentDataDto,
    }): CancelablePromise<DocumentDataDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/document-data/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns DocumentDataDto
     * @throws ApiError
     */
    public static documentDataControllerRemove({
        id,
    }: {
        id: string,
    }): CancelablePromise<DocumentDataDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/document-data/{id}',
            path: {
                'id': id,
            },
        });
    }
}
