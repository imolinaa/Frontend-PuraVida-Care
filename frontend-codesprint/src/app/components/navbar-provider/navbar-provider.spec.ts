import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarProvider } from './navbar-provider';

describe('NavbarProvider', () => {
  let component: NavbarProvider;
  let fixture: ComponentFixture<NavbarProvider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarProvider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
