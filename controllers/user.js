
let mongoDB = require('../MongoDB') , 
	userSchema =  mongoDB.mongodb.model('userSchema');


const getUserByFacebookId = (id , done) => {

		var query = userSchema.find({'facebookId' : id});
		query.exec(function(err , users){

			if(err)
			{
			
				done(err , null);
				console.log("get user error :" , err);
			}
			else
			{
				console.log("retTTTTT users" , users );
				done(null ,users[0]);
			}

		});
};



const createUser = (user , done) =>{

	
	let a = new userSchema();
	a.name = user.name;
	a.age = user.age;
	a.facebookId = user.facebookId ;

	a.image = "https://www.telegraph.co.uk/content/dam/science/2017/10/22/TELEMMGLPICT000144108354_trans_NvBQzQNjv4BqZqbNnzMENeQWOPqPMX-4IhRy7TN-7bbEnHI_PZtKCtQ.jpeg?imwidth=450"

	a.save(function(err , user){

		if (err)
		{
			done(err , null);
			console.log("create user error " , err);
		}
		else
		{
			done(null , user);
			console.log("created user!" , user);
		}

	});
}




exports.getUserByFacebookId = getUserByFacebookId;
exports.createUser = createUser;