/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: '[appInputFormat]',
    providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputFormatDirective),
            multi: true
        }],
    standalone: false
})
export class InputFormatDirective implements ControlValueAccessor {

  
   @Input('numbericOnly') numberOnly:boolean = false;
   @Input('alphabetOnly') alphaOnly: boolean = false;

    private onChange!: (val: string) => void;
    private onTouched!: () => void;
    private value!: string;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
    }

    @HostListener('input', ['$event'])
    onInputChange(event: Event) {
      const value = (event.target as HTMLInputElement).value;
      let filteredValue: string = "";
      if(this.numberOnly) {
        filteredValue = numberOnlyFormat(value);
      }else if(this.alphaOnly) {
        filteredValue = alphabetOnlyFormat(value);
      }else {
        filteredValue = value;
      }
       
      this.updateTextInput(filteredValue, this.value !== filteredValue);
    }

    @HostListener('blur')
    onBlur() {
        this.onTouched();
    }

    private updateTextInput(value: string, propagateChange: boolean) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
        if (propagateChange) {
            this.onChange(value);
        }
        this.value = value;
    }

    // ControlValueAccessor Interface
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    writeValue(value: any): void {
        value = value ? String(value) : '';
        this.updateTextInput(value, false);
    }
}

function numberOnlyFormat(value: string): string {
  return value.replace(/[^0-9]*/g, '');
}

function alphabetOnlyFormat(value: string): string {
  return value.replace(/[^a-zA-Z ]*/g, '');
}