# Employee Salary Management - Back end

## Installation
1. Create a database 
2. Clone this repo
4. `npm install`
5. `cp .env.example .env`
6. Modify the `.env` with your configuration
7. All the api need APP_SECRET_KEY that should be passed in the header
    header 'Authorization: Bearer APP_SECRET_KEY
8. Execute the command npm start to run this application
9. Execute the command npm test to perform unit test of this application (Unit test case created for all scenarios except upload functionality)

### Get All List of Employees supports pagination, sorting and filter

Request : GET {APP_URL}/api/users

    Optional query paramters can be passed along with the url
    1. limit = 10 (default value for page size)
    2. offset = 0 (default value)
    3. minSalary = 0 (default filter for minimum salary)
    4. maxSalary = 0 (default filter for maximum salary)
    5. filter = any value (searches id, login, name )
    6. sort = id-asc (name-asc,id-desc)

sample request with query param
{APP_URL}/api/users?limit=10&offset=0&sort=salary-desc&maxSalary=5000&minSalary=1000&filter=emp001

### Get Employee with ID

Request: GET {APP_URL}/api/users/:id

### Create Employee

Request: POST {APP_URL}/api/users

sample Body params
{
"id": "emp0020",
"name": "test20",
"login": "hpoter20",
"salary": 4005.00,
"startDate": "2021-01-21"
}

### Edit Employee

Request: PUT {APP_URL}/api/users/:id

{
    "name":"test1",
    "login":"test4",
    "salary":5000.00,
    "startDate":"2021-12-11"
}

### Delete Employee

Request: DELETE {APP_URL}/api/users/:id

### Bulk upload Employee

Request: POST {APP_URL}/api/users//upload 
Attach csv file
Note: I also found that in windows machine when we upload csv file the mime type set to application/vnd.ms-excel
Hence i allow the mimetype to be csv or application/vnd.ms-excel

## Environment on the CMS

The list of environment variables are:
APP_PORT=
APP_SECRET_KEY=
FRONT_END_URL=
MYSQL_HOST=localhost
MYSQL_DATABASE=test
MYSQL_USER=root
MYSQL_PASSWORD=