import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, FindManyOptions, In, Repository } from "typeorm";
import { AppTypeDto, FindAppTypesRequest, GetAppTypeResponse, GetAppTypesResponse, GetTypeValuesRequest } from "../../modules/app-values/app-type-dto";
import { AppType } from "../../modules/app-values/app-type.entity";
import { AppValueDto, GetAppValueResponse, GetAppValuesResponse } from "../../modules/app-values/app-value-dto";
import { AppValue } from "../../modules/app-values/app-value.entity";
import { AppError, AppErrorWithMessage } from "../app-error";
import { BaseSearchRequest } from "../base-search-request";
import { ApplicationBaseService } from "../base-service";
import { GenericResponse } from "../generic-response";

@Injectable()
export class ReferentialService extends ApplicationBaseService {
    constructor(
        @InjectRepository(AppValue)
        private readonly appValuesRepository: Repository<AppValue>,
        @InjectRepository(AppType)
        private readonly appTypesRepository: Repository<AppType>,
    ) {
        super();
    }

    async getAllAppTypes(conditions?: FindManyOptions<AppType>): Promise<GetAppTypesResponse> {
        const response = new GetAppTypesResponse();
        try {
            const appTypes = await this.appTypesRepository.find(conditions);
            if (appTypes) {
                response.appTypes = appTypes.map(x => x.toDto());
            }
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async getAppValues(conditions?: FindManyOptions<AppValue>, ofTypeCode?: string): Promise<GetAppValuesResponse> {
        const response = new GetAppValuesResponse();
        try {
            if (!conditions)
                conditions = {};
            let appTypeId: string;
            if (ofTypeCode) {
                const appType = await this.appTypesRepository.findOne({ where: { code: ofTypeCode }, select: ['id'] });
                if (appType && appType.id)
                    appTypeId = appType.id;
            }
            if (appTypeId) {
                if (!conditions.where)
                    conditions.where = {};
                (conditions.where as any).appTypeId = appTypeId;
            }
            const appValues = await this.appValuesRepository.find(conditions);
            if (appValues) {
                response.appValues = appValues.map(x => x.toDto());
            }
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async getOneAppValue(code: string, ofTypeCode?: string): Promise<GetAppValueResponse> {
        const response = new GetAppValueResponse();
        try {
            const getValuesResponse = await this.getAllAppValues([code], ofTypeCode);
            if (!getValuesResponse.success) {
                throw new AppErrorWithMessage(getValuesResponse.message);
            }
            if (getValuesResponse.appValues?.length)
                response.appValue = getValuesResponse.appValues[0];
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async getAllAppValues(codes?: string[], ofTypeCode?: string): Promise<GetAppValuesResponse> {
        const response = new GetAppValuesResponse();
        try {
            let appTypeId: string;
            const conditions: FindManyOptions<AppValue> = { where: {} };
            if (ofTypeCode) {
                const appType = await this.appTypesRepository.findOne({ where: { code: ofTypeCode }, select: ['id'] });
                if (appType && appType.id)
                    appTypeId = appType.id;
            }
            if (appTypeId) {
                (conditions.where as FindConditions<AppValue>).appTypeId = appTypeId;
            }
            if (codes && codes.length > 0)
                (conditions.where as FindConditions<AppValue>).code = In(codes);
            const appValues = await this.appValuesRepository.find(conditions);
            if (appValues) {
                response.appValues = appValues.map(x => x.toDto());
            }
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async getOneAppType(id: string): Promise<GetAppTypeResponse> {
        const response = new GetAppTypeResponse();
        try {
            const relations = ['appValues', 'appValues.translations'];
            const appType = await this.appTypesRepository.findOne({ where: { id: id }, relations: relations });
            if (!appType)
                throw new AppError('app type not found !');
            response.appType = appType.toDto();
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async getTypeValues(request: GetTypeValuesRequest): Promise<GetAppTypeResponse> {
        const response = new GetAppTypeResponse();
        try {
            if (!request.appTypeCode)
                throw new AppError('You must specify a type code !');
            const relations = ['appValues'];
            const appType = await this.appTypesRepository.findOne({ where: { code: request.appTypeCode }, relations: relations });
            if (!appType)
                throw new AppError('app type not found !');
            response.appType = appType.toDto();
            if (request.alsoDisabled !== 'true')
                response.appType.appValues = response.appType.appValues.filter(x => !!x.enabled);
            response.appType.appValues.sort((a, b) => {
                if (a[request.orderby] === b[request.orderby])
                    return 0;
                if (request.order === 'asc') {
                    return a[request.orderby] > b[request.orderby] ? 1 : -1;
                }
                else {
                    return a[request.orderby] > b[request.orderby] ? -1 : 1;
                }
            });
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async getMultipleTypeValues(request: FindAppTypesRequest): Promise<GetAppTypesResponse> {
        const response = new GetAppTypesResponse();
        try {
            if (!request.appTypesCodes)
                throw new AppError('You must specify a type code !');
            const appTypeCodes = request.appTypesCodes.split(',');
            if (!appTypeCodes?.length)
                throw new AppError('You must specify a type code !');
            const findOptions = BaseSearchRequest.getDefaultFindOptions<AppType>(request);
            findOptions.where = { code: In(appTypeCodes) };
            findOptions.relations = ['appValues'];
            const appTypes = await this.appTypesRepository.find(findOptions);
            for (const appType of appTypes) {
                if (appType)
                    response.appTypes.push(appType.toDto());
            }
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }

        return response;
    }

    async insertOrUpdateAppType(appTypeDto: AppTypeDto, includeAppValues: boolean, includeTranslations: boolean): Promise<GetAppTypeResponse> {
        const response = new GetAppTypeResponse();
        try {
            if (!appTypeDto.code)
                throw new AppError('app type code must be set !');
            const relations: string[] = [];
            if (includeAppValues) {
                relations.push('appValues');
                if (includeTranslations)
                    relations.push('appValues.translations');
            }
            let appType: AppType = await this.appTypesRepository.findOne({ where: { code: appTypeDto.code }, relations: relations });
            if (!appType)
                appType = new AppType();
            else
                appTypeDto.id = appType.id;
            appType.fromDto(appTypeDto, includeAppValues);
            appType = await this.appTypesRepository.save(appType);

            response.appType = appType.toDto();
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async insertOrUpdateAppValue(appValueDto: AppValueDto): Promise<GetAppValueResponse> {
        const response = new GetAppValueResponse();
        try {
            if (!appValueDto.code && appValueDto.id)
                throw new AppError('app value code must be set !');
            if (!appValueDto.label)
                throw new AppError('app value label must be set !');
            let appValue: AppValue;
            if (!appValueDto.code) {
                if (!appValueDto.appType && appValueDto.appTypeId) {
                    const appType = await this.appTypesRepository.findOne({ where: { id: appValueDto.appTypeId } });
                    appValueDto.appType = appType.toDto();
                }
                appValueDto.code = appValueDto.appType.code + '_' + appValueDto.label;
            }
            appValue = await this.appValuesRepository.findOne({ where: { code: appValueDto.code } });
            if (!appValue)
                appValue = new AppValue();
            else if (appValue.id)
                appValueDto.id = appValue.id;
            appValue.fromDto(appValueDto);
            appValue = await this.appValuesRepository.save(appValue);
            response.appValue = appValue.toDto();
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async createOrUpdateTypeWithValues(typeCode: string, typeLabel: string, values: { label: string, order: number, code?: string }[], removeOldValues: boolean) {
        try {
            const appType = new AppTypeDto();
            appType.code = typeCode;
            appType.label = typeLabel;
            const appTypeResponse = await this.insertOrUpdateAppType(appType, false, false);
            if (appTypeResponse.success) {
                for (const appValue of values) {
                    const appValueDto = new AppValueDto();
                    appValueDto.label = appValue.label;
                    appValueDto.appTypeId = appTypeResponse.appType.id;
                    appValueDto.order = appValue.order;
                    appValueDto.code = appValue.code;
                    appValueDto.enabled = true;
                    await this.insertOrUpdateAppValue(appValueDto);
                    appValue.code = appValueDto.code;
                }
                if (removeOldValues) {
                    const appValuesToRemove: string[] = [];
                    const appValuesResponse = await this.getAllAppValues(null, appTypeResponse.appType.code);
                    if (appValuesResponse.success) {
                        for (const appValue of appValuesResponse.appValues) {
                            if (values.filter(x => !!x.code).map(x => x.code).indexOf(appValue.code) === -1) {
                                appValuesToRemove.push(appValue.id);
                            }
                        }
                    }
                    if (appValuesToRemove.length > 0)
                        await this.appValuesRepository.delete(appValuesToRemove);
                }
            }
            else
                console.error(appTypeResponse.error);
        }
        catch (err) {
            console.error(err);
        }
    }

    public async removeAppValues(ids?: string[], codes?: string[]) {
        const response = new GenericResponse();
        try {
            if (!ids?.length && !codes?.length)
                throw new AppError('Invalid args !');
            let appValuesToRemove: string[] = [];
            if (ids?.length) {
                appValuesToRemove = ids;
            }
            else if (codes?.length) {
                const appValues = await this.appValuesRepository.find({ where: { code: In(codes) }, select: ['id'] });
                appValuesToRemove = appValues.map(x => x.id);
            }
            if (appValuesToRemove.length)
                await this.appValuesRepository.delete(appValuesToRemove);
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async disableAppValues(ids?: string[], codes?: string[]) {
        const response = new GenericResponse();
        try {
            if (!ids?.length && !codes?.length)
                throw new AppError('Invalid args !');
            let appValuesToUpdate: AppValue[] = [];
            if (ids?.length) {
                appValuesToUpdate = await this.appValuesRepository.find({ where: { id: In(ids) } });
            }
            else if (codes?.length) {
                appValuesToUpdate = await this.appValuesRepository.find({ where: { code: In(codes) } });
            }
            if (appValuesToUpdate.length) {
                for (const appValue of appValuesToUpdate) {
                    appValue.enabled = false;
                    await this.appValuesRepository.save(appValue);
                }
            }
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }
}