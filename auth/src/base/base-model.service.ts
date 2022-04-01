import { List } from "linqts";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { IQuery } from "typeorm-linq-repository";
import { ApplicationBaseService } from "./base-service";
import { GenericResponse } from "./generic-response";
import { BaseSearchResponse } from "./search-response";

interface LinqRelation<X> {
    include: ((x: X) => any);
    child?: LinqRelation<any>;
}

interface ModelOptions<X, Y, Z> {
    entity: new () => X;
    repository: Repository<X>;
    getOneResponse: new () => Y;
    getManyResponse: new () => Z;
    getManyResponseField: string;
    getOneResponseField: string;
    getManyRelations?: string[];
    getOneRelations?: string[];
    getOneRelationsLinq?: LinqRelation<X>[];
    getManyRelationsLinq?: LinqRelation<X>[];
    archiveField?: string;
    archiveFieldValue?: boolean;
}

export interface LinqQueryWrapper<X> {
    query: IQuery<X, X, X>;
    relations?: LinqRelation<X>[];
}

export interface LinqMultipleQueryWrapper<X> {
    query: IQuery<X, X[], X>;
    relations?: LinqRelation<X>[];
}

export abstract class ApplicationBaseModelService<X extends { id: string | number; toDto: (...args: any) => any; fromDto: (dto: XDTO) => any } = undefined,
    XDTO extends { id?: string | number; } = undefined, Y extends GenericResponse = undefined, Z extends BaseSearchResponse = undefined> extends ApplicationBaseService {
    public modelOptions: ModelOptions<X, Y, Z>;
    constructor() {
        super();
        this.checkModelOptions();
    }

    private checkModelOptions() {
        if (!this.modelOptions || !this.modelOptions.entity || !this.modelOptions.getManyResponseField || !this.modelOptions.getOneResponseField) {
            console.error('Please initialize model options to use ApplicationBaseModelService - modelOptions', this.modelOptions, this.constructor.name);
            return false;
        }
        if (typeof this.modelOptions.archiveField === 'undefined')
            this.modelOptions.archiveField = 'enabled';
        if (typeof this.modelOptions.archiveFieldValue === 'undefined')
            this.modelOptions.archiveFieldValue = false;
        return true;
    }
    private getLinqRelationsFromArray(query: (IQuery<X, any, any>), relations: LinqRelation<X>[]) {
        if (!relations)
            return query;
        for (const relation of relations) {
            query = query.include(relation.include);
            if (relation.child)
                query = query.thenInclude(relation.child.include);
        }
        return query;
    }
    async findOne(conditions?: FindOneOptions<X> | LinqQueryWrapper<X>, ...toDtoParameters: any): Promise<Y> {
        if (!this.checkModelOptions())
            return null;
        const response = new (this.modelOptions.getOneResponse)();
        try {
            if (!conditions)
                conditions = {};
            let entity: X;
            const useNewLinqRepo = !!(conditions as any).query;
            if (useNewLinqRepo) {
                conditions = conditions as LinqQueryWrapper<X>;
                conditions.query = this.getLinqRelationsFromArray(conditions.query, conditions.relations);
                conditions.query = this.getLinqRelationsFromArray(conditions.query, this.modelOptions.getOneRelationsLinq);
                entity = await conditions.query.toPromise();
            }
            else {
                const relations: string[] = [];
                if (this.modelOptions.getOneRelations)
                    relations.push(...new List(this.modelOptions.getOneRelations).Distinct().ToArray());
                conditions = conditions as FindOneOptions<X>;
                if (!conditions.relations)
                    conditions.relations = [];
                conditions.relations = new List([...conditions.relations, ...relations]).Distinct().ToArray();
                entity = await this.modelOptions.repository.findOne(conditions);
            }
            if (entity) {
                response[this.modelOptions.getOneResponseField] = entity.toDto(...toDtoParameters);
            }
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async findAll(conditions?: FindManyOptions<X> | LinqMultipleQueryWrapper<X>, ...toDtoParameters: any): Promise<Z> {
        if (!this.checkModelOptions())
            return null;
        const response = new (this.modelOptions.getManyResponse)();
        try {
            if (!conditions)
                conditions = {};
            let entities: X[];
            const useNewLinqRepo = !!(conditions as any).query;
            if (useNewLinqRepo)
                response.filteredResults = await ((conditions as any).query as IQuery<X, X[], X>).count();
            else
                response.filteredResults = await this.modelOptions.repository.count(conditions as FindManyOptions<X>);

            if (response.filteredResults === 0) {
                response.success = true;
                return response;
            }
            if (useNewLinqRepo) {
                conditions = conditions as LinqMultipleQueryWrapper<X>;
                conditions.query = this.getLinqRelationsFromArray(conditions.query, conditions.relations);
                conditions.query = this.getLinqRelationsFromArray(conditions.query, this.modelOptions.getManyRelationsLinq);
                entities = await conditions.query.toPromise();
            }
            else {
                const relations: string[] = [];
                if (this.modelOptions.getManyRelations)
                    relations.push(...new List(this.modelOptions.getManyRelations).Distinct().ToArray());
                conditions = conditions as FindManyOptions<X>;
                if (!conditions.relations)
                    conditions.relations = [];
                conditions.relations = new List([...conditions.relations, ...relations]).Distinct().ToArray();
                // console.log("🚀 ~ conditions.relations", conditions.relations)

                entities = await this.modelOptions.repository.find(conditions);
                // console.log("🚀 ~ entities", entities)
            }
            if (entities)
                response[this.modelOptions.getManyResponseField] = entities.map(x => x.toDto(...toDtoParameters));
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    async createOrUpdate(dto: XDTO, ...toDtoParameters: any): Promise<Y> {
        if (!this.checkModelOptions())
            return null;
        const response = new (this.modelOptions.getOneResponse)();
        try {
            let entity: X;
            if (!!dto.id)
                entity = await this.modelOptions.repository.findOne({ where: { id: dto.id } } as FindOneOptions<X>);
            if (!entity) {
                entity = new (this.modelOptions.entity)();
            }
            entity.fromDto(dto);
            const entitySaved = await this.modelOptions.repository.save(entity as any);
            entity = await this.modelOptions.repository.findOne({ where: { id: entitySaved.id }, relations: this.modelOptions.getOneRelations } as FindOneOptions<X>);
            response[this.modelOptions.getOneResponseField] = entity.toDto(...toDtoParameters);
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async delete(ids: string[]) {
        if (!this.checkModelOptions())
            return null;
        const response = new GenericResponse();
        try {
            if (ids && ids.length > 0) {
                await this.modelOptions.repository.delete(ids);
            }
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async deleteOne(id: string) {
        if (!this.checkModelOptions())
            return null;
        const response = new GenericResponse();
        try {
            await this.modelOptions.repository.delete(id);
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async archive(ids: string[]) {
        if (!ids)
            return null;
        const response = new GenericResponse();
        try {
            if (ids && ids.length > 0) {
                for (const id of ids) {
                    const getOneResponse = await this.findOne({ where: { id: id } });
                    if (getOneResponse.success && getOneResponse[this.modelOptions.getOneResponseField]) {
                        getOneResponse[this.modelOptions.getOneResponseField][this.modelOptions.archiveField] = this.modelOptions.archiveFieldValue;
                        await this.createOrUpdate(getOneResponse[this.modelOptions.getOneResponseField]);
                    }
                }
                response.success = true;
            }
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async archiveOne(id: string) {
        if (!id)
            return null;
        const response = new GenericResponse();
        try {
            const getOneResponse = await this.findOne({ where: { id: id } });
            if (getOneResponse.success && getOneResponse[this.modelOptions.getOneResponseField]) {
                getOneResponse[this.modelOptions.getOneResponseField][this.modelOptions.archiveField] = this.modelOptions.archiveFieldValue;
                await this.createOrUpdate(getOneResponse[this.modelOptions.getOneResponseField]);
            }
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async enable(ids: string[]) {
        if (!ids)
            return null;
        const response = new GenericResponse();
        try {
            if (ids && ids.length > 0) {
                for (const id of ids) {
                    const getOneResponse = await this.findOne({ where: { id: id } });
                    if (getOneResponse.success && getOneResponse[this.modelOptions.getOneResponseField]) {
                        getOneResponse[this.modelOptions.getOneResponseField][this.modelOptions.archiveField] = !this.modelOptions.archiveFieldValue;
                        await this.createOrUpdate(getOneResponse[this.modelOptions.getOneResponseField]);
                    }
                }
                response.success = true;
            }
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }

    public async enableOne(id: string) {
        if (!id)
            return null;
        const response = new GenericResponse();
        try {
            const getOneResponse = await this.findOne({ where: { id: id } });
            if (getOneResponse.success && getOneResponse[this.modelOptions.getOneResponseField]) {
                getOneResponse[this.modelOptions.getOneResponseField][this.modelOptions.archiveField] = !this.modelOptions.archiveFieldValue;
                await this.createOrUpdate(getOneResponse[this.modelOptions.getOneResponseField]);
            }
            response.success = true;
        }
        catch (err) {
            response.handleError(err);
        }
        return response;
    }
}