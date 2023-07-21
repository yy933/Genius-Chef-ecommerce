const { checkSchema } = require('express-validator')
const profileOptions = {
  name: {
    notEmpty: {
      errorMessage: 'Name is required.'
    },
    isString: {
      errorMessage: 'Please provide a valid name.'
    },
    trim: true,
    escape: true
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
    trim: true,
    escape: true
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
    trim: true,
    escape: true
  },
  confirmPassword: {
    notEmpty: { errorMessage: 'Confirm password is required' },
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: 'Make sure password and confirm password match!'
    },
    trim: true,
    escape: true
  },
  recurringSub: {
    notEmpty: {
      errorMessage: 'All fields are required.'
    },
    isString: {
      errorMessage: 'Please check the format of field recurring subscription.'
    },
    trim: true,
    escape: true
  }

}

const orderOptions = {
  menu: {
    notEmpty: true,
    isString: true,
    escape: true
  },
  preference: {
    notEmpty: true,
    isString: true,
    escape: true,
    unescape: {
      options: '/'
    }
  },
  servings: {
    notEmpty: true,
    isInt: true,
    escape: true
  },
  meals: {
    notEmpty: true,
    isInt: true,
    escape: true
  },
  totalAmount: {
    notEmpty: true,
    isNumeric: true,
    escape: true
  },
  phone: {
    notEmpty: {
      errorMessage: 'Phone is required.'
    },
    isString: {
      errorMessage: 'Please check the format of field phone.'
    },
    matches: {
      options: /^[0-9 ()#-]+$/,
      errorMessage: 'Phone number should only contain numbers 0-9 and characters ()#-.'
    },
    isLength: {
      options: { max: 20 },
      errorMessage: 'Phone number must contain maximum 20 characters.'
    },
    trim: true,
    escape: true
  },
  address: {
    notEmpty: {
      errorMessage: 'Address is required.'
    },
    isString: {
      errorMessage: 'Please check the format of field address.'
    },
    trim: true,
    escape: true
  },
  preferredDay: {
    notEmpty: true,
    isString: true,
    escape: true
  },
  preferredTime: {
    notEmpty: true,
    isString: true,
    escape: true
  }
}

const contactOptions = {
  message: {
    notEmpty: {
      errorMessage: 'Phone is required.'
    },
    isString: {
      errorMessage: 'Please check the format of field phone.'
    },
    isLength: {
      options: { max: 500 },
      errorMessage: 'Message should contain maximum 500 words.'
    },
    trim: true,
    escape: true
  },
  subject: {
    notEmpty: {
      errorMessage: 'Subject is required.'
    },
    isString: {
      errorMessage: 'Please check the format of field subject.'
    },
    trim: true,
    escape: true
  }

}

const profileValidationSchema = checkSchema({
  name: profileOptions.name,
  email: profileOptions.email,
  password: profileOptions.password,
  confirmPassword: profileOptions.confirmPassword
})

const loginValidationSchema = checkSchema({
  email: profileOptions.email,
  password: profileOptions.password
})

const emailValidationSchema = checkSchema({
  email: profileOptions.email
})

const passwordValidationSchema = checkSchema({
  password: profileOptions.password,
  confirmPassword: profileOptions.confirmPassword
})

const manageSettingValidationSchema = checkSchema({
  name: profileOptions.name,
  email: profileOptions.email,
  recurringSub: profileOptions.recurringSub
})

const orderValidationSchema = checkSchema({
  menu: orderOptions.menu,
  preference: orderOptions.preference,
  servings: orderOptions.servings,
  meals: orderOptions.meals,
  totalAmount: orderOptions.totalAmount,
  name: profileOptions.name,
  phone: orderOptions.phone,
  email: profileOptions.email,
  address: orderOptions.address,
  preferredDay: orderOptions.preferredDay,
  preferredTime: orderOptions.preferredTime
})

const contactValidationSchema = checkSchema({
  name: profileOptions.name,
  email: profileOptions.email,
  subject: contactOptions.subject,
  message: contactOptions.message
})

module.exports = {
  profileValidationSchema,
  loginValidationSchema,
  emailValidationSchema,
  passwordValidationSchema,
  manageSettingValidationSchema,
  orderValidationSchema,
  contactValidationSchema
}
