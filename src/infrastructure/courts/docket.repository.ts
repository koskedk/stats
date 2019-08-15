import { BaseRepository } from '../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDocketRepository } from '../../domain/courts/docket-repository.interface';
import { Docket } from '../../domain/courts/docket';

export class DocketRepository extends BaseRepository<Docket> implements IDocketRepository {

  constructor(@InjectModel(Docket.name)model: Model<Docket>) {
    super(model);
  }
}