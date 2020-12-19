import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getUsers(){
    return this.firestore.collection<User>("users").valueChanges({ idField: 'id' });
  }

  getUser(id:any) {
    return this.firestore.collection("users").doc(id).get();
  }

  createUser(user:any) {
    return this.firestore.collection("users").add(user);
  }

  updateUser(id:any, user:any){
    return this.firestore.collection("users").doc(id).update(user);
  }

  deleteUser(id:any){
    return this.firestore.collection("users").doc(id).delete();
  }
}
