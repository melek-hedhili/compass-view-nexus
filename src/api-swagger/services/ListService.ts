/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateListDto } from '../models/CreateListDto';
import type { ListDto } from '../models/ListDto';
import type { PaginatedListDto } from '../models/PaginatedListDto';
import type { UpdateListDto } from '../models/UpdateListDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ListService {
    /**
     * @returns PaginatedListDto
     * @throws ApiError
     */
    public static listControllerFindAll({
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
    }): CancelablePromise<PaginatedListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/list',
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
     * @returns ListDto The record has been successfully created.
     * @throws ApiError
     */
    public static listControllerCreate({
        requestBody,
    }: {
        requestBody: CreateListDto,
    }): CancelablePromise<ListDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ListDto
     * @throws ApiError
     */
    public static listControllerFindOne({
        id,
    }: {
        id: string,
    }): CancelablePromise<ListDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/list/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ListDto
     * @throws ApiError
     */
    public static listControllerUpdate({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateListDto,
    }): CancelablePromise<ListDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/list/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ListDto
     * @throws ApiError
     */
    public static listControllerRemove({
        id,
    }: {
        id: string,
    }): CancelablePromise<ListDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/list/{id}',
            path: {
                'id': id,
            },
        });
    }
}
