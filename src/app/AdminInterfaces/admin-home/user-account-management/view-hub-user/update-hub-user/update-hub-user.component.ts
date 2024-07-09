import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HubUserService } from 'src/app/services/hub-user.service';
import { HubService } from 'src/app/services/hub.service';
import { HubUser } from 'src/app/models/hubUsers';
import { Hub } from 'src/app/models/hubs';

@Component({
  selector: 'app-update-hub-user',
  templateUrl: './update-hub-user.component.html',
  styleUrls: ['./update-hub-user.component.scss']
})
export class UpdateHubUserComponent {
  title = "hub User";
  hubUser: any;
  data: Hub[] = [];


  editForm: FormGroup = new FormGroup({
    hubUserName: new FormControl('', Validators.required),
    hubUserSurname: new FormControl('', Validators.required),
    hubUserNumber: new FormControl('', Validators.required),
    hubUserEmail: new FormControl('', [Validators.required, Validators.email]),
    hubUserPosition: new FormControl('', Validators.required),
    hubId: new FormControl(0, Validators.required),
  })

  constructor(private route: ActivatedRoute, private router: Router, private hubService: HubService, private service: HubUserService) {

    this.Gethubs();
  }

  Gethubs() {
    this.hubService.getHubs().subscribe((result: any[]) => {
      this.data = result;
    })
  }
  
  ngOnInit(): void {

    this.service.getHubUser(+this.route.snapshot.params['id']).subscribe(result => {
      this.hubUser = result
      this.hubUser.hubUserId = +
      this.editForm.patchValue({
        hubUserName: this.hubUser.hubUserName,
        hubUserSurname: this.hubUser.hubUserSurname,
        hubUserNumber: this.hubUser.hubUserNumber,
        hubUserEmail: this.hubUser.hubUserEmail,
        hubUserPosition: this.hubUser.hubUserPosition,
        hubId: this.hubUser.hubId
      });
    })
  }

  //validate form
  validate(name:HTMLInputElement, surname:HTMLInputElement, email:HTMLInputElement, number:HTMLInputElement, position:HTMLInputElement){
    if (name.value.length == 0 || name.value == ''
      || email.value.length == 0 || email.value == ''
      || number.value.length == 0 || number.value == ''
      || position.value.length == 0 || position.value == ''
      || surname.value.length == 0 || surname.value == '') {
      alert("please fill in all input fields");
    }
    else {
      this.edit();
    }
  }

  edit() {
    this.service.editHubUser(this.hubUser.hubUserId, this.editForm.value).subscribe(result => {
      this.back()
    })
  }

  back() {
    return this.router.navigate(['/view-hub-user'])
  }
}
