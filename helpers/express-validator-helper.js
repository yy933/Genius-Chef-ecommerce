const { checkSchema, checkExact } = require('express-validator')

const signUpValidationSchema = checkExact(checkSchema({
  name: {
    notEmpty: {
      errorMessage: 'Name is required.'
    },
    isString: {
      errorMessage: 'Please provide a valid name.'
    },
    trim: true
  },
  email: {
    notEmpty: {
      errorMessage: 'Email is required.'
    },
    isEmail: {
      errorMessage: 'Please provide a valid email.'
    },
    isString: {
      errorMessage: 'Please check the format of field email.'
    },
    normalizeEmail: {
      options: { gmail_remove_subaddress: true }
    },
    trim: true
  },
  password: {
    notEmpty: { errorMessage: 'Password is required' },
    isString: { errorMessage: 'password should be a string' },
    isLength: {
      options: { min: 8, max: 16 },
      errorMessage: 'The password must contain at least 8 and maximum 16 characters.'
    },
    matches: {
      options: /^(?=.*\d)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/,
      errorMessage: 'The password must contain at least 8 and maximum 16 characters, including at least 1 uppercase, 1 lowercase, and one number.'
    },
    trim: true
  },
  confirmPassword: {
    notEmpty: { errorMessage: 'Confirm password is required' },
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: 'Make sure password and confirm password match!'
    },
    trim: true
  }
}))

const emailValidationSchema = checkExact(checkSchema({
  email: {
    notEmpty: {
      errorMessage: 'Email is required.'
    },
    isEmail: {
      errorMessage: 'Please provide a valid email.'
    },
    isString: {
      errorMessage: 'Please check the format of field email.'
    },
    normalizeEmail: {
      options: { gmail_remove_subaddress: true }
    },
    trim: true
  }
}))

const passwordValidationSchema = checkSchema({
  password: {
    notEmpty: { errorMessage: 'Password is required' },
    isString: { errorMessage: 'password should be a string' },
    isLength: {
      options: { min: 8, max: 16 },
      errorMessage: 'The password must contain at least 8 and maximum 16 characters.'
    },
    matches: {
      options: /^(?=.*\d)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/,
      errorMessage: 'The password must contain at least 8 and maximum 16 characters, including at least 1 uppercase, 1 lowercase, and one number.'
    },
    trim: true
  },
  confirmPassword: {
    notEmpty: { errorMessage: 'Confirm password is required' },
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: 'Make sure password and confirm password match!'
    },
    trim: true
  }

})

module.exports = {
  signUpValidationSchema,
  emailValidationSchema,
  passwordValidationSchema
}
