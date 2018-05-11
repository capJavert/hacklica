'use strict';
import {User} from "./user";
import {Session} from "./session";
import {RoleEnum} from "./role.enum";

const user =  new User();
user.session = new Session("Basic YWRtaW46YWRtaW4=", RoleEnum.Admin);

export const UserInstance = user;
