import { News } from "../models/news.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const submitnews = asynchandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title && !description && !category) {
    throw new ApiError(400, "All the fields are required");
  }

  const news = await News.create({
    title,
    description,
    category,
    authorId: req.user._id,
  });

  if (!news) {
    throw new ApiError(500, "Something went wrong while Submitting the news");
  }

  res
    .status(200)
    .json(new ApiResponse(200, news, "News has been submitted successfully"));
});

const deleteNews = asynchandler(async (req, res) => {
  await News.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "News Article Deleted succesfully"));
});

const fetchNews = asynchandler(async (req, res) => {
  const documents = await News.find({}).sort({ createdAt: -1 });
  
  if (!documents) {
    throw new ApiError(400, "No document fetched");
  }

  res.status(200).json(new ApiResponse(200, documents, "All the news fetched"));
});

const getDetailedNews = asynchandler(async (req, res) => {

  const getdetailedNewsObject = await News.findById(req.params.id)

  const getAuthorDetails = await User.findById(getdetailedNewsObject.authorId).select("-password")

//   const getdetailedNewsObject = await News.aggregate([
//     {
//       $match: {
//         _id: objectId,
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "authorId",
//         foreignField: "_id",
//         as: "newsWithUser",
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         title: 1,
//         description: 1,
//         authorId: 1,
//         newsWithUser: 1,
//       },
//     },
//   ]);
// console.log(getdetailedNewsObject)
//   if (!getdetailedNewsObject.length) {
//     throw new ApiError(400, "News Data not found");
//   }

  res
    .status(200)
    .json(
      new ApiResponse(200, {getdetailedNewsObject, getAuthorDetails}, "News Fetched Successfully")
    );
});

export { submitnews, fetchNews, deleteNews, getDetailedNews };
