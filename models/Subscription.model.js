import mongoose, { mongo } from "mongoose";
import { string } from "zod";


const subscriptionSchema = new mongoose.Schema(
     {
          student:{
               type:mongoose.Schema.Types.ObjectId,
               ref:"StudentProfile",
               required:true,
          },
          teacher:{
               type:mongoose.Schema.Types.ObjectId,
               ref:"TeacherProfile",
               required:true,
          },
          subject:{
               type:String,
               required:true,
          },
amount:{
     type:Number,
     required:true
},
paid:{
     type:Boolean,
     required:true
},

status:{
     type:String,
     enum:["active","grace","expired"],
     default:"active"
},

startDate:{
     type:Date,
     default:Date.now()
},

endDate:{
     type:Date,
     required:true

},
graceEndDate:{
type:Date,
default:0

},
mode:{
type:string,

}
,
//tracting payment Transaction
transactionId:{type:String},
     },

     {timestamps:true},

);

const Subscription = mongoose.models.Subscription || 
mongoose.model("Subscription",subscriptionSchema);

export default Subscription;