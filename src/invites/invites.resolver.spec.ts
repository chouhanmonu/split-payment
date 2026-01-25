import { Test, TestingModule } from '@nestjs/testing';
import { InvitesResolver } from './invites.resolver';

describe('InvitesResolver', () => {
  let resolver: InvitesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitesResolver],
    }).compile();

    resolver = module.get<InvitesResolver>(InvitesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
