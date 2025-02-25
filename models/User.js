const mongoose = require ("mongoose")
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
    email : {type : String , required : true , unique : true},
    password : {type: String, required:true},
},{timestamps  : true})

//now hash the password
//no arrow function in mongoose

UserSchema.pre("save" , async function (next) //sets up a pre-save middleware in Mongoose. It means the function will run before each save operation on the UserSchema.
{
    if(!this.isModified("password")) return next() //next --> is a function that must be called to move to the next middleware in the stack.
    
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password , salt)
    next()
})

//now check

UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare (enteredPassword, this.password)
    
}

module.exports = mongoose.model('User',UserSchema)