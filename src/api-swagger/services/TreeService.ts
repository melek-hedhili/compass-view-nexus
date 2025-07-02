/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTreeDto } from '../models/CreateTreeDto';
import type { GetSectionsResponseDto } from '../models/GetSectionsResponseDto';
import type { TreeDto } from '../models/TreeDto';
import type { UpdateOrderDto } from '../models/UpdateOrderDto';
import type { UpdateTreeDto } from '../models/UpdateTreeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TreeService {
    /**
     * @returns GetSectionsResponseDto
     * @throws ApiError
     */
    public static treeControllerFindAll(): CancelablePromise<Array<GetSectionsResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tree',
        });
    }
    /**
     * @returns TreeDto The record has been successfully created.
     * @throws ApiError
     */
    public static treeControllerCreate({
        requestBody,
    }: {
        requestBody: CreateTreeDto,
    }): CancelablePromise<TreeDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tree',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns TreeDto
     * @throws ApiError
     */
    public static treeControllerFindOne({
        id,
    }: {
        id: string,
    }): CancelablePromise<TreeDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tree/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns TreeDto
     * @throws ApiError
     */
    public static treeControllerUpdate({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateTreeDto,
    }): CancelablePromise<TreeDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/tree/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns TreeDto
     * @throws ApiError
     */
    public static treeControllerRemove({
        id,
    }: {
        id: string,
    }): CancelablePromise<TreeDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tree/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns TreeDto
     * @throws ApiError
     */
    public static treeControllerUpdateOrder({
        requestBody,
    }: {
        requestBody: UpdateOrderDto,
    }): CancelablePromise<TreeDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/tree/order',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
