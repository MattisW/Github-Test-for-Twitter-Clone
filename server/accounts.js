AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configure({
    // Behavior
    confirmPassword: false,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: true,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'datenschutz',
    termsUrl: 'nutzungsbedingungen',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Texts
    texts: {
      button: {
          signUp: "Jetzt registrieren!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
    },
});

AccountsTemplates.addFields([
  {
      _id: 'name',
      type: 'text',
      required: true,
      displayName: "Vollständiger Name"
      // errStr: 'Bitte deinen Vor- und Nachnamen',
  },
  {
      _id: "username",
      type: "text",
      displayName: "Benutzername",
      required: true,
      minLength: 5,
  }
]);
