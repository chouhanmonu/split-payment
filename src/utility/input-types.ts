import { InputType, Field } from '@nestjs/graphql';
import {
  FindOperator,
  ILike,
  In,
  Not,
  MoreThan,
  LessThan,
  MoreThanOrEqual,
  LessThanOrEqual,
  FindOptionsWhere,
} from 'typeorm';

@InputType()
export class StringFilter {
  @Field({ nullable: true }) equals?: string;
  @Field({ nullable: true }) contains?: string;
  @Field({ nullable: true }) startsWith?: string;
  @Field({ nullable: true }) endsWith?: string;
  @Field(() => [String], { nullable: true }) in?: string[];
  @Field(() => [String], { nullable: true }) notIn?: string[];
}

@InputType()
export class NumberFilter {
  @Field({ nullable: true }) equals?: number;
  @Field({ nullable: true }) lt?: number;
  @Field({ nullable: true }) lte?: number;
  @Field({ nullable: true }) gt?: number;
  @Field({ nullable: true }) gte?: number;
  @Field(() => [Number], { nullable: true }) in?: number[];
  @Field(() => [Number], { nullable: true }) notIn?: number[];
}

@InputType()
export class DateFilter {
  @Field({ nullable: true }) equals?: Date;
  @Field({ nullable: true }) before?: Date;
  @Field({ nullable: true }) after?: Date;
}

export function buildStringFilter(
  filter: StringFilter,
): FindOperator<string> | string {
  if (filter.equals) return filter.equals;
  if (filter.contains) return ILike(`%${filter.contains}%`);
  if (filter.startsWith) return ILike(`${filter.startsWith}%`);
  if (filter.endsWith) return ILike(`%${filter.endsWith}`);
  if (filter.in) return In(filter.in);
  if (filter.notIn) return Not(In(filter.notIn));
  throw new Error('Invalid StringFilter');
}

export function buildNumberFilter(
  filter: NumberFilter,
): FindOperator<number> | number {
  if (filter.equals !== undefined) return filter.equals;
  if (filter.lt !== undefined) return LessThan(filter.lt);
  if (filter.lte !== undefined) return LessThanOrEqual(filter.lte);
  if (filter.gt !== undefined) return MoreThan(filter.gt);
  if (filter.gte !== undefined) return MoreThanOrEqual(filter.gte);
  if (filter.in) return In(filter.in);
  if (filter.notIn) return Not(In(filter.notIn));
  throw new Error('Invalid NumberFilter');
}

export function buildDateFilter(filter: DateFilter): FindOperator<Date> | Date {
  if (filter.equals) return filter.equals;
  if (filter.before) return LessThan(filter.before);
  if (filter.after) return MoreThan(filter.after);
  throw new Error('Invalid DateFilter');
}

/**
 * Generic helper that converts GraphQL-style filters (like { contains: 'John' })
 * into a TypeORM-compatible where object.
 */
export function buildWhere<T extends Record<string, any>, Entity>(
  whereInput: T,
): FindOptionsWhere<Entity> {
  const where: Record<string, any> = {};

  for (const [key, value] of Object.entries(whereInput || {})) {
    if (!value) continue;
    if (
      ('equals' in value && typeof value.equals === 'string') ||
      'contains' in value ||
      'startsWith' in value ||
      'endsWith' in value ||
      'in' in value ||
      'notIn' in value
    ) {
      where[key] = buildStringFilter(value as StringFilter);
    } else if (
      'equals' in value ||
      'lt' in value ||
      'gt' in value ||
      'lte' in value ||
      'gte' in value
    ) {
      where[key] = buildNumberFilter(value as NumberFilter);
    } else if ('before' in value || 'after' in value) {
      where[key] = buildDateFilter(value as DateFilter);
    } else {
      where[key] = value;
    }
  }

  return where as FindOptionsWhere<Entity>;
}
