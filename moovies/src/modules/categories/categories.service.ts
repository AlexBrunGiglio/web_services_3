import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationBaseModelService } from '../../base/base-model.service';
import { CategoryDto, GetCategoriesResponse, GetCategoryResponse } from './category-dto';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService extends ApplicationBaseModelService<Category, CategoryDto, GetCategoryResponse, GetCategoriesResponse> {
    constructor(
        @InjectRepository(Category)
        public readonly repository: Repository<Category>,
    ) {
        super();
        this.modelOptions = {
            getManyResponse: GetCategoriesResponse,
            getOneResponse: GetCategoryResponse,
            getManyResponseField: 'categories',
            getOneResponseField: 'category',
            getOneRelations: ['movies'],
            getManyRelations: ['movies'],
            repository: this.repository,
            entity: Category,
        };
    }
}