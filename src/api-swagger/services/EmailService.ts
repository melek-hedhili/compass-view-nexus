/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEmailDto } from '../models/CreateEmailDto';
import type { EmailDto } from '../models/EmailDto';
import type { LinkToFileDto } from '../models/LinkToFileDto';
import type { PaginatedEmailDto } from '../models/PaginatedEmailDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmailService {
    /**
     * @returns EmailDto
     * @throws ApiError
     */
    public static emailControllerLinkToFile({
        requestBody,
    }: {
        requestBody: LinkToFileDto,
    }): CancelablePromise<EmailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email/linktofile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns EmailDto
     * @throws ApiError
     */
    public static emailControllerArchive({
        id,
    }: {
        id: string,
    }): CancelablePromise<EmailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email/archive/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns PaginatedEmailDto
     * @throws ApiError
     */
    public static emailControllerFindAllByFile({
        id,
    }: {
        id: string,
    }): CancelablePromise<PaginatedEmailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/email/file/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns PaginatedEmailDto
     * @throws ApiError
     */
    public static emailControllerFindAllArchived({
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
    }): CancelablePromise<PaginatedEmailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/email/archived',
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
     * @returns PaginatedEmailDto
     * @throws ApiError
     */
    public static emailControllerFindAllSent({
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
    }): CancelablePromise<PaginatedEmailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/email/sent',
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
     * @returns PaginatedEmailDto
     * @throws ApiError
     */
    public static emailControllerFindAll({
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
    }): CancelablePromise<PaginatedEmailDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/email',
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
     * @returns EmailDto The record has been successfully created.
     * @throws ApiError
     */
    public static emailControllerSendEmail({
        requestBody,
    }: {
        requestBody: CreateEmailDto,
    }): CancelablePromise<EmailDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/email',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
