/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetTitlesResponseDto } from './GetTitlesResponseDto';
import type { TreeDto } from './TreeDto';
export type GetSectionsResponseDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    fieldName: string;
    parent?: TreeDto;
    index: number;
    type: GetSectionsResponseDto.type;
    titles: Array<GetTitlesResponseDto>;
};
export namespace GetSectionsResponseDto {
    export enum type {
        SECTION = 'SECTION',
        TITLE = 'TITLE',
        SUB_TITLE = 'SUB_TITLE',
    }
}

