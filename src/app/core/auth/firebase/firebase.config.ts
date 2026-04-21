export const firebaseErrors: Record<string, string> = {
    "auth/invalid-credential":
        "The provided credentials are invalid. Please check your information and try again.",
    "auth/network-request-failed":
        "It looks like your internet connection is having issues. Please check your connection and try again.",
    "auth/user-not-found":
        "We couldn't find an account with that email address. Did you maybe mistype it?",
    "auth/wrong-password":
        "The password is incorrect. Please try again or reset your password if you've forgotten it.",
    "auth/email-already-in-use":
        "The email is already in use. Try using a different email or log in if you already have an account.",
    "auth/invalid-email":
        "The email address is not valid. Please make sure it is entered correctly.",
    "auth/weak-password":
        "The password is too weak. Please choose a stronger password.",
    "auth/too-many-requests":
        "You've made too many attempts in a short period of time. Please try again later.",
    "api/missing-token":
        "The authentication token can't be found. Please try again or contact support if the issue persists.",
    "auth/invalid-verification-code":
        "Invalid verification code. Please try again or press resend an SMS.",
    "auth/second-factor-already-in-use":
        "Second factor is already enrolled for this user.",
    "auth/email-not-verified":
        "Please verify your email before continuing.",
    "auth/multi-factor-auth-required":
        "Two-factor authentication is required. Please enter the verification code sent to your phone.",
};
