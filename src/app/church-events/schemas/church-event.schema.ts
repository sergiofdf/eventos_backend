import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/app/users/schemas/user.schema';

export type ChurchEventDocument = HydratedDocument<ChurchEvent>;

@Schema({ collection: 'eventos' })
export class ChurchEvent {
  constructor(churchEvent?: Partial<ChurchEvent>) {
    this._id = churchEvent?._id;
    this.name = churchEvent?.name;
    this.startTime = churchEvent?.startTime;
    this.endTime = churchEvent?.endTime;
    this.attendants = churchEvent?.attendants;
  }

  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.String, ref: 'User' }] })
  attendants: Partial<User>[];
}

export const ChurchEventSchema = SchemaFactory.createForClass(ChurchEvent);
