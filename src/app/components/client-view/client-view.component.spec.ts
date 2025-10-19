import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewComponent } from './client-view.component';

describe('ClientViewComponent', () => {
  let component: ClientViewComponent;
  let fixture: ComponentFixture<ClientViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientViewComponent]
    });
    fixture = TestBed.createComponent(ClientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
