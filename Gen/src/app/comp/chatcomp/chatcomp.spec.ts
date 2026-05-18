import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chatcomp } from './chatcomp';

describe('Chatcomp', () => {
  let component: Chatcomp;
  let fixture: ComponentFixture<Chatcomp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chatcomp],
    }).compileComponents();

    fixture = TestBed.createComponent(Chatcomp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
