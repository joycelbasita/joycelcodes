// Create any javascript program with minimum 3 variables or properties,
// 3 arrays, 3 conditionals, 3 loops,
// 4 classes, 4 objects, 2 consturctors,
// 5 methods, 2 object literals, 2 encapsulation,
// 1 abstraction, 2 inheritance


// SCHOOL LIBRARY SYSTEM
// ADI IT 2 OBJECT LITERALS
const school = {
    name: "Northwest Samar State University",
    location: "Calbayog City"
};

const libraryInfo = {
    name: "School Library",
    openTime: "8:00 AM"
};

// ABSTRACTION ADI

class Person {

    // CONSTRUCTOR 1 ADI
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // METHOD 1 ADI
    displayInfo() {
        console.log("Name: " + this.name);
        console.log("Age: " + this.age);
    }

    getRole() {
        throw new Error("getRole() must be implemented by the child class.");
    }
}

// ADI AN INHERITANCE 1
// ADI AN ENCAPSULATION 1

class Student extends Person {

    #studentID;

    // CONSTRUCTOR 2 ADI
    constructor(name, age, studentID) {
        super(name, age);
        this.#studentID = studentID;
    }

    // METHOD 2 ADI
    getRole() {
        return "Student";
    }

    // METHOD 3 ADI
    borrowBook(book) {
        console.log(this.name + " borrowed " + book);
    }

    getStudentID() {
        return this.#studentID;
    }
}


// ADI AN INHERITANCE 2
// ADI AN ENCAPSULATION 2

class Teacher extends Person {

    #employeeID;

    constructor(name, age, employeeID) {
        super(name, age);
        this.#employeeID = employeeID;
    }

    // METHOD 4 ADI
    getRole() {
        return "Teacher";
    }

    // METHOD 5 ADI
    returnBook(book) {
        console.log(this.name + " returned " + book);
    }

    getEmployeeID() {
        return this.#employeeID;
    }
}



class Library {

    constructor(name) {
        this.name = name;

        // ARRAY 1 ADI
        this.books = [
            "JavaScript Basics",
            "HTML and CSS",
            "Computer Science"
        ];
    }

    // METHOD 6 ADI
    addBook(book) {
        this.books.push(book);
        console.log(book + " was added to the library.");
    }

    // METHOD 7 ADI
    showBooks() {
        for (let i = 0; i < this.books.length; i++) {
            console.log((i + 1) + ". " + this.books[i]);
        }
    }
}


// 4 OBJECTS ADI

const student1 = new Student("Joycel", 20, "22-01536");

const teacher1 = new Teacher("Mr. Yuri Ortiz", 25, "0000");

const library1 = new Library("School Library");

const student2 = new Student("Odeza", 21, "22-01535");


// ADI AN 3 ARRAYS
const books = [
    "JavaScript Basics",
    "HTML and CSS",
    "Computer Science"
];

const students = [
    "Joycel",
    "Odeza",
    "Sherean"
];

const subjects = [
    "Programming",
    "CS Elec",
    "CS301"
];


//  ADI AN 3 CONDITIONALS

if (student1.age >= 18) {
    console.log(student1.name + " is an adult student.");
}

if (books.length > 0) {
    console.log("The library has books.");
}

if (student1.getRole() === "Student") {
    console.log(student1.name + " is a student.");
}


// ADI AN 3 LOOPS

for (let i = 0; i < books.length; i++) {
    console.log("Book: " + books[i]);
}

for (let i = 0; i < students.length; i++) {
    console.log("Student: " + students[i]);
}

let i = 0;

while (i < subjects.length) {
    console.log("Subject: " + subjects[i]);
    i++;
}


// ADI AN USING HAN OBJECTS NGAN METHODS

console.log("STUDENT INFORMATION");

student1.displayInfo();
console.log("Role: " + student1.getRole());
console.log("Student ID: " + student1.getStudentID());

student1.borrowBook("JavaScript Basics");


console.log("SECOND STUDENT");

student2.displayInfo();
console.log("Role: " + student2.getRole());
console.log("Student ID: " + student2.getStudentID());


console.log("TEACHER INFORMATION");

teacher1.displayInfo();
console.log("Role: " + teacher1.getRole());
console.log("Employee ID: " + teacher1.getEmployeeID());

teacher1.returnBook("JavaScript Basics");


console.log("LIBRARY INFORMATION");

console.log("Library: " + library1.name);

library1.addBook("Python Basics");
library1.showBooks();


console.log("SCHOOL INFORMATION");

console.log("School: " + school.name);
console.log("Location: " + school.location);
console.log("Library: " + libraryInfo.name);
console.log("Opening Time: " + libraryInfo.openTime);