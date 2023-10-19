import express from "express";
import userAuth from "../middelwares/authMiddelware.js";
import { deleteJobController, getAllJobs, jobController, jobFilterController, updateJobController } from "../controllers/jobController.js";


const router = express.Router()

//router
//job post
router.post('/create-job', userAuth, jobController);

//create job get
router.get('/get-job', userAuth, getAllJobs);

//update jobs
router.patch('/update-job/:id', userAuth, updateJobController );

//Delete Jobs
router.delete('/delete-job/:id', userAuth, deleteJobController);

//job filter
router.get('/job-filter', userAuth, jobFilterController );

export default router;