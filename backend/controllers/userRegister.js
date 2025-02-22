


async function handleUserRegister(info){
    try {
        const { username, email, password } = info;
        const user = await User.create({ username, email, password });
        if (!username || !email || !password) {
            throw new Error("Please add all fields");
          }

        // mogoose method to check user exists or not 
        // mongoose methods to create new user
    } catch (error) {
        console.log(error);
        return error;
    }
}