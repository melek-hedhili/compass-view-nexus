/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { PaginatedUserDto } from '../models/PaginatedUserDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { UserDto } from '../models/UserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @returns UserDto
     * @throws ApiError
     */
    public static userControllerGetProfile(): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/profile',
        });
    }
    /**
     * @returns PaginatedUserDto
     * @throws ApiError
     */
    public static userControllerFindAll({
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
    }): CancelablePromise<PaginatedUserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user',
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
     * @returns UserDto The record has been successfully created.
     * @throws ApiError
     */
    public static userControllerCreate({
        requestBody,
    }: {
        requestBody: CreateUserDto,
    }): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns UserDto
     * @throws ApiError
     */
    public static userControllerFindOne({
        id,
    }: {
        id: string,
    }): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns UserDto
     * @throws ApiError
     */
    public static userControllerUpdate({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateUserDto,
    }): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns UserDto
     * @throws ApiError
     */
    public static userControllerRemove({
        id,
    }: {
        id: string,
    }): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/{id}',
            path: {
                'id': id,
            },
        });
    }
}
