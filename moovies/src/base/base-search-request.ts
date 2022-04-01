import { ApiProperty } from "@nestjs/swagger";
import { FindManyOptions } from "typeorm";
import { IQuery, LinqRepository } from "typeorm-linq-repository";

export class BaseSearchRequest {
    @ApiProperty({
        description: "The start of the request",
        required: false,
        type: Number,
    })
    start?: number;
    @ApiProperty({
        description: "The length of the request",
        required: false,
        type: Number,
    })
    length?: number;
    @ApiProperty({
        description: "order by field",
        required: false,
        type: String,
    })
    orderby?: string;
    @ApiProperty({
        description: "order direction (asc | desc)",
        required: false,
        type: String,
    })
    order?: 'asc' | 'desc';

    @ApiProperty({
        description: "Search",
        required: false,
        type: String,
    })
    search?: string;

    public static getDefaultFindOptions<T>(request: BaseSearchRequest, orderbyExcepts: string[] = []): FindManyOptions<T> {
        if (!request)
            request = {};
        if (!request.start || typeof request.start === 'object')
            request.start = 0;
        if (!request.length || typeof request.length === 'object')
            request.length = 1000;
        let orderObject: any;
        if (request.order && request.orderby) {
            orderObject = {};
            if (!orderbyExcepts || orderbyExcepts.indexOf(request.orderby) === -1)
                orderObject[request.orderby] = request.order.toUpperCase();
        }
        return {
            take: request.length,
            skip: request.start,
            order: orderObject,
        };
    }


    static getLinqOrderByMethod<T extends { id?: string }>(orderby: string, order: 'ASC' | 'DESC', query: IQuery<T, T[], T>): IQuery<T, T[], T> {
        let method: (x: T) => any;
        switch (orderby) {
            case 'id':
                method = (x) => x.id;
                break;
            case 'date':
                method = (x) => (x as any).date;
                break;
            case 'typeId':
                method = (x) => (x as any).typeId;
                break;
            case 'userId':
                method = (x) => (x as any).userId;
                break;
            case 'creationDate':
                method = (x) => (x as any).creationDate;
                break;
            case 'modifDate':
                method = (x) => (x as any).modifDate;
                break;
            case 'order':
                method = (x) => (x as any).order;
                break;
            case 'key':
                method = (x) => (x as any).key;
                break;
            case 'meta':
                method = (x) => (x as any).meta;
                break;
        }
        if (order === 'ASC')
            return query.orderBy(method);
        else
            return query.orderByDescending(method);
    }
    static getDefaultFindOptionsLinq<T extends { id?: string }>(request: BaseSearchRequest, entityType: new () => T): IQuery<T, T[], T> {
        if (!request)
            request = {};
        if (!request.start || typeof request.start === 'object')
            request.start = 0;
        if (!request.length || typeof request.length === 'object')
            request.length = 1000;
        const query = new LinqRepository<T>(entityType).getAll().skip(request.start).take(request.length);
        if (request.orderby)
            return this.getLinqOrderByMethod(request.orderby, request.order.toUpperCase() as any, query);
        else
            return query;
    }
}