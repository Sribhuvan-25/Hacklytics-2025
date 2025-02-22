async function handleUserLogin(info){
    try{
        const {username, password} = info;
        if (!username || !password) {
            throw new Error("Please add all fields");
          }
          //Mongoose to check whether user exists or not
          //Mongoose to check whether password is correct or not


          
    }
}