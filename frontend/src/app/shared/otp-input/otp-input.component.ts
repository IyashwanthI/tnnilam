import {
  Component,
  EventEmitter,
  Output,
  ViewChildren,
  QueryList,
  ElementRef,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-otp-input",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="otp-input-group"
      role="group"
      aria-label="One-time password input"
    >
      <input
        *ngFor="let digit of digits; let i = index"
        #otpInput
        type="text"
        inputmode="numeric"
        maxlength="1"
        [attr.aria-label]="'OTP digit ' + (i + 1)"
        [value]="digit"
        (input)="onInput($event, i)"
        (keydown)="onKeydown($event, i)"
        (paste)="onPaste($event)"
        autocomplete="one-time-code"
      />
    </div>
  `,
})
export class OtpInputComponent implements OnInit {
  @Output() otpChange = new EventEmitter<string>();
  @ViewChildren("otpInput") inputs!: QueryList<ElementRef<HTMLInputElement>>;

  digits: string[] = ["", "", "", "", "", ""];

  ngOnInit(): void {}

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, "").slice(-1);
    this.digits[index] = val;
    input.value = val;

    if (val && index < 5) {
      this.focusInput(index + 1);
    }
    this.emit();
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === "Backspace") {
      if (!this.digits[index] && index > 0) {
        this.digits[index - 1] = "";
        this.focusInput(index - 1);
      } else {
        this.digits[index] = "";
      }
      this.emit();
    } else if (event.key === "ArrowLeft" && index > 0) {
      this.focusInput(index - 1);
    } else if (event.key === "ArrowRight" && index < 5) {
      this.focusInput(index + 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted =
      event.clipboardData?.getData("text").replace(/\D/g, "").slice(0, 6) ?? "";
    pasted.split("").forEach((ch, i) => {
      if (i < 6) this.digits[i] = ch;
    });
    const nextEmpty = this.digits.findIndex((d) => !d);
    this.focusInput(nextEmpty === -1 ? 5 : nextEmpty);
    this.emit();
  }

  reset(): void {
    this.digits = ["", "", "", "", "", ""];
    this.focusInput(0);
    this.emit();
  }

  private focusInput(index: number): void {
    setTimeout(() => {
      const inputsArr = this.inputs?.toArray();
      if (inputsArr && inputsArr[index]) {
        inputsArr[index].nativeElement.focus();
      }
    }, 0);
  }

  private emit(): void {
    this.otpChange.emit(this.digits.join(""));
  }
}
