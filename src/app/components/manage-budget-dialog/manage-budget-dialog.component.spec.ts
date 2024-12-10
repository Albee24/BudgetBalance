import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageBudgetDialogComponent } from './manage-budget-dialog.component';

describe('ManageBudgetDialogComponent', () => {
  let component: ManageBudgetDialogComponent;
  let fixture: ComponentFixture<ManageBudgetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBudgetDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBudgetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
