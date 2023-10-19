import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true, 'Company name is Required'],
    },
    position:{
        type:String,
        required:[true, 'Job Position is Required'],
        maxlength:100
    },
    status:{
        type:String,
        enum:['pending', 'reject', 'interview'],
        default:'pending'
    },
    workType:{
        type:String,
        enum:['full-time', 'part-time', 'internship', 'contract'],
        default:'full-time'
    },
    workLocation:{
        type:String,
        default: "Pakistan",
        required:[true, 'work location is required']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    }
}, {timestamps:true}
)

export default mongoose.model('Job', jobSchema)