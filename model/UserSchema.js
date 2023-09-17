const mongoose = require("mongoose");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
  username:{
      type:Number,
      require:true,
    
  },
  name:{
      type:String,
      require:true
  },
  email:{
      type:String,
      required:'Email address is required',
      

  },
  password:{
      type:String,
      required:true
  },
  cpassword:{
    type:String,
    requried:true
  },
  number:{
      type:Number,
      require:[true,'What is your contact number?']

  },
  tokens:[
    {
        token:{
            type:String,
            required:true
        }
    }
  ]
});


// we are hashing the password
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12);
        this.cpassword=await bcrypt.hash(this.cpassword,12);
    }
    next();
});

//we are generating token
userSchema.methods.generateAuthToken=async function(){
    try{
        let tokenT=jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:tokenT});
        await this.save();
        return tokenT;
    }catch(err){
        console.log(err);
    }
}


module.exports = mongoose.model("users", userSchema);