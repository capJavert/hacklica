'use strict';
import {User} from "./user";
import {Session} from "./session";
import {RoleEnum} from "./role.enum";
import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyCRz37M7_LdY0hdsk0hi4BJx0xUp6_yu_4",
  authDomain: "snack-8506c.firebaseapp.com",
  databaseURL: "https://snack-8506c.firebaseio.com",
  projectId: "snack-8506c",
  storageBucket: "snack-8506c.appspot.com",
  messagingSenderId: "427083582904"
};

firebase.initializeApp(config);

const user =  new User();
user.session = new Session("Basic YWRtaW46YWRtaW4=", RoleEnum.Admin);

export const UserInstance = user;

export const Users = [
  {id: 1, name: "Ante Baric", image: "ante.jpg"},
  {id: 2, name: "Antonio Martinovic", image: "sike.jpg"},
  {id: 3, name: "Tomislav Civcija", image: "tomislav.jpg"}
];

export const UserImages = {

};

export const messaging = firebase.messaging();


