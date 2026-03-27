import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnarePediatric } from './questionnare-pediatric';

describe('QuestionnarePediatric', () => {
  let component: QuestionnarePediatric;
  let fixture: ComponentFixture<QuestionnarePediatric>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnarePediatric]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionnarePediatric);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
