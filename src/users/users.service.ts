import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/createUser.input';
import { generateUserId } from 'src/utility/helpers';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/updateUser.input';
import { UserModel } from './models/user.model';
import { FindUsersInput } from './dto/getUsers.input';
import { buildWhere } from 'src/utility/input-types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private static async hashPassord(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({
      id,
    });
  }

  find(options: FindUsersInput) {
    const findOptions: FindManyOptions<UserModel> = {};

    if (options?.where) findOptions.where = buildWhere(options.where);
    if (options?.order) findOptions.order = options.order;
    if (options?.take) findOptions.take = options.take;
    if (options?.skip) findOptions.skip = options.skip;

    return this.usersRepository.find(findOptions);
  }

  async create(newUserInput: CreateUserInput) {
    if (!newUserInput?.userid)
      newUserInput.userid = generateUserId(
        newUserInput.name?.split?.(' ')?.at?.(0),
      );

    newUserInput.password = await UsersService.hashPassord(
      newUserInput.password,
    );

    const userEntity = this.usersRepository.create(newUserInput);
    return this.usersRepository.save(userEntity);
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password)
      updateUserInput.password = await UsersService.hashPassord(
        updateUserInput.password,
      );

    const user = await this.usersRepository.preload({ id, ...updateUserInput });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return this.usersRepository.save(user);
  }

  async delete(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new BadRequestException();

    return this.usersRepository.softRemove(user);
  }

  async restore(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
      withDeleted: true,
    });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    return this.usersRepository.recover(user);
  }
}
