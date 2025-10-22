import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingularRecipe } from './singular-recipe';

describe('SingularRecipe', () => {
  let component: SingularRecipe;
  let fixture: ComponentFixture<SingularRecipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingularRecipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingularRecipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
