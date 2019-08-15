import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TestDbHelper } from '../../../../../test/test-db.helper';
import { getTestMasterFacilities } from '../../../../../test/test.data';
import { Docket } from '../../../../domain/courts/docket';
import { RegistriesModule } from '../../registries.module';
import { MasterFacility } from '../../../../domain/registries/master-facility';
import { SaveMasterFacilityHandler } from './save-master-facility.handler';
import { SaveMasterFacilityCommand } from '../save-master-facility.command';
import * as uuid from 'uuid';

describe('Save Docket Command Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  let testMasterFacilities: MasterFacility[] = [];
  const dbHelper = new TestDbHelper();
  let liveDocket: Docket;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(dbHelper.url, dbHelper.options),
        RegistriesModule,
      ],
    }).compile();
    testMasterFacilities = getTestMasterFacilities(5);
    await dbHelper.initConnection();
    await dbHelper.seedDb('masterfacilities', testMasterFacilities);

    const saveDocketHandler = module.get<SaveMasterFacilityHandler>(SaveMasterFacilityHandler);

    commandBus = module.get<CommandBus>(CommandBus);
    commandBus.bind(saveDocketHandler, SaveMasterFacilityCommand.name);
  });

  afterAll(async () => {
    await dbHelper.clearDb();
    await dbHelper.closeConnection();
  });

  beforeEach(async () => {
    liveDocket = new Docket('XXX', 'XXX-ZZX');
    await dbHelper.seedDb('masterfacilities', [liveDocket]);
  });

  it('should create Docket', async () => {
    const command = new SaveMasterFacilityCommand(uuid.v1(), 3343, 'Demo');
    const result = await commandBus.execute(command);
    expect(result).not.toBeNull();
    Logger.debug(result);
  });

  it('should modify Docket', async () => {
    const command = new SaveMasterFacilityCommand(liveDocket._id, 101, 'NewTest');
    const result = await commandBus.execute(command);
    expect(result.code).toBe(101);
    expect(result.name).toBe('NewTest');
    expect(result._id).toBe(liveDocket._id);
    Logger.debug(result);
  });

});
