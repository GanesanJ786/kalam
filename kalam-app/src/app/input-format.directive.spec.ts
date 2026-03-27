import { InputFormatDirective } from './input-format.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('InputFormatDirective', () => {
  it('should create an instance', () => {
    const elementRef = {
      nativeElement: document.createElement('input')
    } as ElementRef;
    const renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['setProperty']);
    const directive = new InputFormatDirective(elementRef, renderer);
    expect(directive).toBeTruthy();
  });
});
