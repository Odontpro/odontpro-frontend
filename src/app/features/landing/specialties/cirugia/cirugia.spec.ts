import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cirugia } from './cirugia';

describe('Cirugia', () => {
  let component: Cirugia;
  let fixture: ComponentFixture<Cirugia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cirugia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cirugia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
