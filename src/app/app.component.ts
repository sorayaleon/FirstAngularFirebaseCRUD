import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  config: any;
  collection = { count:0, data: []}
  closeResult = '';
  userForm: FormGroup;
  id: string;
  update: boolean;
  idUser: boolean;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private userService: UserService
    ) {}

  ngOnInit(): void {
    this.id="";
    this.update = false;
    this.idUser = false;

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.data.length
    };

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone:  ['', Validators.required]
    })

    this.userService.getUsers().subscribe(res => {
      this.collection.data = res.map((e:any)=> {
        return {
          id: e.payload.doc.id,
          name: e.payload.doc.data().name,
          surname: e.payload.doc.data().surname,
          phone: e.payload.doc.data().phone,
        }
      })
    }), err => {
      console.error(err);
    }
  }

  pageChange(event){
    this.config.currentPage = event;
  }

  getUser(item:any){
    this.userService.getUser(item.id);
  }

  deleteUser (item:any):void{
    this.userService.deleteUser(item.id);
  }

  saveUser ():void {
    this.userService.createUser(this.userForm.value).then(res=> {
      this.userForm.reset();
      this.modalService.dismissAll();
    }).catch(err => {
      console.error(err);
    });
  }

  updateUser(){
    if(this.id !== null || this.id !== undefined){
      this.userService.updateUser(this.id, this.userForm.value).then(res=> {
        this.userForm.reset();
        this.modalService.dismissAll();
      }).catch(err => {
        console.error(err);
      });
    }

  }

  openUser(content, item:any) {
    this.userForm.setValue({
      name: item.name,
      surname: item.surname,
      phone: item.phone
    });

    this.id = item.id;
    this.idUser = true;
    this.update = false;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openUpdate(content, item:any) {
    this.userForm.setValue({
      name: item.name,
      surname: item.surname,
      phone: item.phone
    });

    this.id = item.id;
    this.update = true;
    this.idUser = false;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content) {
    this.update = false;
    this.idUser = false;

    this.userForm.reset();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
