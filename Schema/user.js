const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const UserSchema=mongoose.Schema({
    userName: {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

UserSchema.pre('save', async function () {
    if (this.password) {
        const newpass = await bcrypt.hash(this.password, 10)
        this.password = newpass
        console.log("hash", newpass);
    }
})

module.exports=mongoose.model('users',UserSchema)