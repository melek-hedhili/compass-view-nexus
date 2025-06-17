/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFileDto } from '../models/CreateFileDto';
import type { FileDto } from '../models/FileDto';
import type { PaginatedFileDto } from '../models/PaginatedFileDto';
import type { UpdateFileDto } from '../models/UpdateFileDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FileService {
    /**
     * @returns string
     * @throws ApiError
     */
    public static fileControllerGetAllLegalForms(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/file/legalforms',
        });
    }
    /**
     * @returns string
     * @throws ApiError
     */
    public static fileControllerGetAllprovisions(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/file/provisions',
        });
    }
    /**
     * @returns FileDto
     * @throws ApiError
     */
    public static fileControllerFindAllByClientId({
        id,
    }: {
        id: string,
    }): CancelablePromise<Array<FileDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/file/client/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns PaginatedFileDto
     * @throws ApiError
     */
    public static fileControllerFindAll({
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
    }): CancelablePromise<PaginatedFileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/file',
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
     * @returns FileDto The record has been successfully created.
     * @throws ApiError
     */
    public static fileControllerCreate({
        requestBody,
    }: {
        requestBody: CreateFileDto,
    }): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/file',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns FileDto
     * @throws ApiError
     */
    public static fileControllerFindOne({
        id,
    }: {
        id: string,
    }): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/file/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns FileDto
     * @throws ApiError
     */
    public static fileControllerUpdate({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateFileDto,
    }): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/file/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns FileDto
     * @throws ApiError
     */
    public static fileControllerRemove({
        id,
    }: {
        id: string,
    }): CancelablePromise<FileDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/file/{id}',
            path: {
                'id': id,
            },
        });
    }
}
