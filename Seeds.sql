USE employeeDB

INSERT INTO Department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO Role (title, salary, department_id)
VALUES ("Sales Rep", 80000, 1),
("Sales Lead", 100000, 1),
("Lead Engineer", 150000, 2),
("Software Engineer", 120000, 2),
("Account Manager", 160000, 3),
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000, 4);

INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES ("Trevor", "Polischuck", 1, 3),
("Carlyn", "Blevins", 6, 4),
("Sue", "McKellogg", 2, null),
("Ken", "Hoyt", 5, null);

SELECT * FROM employeeDB.Employee;

DELETE FROM Employee WHERE Employee.id = 1;
DELETE FROM Employee WHERE Employee.id = 2;
DELETE FROM Employee WHERE Employee.id = 3;
DELETE FROM Employee WHERE Employee.id = 4;
DELETE FROM Employee WHERE Employee.id = null;

UPDATE Employee
SET manager_id = 8
WHERE manager_id = 3;

UPDATE Employee
SET manager_id = 7
WHERE manager_id = 4;
