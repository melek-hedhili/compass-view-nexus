/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TreeDto } from './TreeDto';
export type GetTitlesResponseDto = {
    _id?: string;
    created_at?: string;
    updated_at?: string;
    fieldName: string;
    parent?: TreeDto;
    index: number;
    type: GetTitlesResponseDto.type;
    isArchived: boolean;
    subtitles: Array<TreeDto>;
};
export namespace GetTitlesResponseDto {
    export enum type {
        SECTION = 'SECTION',
        TITLE = 'TITLE',
        SUB_TITLE = 'SUB_TITLE',
    }
}

