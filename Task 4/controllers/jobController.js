import jobsModel from "../models/jobsModel.js";
//for object id
import mongoose from "mongoose";
import moment from "moment";


//Create job
export const jobController = async (req, res,next) => {
    const {company, position} = req.body
    
    if(!company || !position){
        next('pls Provide All fields')
    }
    req.body.createdBy = req.user.userId
    const job = await jobsModel.create(req.body);
    res.status(201).json({job});

};

//Get jobs
export const getAllJobs = async (req, res, next) => {
    const {status,workType, search, sort } = req.query
    //seaching filter condition
    const queryObject = {
        createdBy:req.user.userId
    }
    //logic for filter
    if(status && status !== 'all'){
        queryObject.status = status
    }

    if(workType && workType !== 'all'){
        queryObject.workType = workType;
    }

    if(search){
        queryObject.position = {$regex:search, $options:'i'};
    }

    let queryResult = jobsModel.find(queryObject);
    //sort
    if(sort ==='latest'){
        queryResult = queryResult.sort('-createdAt');
    }
    if(sort ==='oldest'){
        queryResult = queryResult.sort('createdAt');
    }
    if(sort ==='z-a'){
        queryResult = queryResult.sort('-position');
    }
    if(sort ==='a-z'){
        queryResult = queryResult.sort('position');
    }

    //pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit

    queryResult = queryResult.skip(skip).limit(limit)

    //count
    const totalJobs = await jobsModel.countDocuments(queryResult)
    const numOfPage = Math.ceil(totalJobs/limit)

    const jobs = await queryResult;
   // const jobs = await jobsModel.find({createdBy:req.user.userId})
    res.status(200).json({
        totalJobs,
        jobs,
        numOfPage
    });

};

// update jobs
export const updateJobController = async (req, res, next) => {
    const {id} = req.params
    const {company, position} = req.body

    if(!company || !position){
        next('Plz Provide All Fields')
    }
    //find job by id
    const job = await jobsModel.findOne({_id:id})
    if(!job){
        next(` Sorry! NO Job Founds on this Id ${id} `)
    }

    if(!req.user.userId === job.createdBy.toString()){
      next('Your are NOt Eligable to update this job')
      return;
    }

    const updateJob = await jobsModel.findOneAndUpdate({_id:id}, req.body, {
        new:true,
        runValidators:true
    })

    //response send
    res.status(200).json({updateJob});

};

//Delete Jobs
export const deleteJobController = async (req, res, next) => {
    const {id} = req.params

    //find job through id
    const job = await jobsModel.findOne({_id:id})

    if(!job){
        next(`No Job Found on this Id ${id}`)
    }
    
    if(!req.user.userId === job.createdBy.toString()){
        next('Your Not Authorize to delete this job')
        return
    }
    await job.deleteOne()
    res.status(200).json({
        message:"Success! Job Deleted"
    });
};

//Job Filter
export const jobFilterController = async (req, res) => {
    const stats = await jobsModel.aggregate([
        //search by job
        {
            $match:{
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group:{
                _id:'$status', count:{$sum:1}

            },
        },
    ]);

    //default stats
    const defaultStats = {
        pending: stats.pending || 0,
        reject:stats.reject || 0,
        interview:stats.interview || 0
    };

    //monthly or early filter
    let monthlyApplication = await jobsModel.aggregate([
        {
            $match:{
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group:{
                _id:{
                    year:{$year:'$createdAt'},
                    month:{$month:'$createdAt'}
                },
                count:{
                    $sum:1,
                }
            }
        }
    ])
    monthlyApplication = monthlyApplication.map(item => {
        const {_id:{year, month}, count} = item
        const date = moment().month(month -1).year(year).format('MMM Y')
        return {date, count}
    })
    .reverse();

    res.status(200).json({ totalJobs:stats.length, defaultStats, monthlyApplication });
};