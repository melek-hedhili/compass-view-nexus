/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDataDto } from '../models/CreateDataDto';
import type { DataDto } from '../models/DataDto';
import type { PaginatedDataDto } from '../models/PaginatedDataDto';
import type { UpdateDataDto } from '../models/UpdateDataDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DataService {
    /**
     * @returns PaginatedDataDto
     * @throws ApiError
     */
    public static dataControllerFindAll({
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
    }): CancelablePromise<PaginatedDataDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/data',
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
     * @returns DataDto The record has been successfully created.
     * @throws ApiError
     */
    public static dataControllerCreate({
        requestBody,
    }: {
        requestBody: CreateDataDto,
    }): CancelablePromise<DataDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/data',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns DataDto
     * @throws ApiError
     */
    public static dataControllerFindOne({
        id,
    }: {
        id: string,
    }): CancelablePromise<DataDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/data/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns DataDto
     * @throws ApiError
     */
    public static dataControllerUpdate({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateDataDto,
    }): CancelablePromise<DataDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/data/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns DataDto
     * @throws ApiError
     */
    public static dataControllerRemove({
        id,
    }: {
        id: string,
    }): CancelablePromise<DataDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/data/{id}',
            path: {
                'id': id,
            },
        });
    }
}
