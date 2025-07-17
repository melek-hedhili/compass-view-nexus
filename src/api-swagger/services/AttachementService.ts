/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttachementDto } from '../models/AttachementDto';
import type { OperationSuccessDto } from '../models/OperationSuccessDto';
import type { PaginatedAttachementDto } from '../models/PaginatedAttachementDto';
import type { UploadAttachementDto } from '../models/UploadAttachementDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AttachementService {
    /**
     * @returns PaginatedAttachementDto
     * @throws ApiError
     */
    public static attachementControllerFindFileAttachements({
        id,
        page,
        perPage,
        searchValue,
        searchFields,
        additionalFields,
        filters,
    }: {
        id: string,
        page?: string,
        perPage?: string,
        searchValue?: string,
        searchFields?: Array<string>,
        additionalFields?: Array<string>,
        filters?: string,
    }): CancelablePromise<PaginatedAttachementDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/attachement/{id}',
            path: {
                'id': id,
            },
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
     * @returns PaginatedAttachementDto
     * @throws ApiError
     */
    public static attachementControllerFindAll({
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
    }): CancelablePromise<PaginatedAttachementDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/attachement',
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
     * @returns AttachementDto
     * @throws ApiError
     */
    public static attachementControllerStartOcr({
        id,
    }: {
        id: string,
    }): CancelablePromise<AttachementDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/attachement/ocr/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns OperationSuccessDto
     * @throws ApiError
     */
    public static attachementControllerUploadMultipleFiles({
        formData,
    }: {
        formData: UploadAttachementDto,
    }): CancelablePromise<OperationSuccessDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/attachement/upload-files',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
