import { ChurchEventsRepository } from './church-events.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChurchEvent, ChurchEventSchema } from './schemas/church-event.schema';
import { ChurchEventsService } from './church-events.service';
import { ChurchEventsController } from './church-events.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: ChurchEvent.name, schema: ChurchEventSchema }]), ChurchEventsModule],
  providers: [ChurchEventsService, ChurchEventsRepository],
  controllers: [ChurchEventsController],
})
export class ChurchEventsModule {}
