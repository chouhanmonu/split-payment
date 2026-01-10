import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { FindUsersInput } from './dto/get-users.input';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserModel)
  async getUserById(@Args('id') id: number) {
    const result = await this.usersService.findOne(id);
    if (!result) throw new NotFoundException(`User with ID ${id} not found`);

    return result;
  }

  @Query(() => [UserModel])
  async getUsers(@Args('findUserInput') findUsersInput: FindUsersInput) {
    return this.usersService.find(findUsersInput);
  }

  @Mutation(() => UserModel)
  createUser(@Args('newUserInput') newUserInput: CreateUserInput) {
    return this.usersService.create(newUserInput);
  }

  @Mutation(() => UserModel)
  updateUser(
    @Args('id') id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => UserModel)
  deleteUser(@Args('email') email: string, @Args('password') password: string) {
    return this.usersService.delete(email, password);
  }

  @Mutation(() => UserModel)
  restoreUser(@Args('email') email: string) {
    return this.usersService.restore(email);
  }
}
