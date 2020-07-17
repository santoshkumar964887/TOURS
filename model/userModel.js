//const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcryptjs');
//const bcrypt = require('bcryptjs');
const userschema=new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
      },
      email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
      },
      photo: String,
      role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
      },
      password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
      },
      passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
    
      },
      passwordChangedAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date,
      active: {
        type: Boolean,
        default: true,
        select: false
      }
});

userschema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  this.password= await bcrypt.hash(this.password,12);
  this.passwordConfirm=undefined;
  next();
});
userschema.methods.confirmpassword = async function(userpass,password){
  return await bcrypt.compare(userpass,password);
}

const tourModel=mongoose.model('user',userschema);
module.exports=tourModel;