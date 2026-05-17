import { Injectable, NgZone } from "@angular/core";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  UserCredential,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdezim5HeFd0sVegZZYA1gIAcCuok4sGg",
  authDomain: "yash1290.firebaseapp.com",
  projectId: "yash1290",
  storageBucket: "yash1290.firebasestorage.app",
  messagingSenderId: "677196299502",
  appId: "1:677196299502:web:372f26ed1755bc19e0c7ff",
  measurementId: "G-PETEQNJ1X3",
};

@Injectable({ providedIn: "root" })
export class FirebaseService {
  private app: FirebaseApp;
  private auth: Auth;
  private recaptchaVerifier?: RecaptchaVerifier;
  private confirmationResult?: ConfirmationResult;

  constructor(private ngZone: NgZone) {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
  }

  /**
   * Sets up invisible reCAPTCHA on the given button element ID.
   * Must be called once before sendOtp().
   */
  setupRecaptcha(buttonElementId: string): void {
    // Clear any existing verifier
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = undefined;
    }

    this.recaptchaVerifier = new RecaptchaVerifier(this.auth, buttonElementId, {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved automatically
      },
      "expired-callback": () => {
        console.warn("reCAPTCHA expired, please retry.");
      },
    });
  }

  /**
   * Sends OTP via Firebase to the given mobile number.
   * @param mobile 10-digit Indian mobile number (without +91)
   */
  async sendOtp(mobile: string): Promise<void> {
    if (!this.recaptchaVerifier) {
      throw new Error(
        "reCAPTCHA not initialized. Call setupRecaptcha() first.",
      );
    }
    const phoneNumber = `+91${mobile}`;
    this.confirmationResult = await signInWithPhoneNumber(
      this.auth,
      phoneNumber,
      this.recaptchaVerifier,
    );
  }

  /**
   * Verifies the OTP entered by the user.
   * Returns the Firebase ID token on success.
   */
  async verifyOtp(otp: string): Promise<string> {
    if (!this.confirmationResult) {
      throw new Error("No OTP sent. Call sendOtp() first.");
    }
    const credential: UserCredential =
      await this.confirmationResult.confirm(otp);
    const idToken = await credential.user.getIdToken();
    return idToken;
  }

  /**
   * Clears the reCAPTCHA verifier (call on component destroy).
   */
  clearRecaptcha(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = undefined;
    }
  }

  getAuth(): Auth {
    return this.auth;
  }
}
