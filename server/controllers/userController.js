const User = require('../models/userModel');

exports.getStats = async (req, res) => {
    try{
        const total = await User.countDocuments();
        const active = await User.countDocuments({status: "Active"});
        const inactive = await User.countDocuments({status: "Inactive"});

        res.json({total, active, inactive});
    } catch(error){
        res.status(500).json({message: "Error fetch statistics", error: error.message});
    }
};

//search users
exports.searchUsers = async (req, res) => {
    try{
        const query = req.params.query;
        const page = parseInt(req.query.page) || 1; //pagination configures
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const searchQuery = {
            $or: [
                {name: {$regex: query, $options: "i"}},
                {email: {$regex: query, $options: "i"}},
                {phone: {$regex: query, $options: "i"}},
                {status: {$regex: query, $options: "i"}},
            ],
        };

        const users = await User.find(searchQuery).sort({createdAt: -1}).skip(skip).limit(limit);

        const total = await User.countDocuments(searchQuery);

        res.json({
                users,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
        });
    } catch(error){
        res.status(500).json({message: "Error fetch statistics", error: error.message});
    }
};

//get all users
exports.getAllUsers = async (req, res) => {
    try{
        const query = req.params.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const users = await User.find().sort({createdAt: -1}).skip(skip).limit(limit);

        const total = await User.countDocuments();

        res.json({
                users,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
        });

    } catch(error){
        res.status(500).json({message: "Error fetching users", error: error.message});
    }
};

//get single user
exports.getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) 
            return res.status(404).json({message: "User not found."});
        res.json(user);

    } catch(error){
        res.status(500).json({message: "Error getting user", error: error.message});
    }
};

//create user
exports.createUser = async (req, res) => {
    try{
        const {name, email, phone, status} = req.body;

        if(!name || !email || !phone)
            return res.status(400).json({message: "Name, e-mail and phone number are required!"});

        const existingUser = await User.findOne({email});

        if(existingUser)
            return res.status(400).json({message: "E-mail already exist!"});

        const user = new User({
            name,
            email,
            phone,
            status: status || "Active"
        })
        await user.save();
        res.status(201).json({user, message: "Record has been saved."});

    } catch(error){
        res.status(500).json({message: "Error adding user", error: error.message});
    }
};

//update user
exports.updateUser = async (req, res) => {
    try{
        const {name, email, phone, status} = req.body;

        if(email){
            const exists = await User.find({email, _id: {$ne: req.params.id}});
            if(exists.length > 0){
                return res.status(400).json({message: "E-mail already exist!"});
            }
        }

        const user = await User.findByIdAndUpdate(req.params.id, {name, email, phone, status}, {new: true, runValidators: true});

        if(!user)
            return res.status(404).json({message: "User not found."});
        res.json(user);

    } catch(error){
        res.status(500).json({message: "Error updating user", error: error.message});
    }
}

//delete user
exports.deleteUser = async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) 
            return res.status(404).json({message: "User not found."});
        res.json({message: "User successfully deleted.", success: true});

    } catch(error){
        res.status(500).json({message: "Error deleting user", error: error.message});
    }
}