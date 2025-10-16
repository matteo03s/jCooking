import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingularIngredient } from './singular-ingredient';

describe('SingularIngredient', () => {
  let component: SingularIngredient;
  let fixture: ComponentFixture<SingularIngredient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingularIngredient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingularIngredient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
