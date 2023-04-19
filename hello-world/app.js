let response;

exports.lambdaHandler = async (event, context) => {
    const USERS = [
        { 'name' : 'Jane',  'user_id' : 1},
        { 'name' : 'John', 'user_id' : 2},
        { 'name' : 'Juliet', 'user_id' : 3},
        { 'name' : 'James',  'user_id' : 4}
    ];
    
    try {
        // Log to view full Http request in Cloudwatch
        console.log(event);

        let result = '';

        // which event/API has been called in the Lambda
        if (event.routeKey === 'GET /user') {
            let start = 0; let end = USERS.length;

            // Validation 
            if (event.queryStringParameters){
                if (event.queryStringParameters.start >= 0){
                    start = event.queryStringParameters.start
                }
                if (event.queryStringParameters.end <= USERS.length){
                    end = event.queryStringParameters.end
                }
            }
            if (start < end) {
                result = JSON.stringify(USERS.slice(start, end));
            } else {
                result = JSON.stringify(USERS.slice(0, USERS.length)); 
            }
        } 
        // creating a new user
        else if (event.routeKey === 'POST /user') {
            USERS.push(JSON.parse(event.body));
            result = JSON.stringify(USERS);
        }
        // single user by id
        else if (event.routeKey === 'GET /user/{id}'){
            const user = USERS.find(e => e.user_id == event.pathParameters.id);
            if (user) {
                result = `Hello ${user.name}`
            } else {
                result = 'User not found'
            }
        }
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: result,
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
