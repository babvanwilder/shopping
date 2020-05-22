import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAddComponent } from './store-add.component';

describe('AddStoreComponent', () => {
  let component: StoreAddComponent;
  let fixture: ComponentFixture<StoreAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
