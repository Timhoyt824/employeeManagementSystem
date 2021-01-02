const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const { toNamespacedPath } = require("path");
require("console.table");
require('dotenv').config()

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.myPassword,
    database: "employeeDB"
  });
  
  connection.query = util.promisify(connection.query);
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    start();
  });

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "View All Roles", "Add Role", 
                "View All Departments", "Add Department", "Update Role", "Exit"]
            })
        .then(function(answer) {
        switch (answer.action) {
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "View All Departments":
                viewAllDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Update Role":
                updateEmployee();
                break;
            case "Exit":
                console.log("Until next time!");
        };
        });
    };
    
    async function viewAllEmployees() {
        var query = "SELECT Employee.first_name AS FirstName, Employee.last_name AS LastName, Role.title AS Title, Department.name AS Department, Role.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM Employee LEFT JOIN Role ON Role.id = Employee.role_id LEFT JOIN Department ON Role.department_id = Department.id LEFT JOIN Employee manager ON Employee.manager_id = manager.id;"
        var res = await connection.query(query);
        console.table(res);
        start();
    };
    
    async function addEmployee() {
        var query = "SELECT id,title FROM Role;"
        var rolesResponse = await connection.query(query);
        var roleRes = rolesResponse.map(role => {
            return {
                value: role.id,
                name: role.title
            };
        });
    
        manager = await connection.query("SELECT * FROM employeeDB.Employee;")
        console.table(manager);
        var managerRes = manager.map(manager => {
            return {
                value: manager.id,
                name: manager.last_name
            };
        });
    
        managerRes.unshift({
            name: "No Manager",
            value: null
        });
    
        const empManager = await inquirer
        .prompt({
            name: "manager",
            type: "list",
            message: "Who is this employees manager?",
            choices: managerRes
        });
    
        const empRole = await inquirer
        .prompt({
            name: "role",
            type: "list",
            message: "What is this employees role?",
            choices: roleRes
        });
        
        const empName = await inquirer
        .prompt([{
            name: "first",
            message: "What is this employees first name?",
        },
            {
            name: "last",
            message: "What is this employees last name?"
            }]);
        insertEmployee();
    
            async function insertEmployee() {
                
                let query = connection.query(
                  "INSERT INTO Employee SET ?",
                  {
                    first_name: empName.first,
                    Last_name: empName.last,
                    role_id: empRole.role,
                    manager_id: manager.id
                  },
                await function(err, res) {
                    if (err) throw err;
                    console.log("Employee added successfully!");
                });  
            };
        start();     
    };     
       
        async function viewAllRoles() {
            var query = "SELECT title AS Roles FROM Role;"
            var roleResponse = await connection.query(query);
            console.table(roleResponse);
            start();
        };
    
        async function addRole() {
            const roleName = await inquirer
            .prompt([{
                    type: "input",
                    name: "newRole",
                    message: "What role would you like to add?"
                },
                {
                    type: "number",
                    name: "salary",
                    message: "What is the salary for this role?"
                },
                {
                    type: "number",
                    name: "dept",
                    message: "What is the Department id?"
                }
            ]);
            let query = connection.query(
                "INSERT INTO Role SET ?",
                {
                  title: roleName.newRole, 
                  salary: roleName.salary,
                  department_id: roleName.dept 
                },
              await function(err, res) {
                  if (err) throw err;
                  console.log("Role added successfully!");
                  start();
              }); 
        };
    
        async function addDepartment() {
            const deptName = await inquirer
            .prompt([{
                name: "department",
                message: "What Department would you like to add?",
                },
            ]);
            let query = connection.query(
                "INSERT INTO Department SET ?",
                {
                  name: deptName.department
                },
              await function(err, res) {
                  if (err) throw err;
                  console.log("Department added successfully!");
                  start();
              }); 
        };
    
        async function viewAllDepartments() {
            var query = "SELECT name AS Departments FROM Department;"
            var deptResponse = await connection.query(query);
            console.table(deptResponse);
            start();
        };

    async function updateEmployee() {
            const query = "SELECT * FROM Employee";
            connection.query(query, err, response);
                if (err) throw err;
                inquirer.prompt([
                    {
                 type: "list",
                 name: "update",
                 message: "Which employee are you updating?",
                 choices: ()=> {
                    return response.map(val => val.first_name + " " + val.last_name);
                 }
                },
                {
                    type: "list",
                    name: "role",
                    message: "Choose a new role for this employee",
                    choices: ()=> data.map(val => val.title)
                }
                ]).then(function(response){
                    const firstName = response.update.slice(0, response.update.indexOf(""));
                    const lastName = response.update.slice(response.update.indexOf(" ") + 1, response.update.length);
                    const roleQuery = "SELECT role_id FROM Role WHERE ?";
                    connection.query(roleQuery, {title: response.role}, (err, result) => {
                        if(err) throw err;
                        const updateQuery = "UPDATE Employee SET ? WHERE ? AND ?";
                        connection.query(updateQuery, [{ role_id: result[0].role_id}, {
                        first_name: firstName}, {last_name: lastName}],
                        function (err, result) {
                                if (err)
                                    throw err;
                                console.log("Role Updated!");
                                start();
                            });
                        });
                    });
            };
         
        