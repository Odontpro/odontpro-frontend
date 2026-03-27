import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Consents } from './consents';

describe('Consents', () => {
  let component: Consents;
  let fixture: ComponentFixture<Consents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Consents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Consents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
