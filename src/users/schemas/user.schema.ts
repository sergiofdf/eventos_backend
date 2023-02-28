import { EventRole } from './../../shared/models/event-role.model';
import { UserDependent } from './../../shared/models/user-dependent.model';
import { UserRole } from './../../shared/models/user-role.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'usuarios' })
export class User {
  constructor(user?: Partial<User>) {
    this._id = user?._id;
    this.email = user?.email;
    this.password = user?.password;
    this.name = user?.name;
    this.phoneNumber = user?.phoneNumber;
    this.eventRoles = user?.eventRoles;
    this.role = user?.role;
    this.dependents = user?.dependents;
  }

  @Prop()
  _id: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop()
  eventRoles: EventRole[];

  @Prop({ default: 3 })
  role: UserRole;

  @Prop([UserDependent])
  dependents: UserDependent[];
}

export const UserSchema = SchemaFactory.createForClass(User);
