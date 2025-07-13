import { Component, Input } from '@angular/core';
import { UserGroupResponse } from '../../../services/userInGroup/dtos/userGroupResponse';

@Component({
  selector: 'app-group-members',
  imports: [],
  templateUrl: './group-members.component.html',
  styleUrl: './group-members.component.scss'
})
export class GroupMembersComponent {
  @Input() userGroup?: UserGroupResponse
}
