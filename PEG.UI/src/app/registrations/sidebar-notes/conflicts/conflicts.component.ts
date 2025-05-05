import { Component, Input, OnInit } from "@angular/core";
import { CommonMethods } from "../../../shared/common/common-methods";
import { NoteService } from "../sidebar-notes.service";

@Component({
  selector: "app-conflicts",
  templateUrl: "./conflicts.component.html",
  styleUrls: ["./conflicts.component.scss"]
})
export class ConflictsComponent implements OnInit {
  @Input()
  registrationId: number;

  conflictsData = [];

  constructor(private sidebarService: NoteService) {}

  ngOnInit(): void {
    this.sidebarService.getRelatedTrackerClientsByRegistrationId(this.registrationId).subscribe((res) => {
      this.conflictsData = res;
      this.conflictsData = this.conflictsData.sort((a, b) => {
        return CommonMethods.sortConflicts(a?.registrationStageId ?? 0, a, b);
      });
    });
  }
}
