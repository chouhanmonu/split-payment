import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { JWT_HASH_SALT } from 'src/utility/conts';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  static hashPassord(password: string) {
    return bcrypt.hash(password, JWT_HASH_SALT);
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({
      id,
    });
  }

  find(options: FindUsersInput) {
    const findOptions: FindManyOptions<UserModel> = {};

    if (options?.where) findOptions.where = buildWhere(options.where);
    if (options?.order) findOptions.order = options.order;
    if (options?.take) findOptions.take = options.take;
    if (options?.skip) findOptions.skip = options.skip;

    return this.userRepository.find(findOptions);
  }

  async create(newUserInput: CreateUserInput) {
    if (!newUserInput?.userid)
      newUserInput.userid = generateUserId(
        newUserInput.name?.split?.(' ')?.at?.(0),
      );

    newUserInput.password = await UsersService.hashPassord(
      newUserInput.password,
    );

    const userEntity = this.userRepository.create(newUserInput);
    return this.userRepository.save(userEntity);
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password)
      updateUserInput.password = await UsersService.hashPassord(
        updateUserInput.password,
      );

    const user = await this.userRepository.preload({ id, ...updateUserInput });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return this.userRepository.save(user);
  }

  async delete(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException();

    return this.userRepository.softRemove(user);
  }

  async restore(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      withDeleted: true,
    });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    return this.userRepository.recover(user);
  }
}
