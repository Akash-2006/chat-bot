import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBodyComponent } from './chat-body.component';

describe('ChatBodyComponent', () => {
  let component: ChatBodyComponent;
  let fixture: ComponentFixture<ChatBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should say welcome', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Welcome');
  })
});
