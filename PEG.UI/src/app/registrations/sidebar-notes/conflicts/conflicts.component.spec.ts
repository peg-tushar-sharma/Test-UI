import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConflictsComponent } from "./conflicts.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NoteService } from "../sidebar-notes.service";

describe("ConflictsComponent", () => {
  let component: ConflictsComponent;
  let fixture: ComponentFixture<ConflictsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConflictsComponent],
      providers: [NoteService],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
