/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTreeDto } from "../models/CreateTreeDto";
import type { PaginatedTreeDto } from "../models/PaginatedTreeDto";
import type { TreeDto } from "../models/TreeDto";
import type { UpdateTreeDto } from "../models/UpdateTreeDto";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class TreeService {
  /**
   * @returns PaginatedTreeDto
   * @throws ApiError
   */
  public static treeControllerFindAll({
    page,
    perPage,
    searchValue,
    searchFields,
    additionalFields,
    filters,
  }: {
    page?: string;
    perPage?: string;
    searchValue?: string;
    searchFields?: Array<string>;
    additionalFields?: Array<string>;
    filters?: string;
  }): CancelablePromise<PaginatedTreeDto> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/tree",
      query: {
        page: page,
        perPage: perPage,
        searchValue: searchValue,
        searchFields: searchFields,
        additionalFields: additionalFields,
        filters: filters,
      },
    });
  }
  /**
   * @returns TreeDto The record has been successfully created.
   * @throws ApiError
   */
  public static treeControllerCreate({
    requestBody,
  }: {
    requestBody: CreateTreeDto;
  }): CancelablePromise<TreeDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/tree",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @returns TreeDto
   * @throws ApiError
   */
  public static treeControllerFindOne({
    id,
  }: {
    id: string;
  }): CancelablePromise<TreeDto> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/tree/{id}",
      path: {
        id: id,
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
    id: string;
    requestBody: UpdateTreeDto;
  }): CancelablePromise<TreeDto> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/tree/{id}",
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @returns TreeDto
   * @throws ApiError
   */
  public static treeControllerRemove({
    id,
  }: {
    id: string;
  }): CancelablePromise<TreeDto> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/tree/{id}",
      path: {
        id: id,
      },
    });
  }
}
