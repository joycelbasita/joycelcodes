// Create any javscript program with minimum 10 let variables, 10 const variables, 5 arrow functions,
// 10 template literals, 3 destructured arrays, 3 destructured object literals, 2 arrays using spread operators,
// 2 object literals using spread operator, 2 arrays using .map(), 2 arrays using .filter(),
// 2 object literals using optional chaining

// SCHOOL LIBRARY SYSTEM

// 10 LET VARIABLES INI

let studentName = "Joycel";
let studentAge = 20;
let studentCourse = "BSCS";
let bookTitle = "JavaScript Basics";
let bookPrice = 350;
let libraryName = "NwSSU School Library";
let schoolName = "Northwest Samar State University";
let city = "Calbayog City";
let totalBooks = 10;
let isOpen = true;


// 10 CONST VARIABLES INI

const studentID = "22-01536";
const teacherName = "Mr. Yuri Ortiz";
const teacherID = "0000";
const subject = "Programming";
const semester = "First Semester";
const yearLevel = "Third Year";
const bookAuthor = "Sherean Manahon";
const libraryHours = "8:00 AM - 5:00 PM";
const maxBooks = 5;
const section = "CS-3C";


// 5 ARROW FUNCTIONS INI

const greetStudent = (name) => {
    return `Hello, ${name}!`;
};

const calculateTotal = (price, quantity) => {
    return price * quantity;
};

const getBookInfo = (title, author) => {
    return `${title} was written by ${author}.`;
};

const checkAge = (age) => {
    return age >= 18;
};

const makeAnnouncement = (message) => {
    return `Library Announcement: ${message}`;
};


// 3 DESTRUCTURED ARRAYS INI

const studentData = ["Joycel", 20, "BSCS"];
const [name1, age1, course1] = studentData;

const bookData = ["JavaScript Basics", "Sherean Manahon", 350];
const [title1, author1, price1] = bookData;

const subjectData = ["Programming", "CS301", "First Semester"];
const [subjectName, subjectCode, semesterName] = subjectData;


// 3 DESTRUCTURED OBJECT LITERALS INI

const student = {
    name: "Joycel",
    age: 20,
    course: "BSCS"
};

const {
    name: studentObjectName,
    age: studentObjectAge,
    course: studentObjectCourse
} = student;


const teacher = {
    name: "Mr. Yuri Ortiz",
    id: "0000",
    subject: "Programming"
};

const {
    name: teacherObjectName,
    id: teacherObjectID,
    subject: teacherObjectSubject
} = teacher;


const library = {
    name: "NwSSU School Library",
    location: "Calbayog City",
    hours: "8:00 AM - 5:00 PM"
};

const {
    name: libraryObjectName,
    location: libraryObjectLocation,
    hours: libraryObjectHours
} = library;


// 2 ARRAYS USING SPREAD OPERATOR INI

const oldBooks = [
    "HTML and CSS",
    "Computer Science"
];

const newBooks = [
    "Python Basics",
    "JavaScript Advanced"
];

const allBooks = [
    ...oldBooks,
    ...newBooks
];


const extraBooks = [
    "Database Systems",
    "Networking"
];

const completeBookList = [
    ...allBooks,
    ...extraBooks
];


// 2 OBJECT LITERALS USING SPREAD OPERATOR INI

const basicStudent = {
    name: "Joycel",
    age: 20
};

const completeStudent = {
    ...basicStudent,
    course: "BSCS",
    section: "CS-3C"
};


const basicLibrary = {
    name: "NwSSU School Library",
    location: "Calbayog City"
};

const completeLibrary = {
    ...basicLibrary,
    hours: "8:00 AM - 5:00 PM",
    open: true
};


// 2 ARRAYS USING MAP() INI

const bookNames = [
    "JavaScript",
    "HTML",
    "CSS"
];

const uppercaseBooks = bookNames.map((book) => {
    return book.toUpperCase();
});


const prices = [
    100,
    200,
    300
];

const newPrices = prices.map((price) => {
    return price + 50;
});


// 2 ARRAYS USING FILTER() INI

const ages = [
    15,
    18,
    20,
    21,
    16
];

const adultStudents = ages.filter((age) => {
    return age >= 18;
});


const bookPrices = [
    100,
    250,
    500,
    150,
    700
];

const expensiveBooks = bookPrices.filter((price) => {
    return price >= 500;
});


// 2 OBJECT LITERALS USING OPTIONAL CHAINING INI

const studentAccount = {
    name: "Joycel",
    course: "BSCS",
    contact: {
        email: "joycelbasit@gmail.com"
    }
};

const studentEmail = studentAccount.contact?.email;


const libraryAccount = {
    name: "NwSSU School Library",
    librarian: {
        name: "Mr. Yuri Ortiz"
    }
};

const librarianName = libraryAccount.librarian?.name;


// OUTPUT INI

console.log(`Student Name: ${studentName}`);
console.log(`Student Age: ${studentAge}`);
console.log(`Course: ${studentCourse}`);

console.log("");

console.log(`Book: ${bookTitle}`);
console.log(`Book Price: ₱${bookPrice}`);

console.log("");

console.log(`Library: ${libraryName}`);
console.log(`School: ${schoolName}`);
console.log(`Location: ${city}`);

console.log("");

console.log(`Teacher: ${teacherName}`);
console.log(`Subject: ${subject}`);

console.log("");

console.log(`StudName, Age, Course: ${name1}, ${age1}, ${course1}`);
console.log(`BookTitle, Author, Price: ${title1}, ${author1}, ₱${price1}`);
console.log(`SubName, SubCode, SemName: ${subjectName}, ${subjectCode}, ${semesterName}`);

console.log("");

console.log(
    `Student: ${studentObjectName},
    Age: ${studentObjectAge},
    Course: ${studentObjectCourse}`
);

console.log(
    `Teacher: ${teacherObjectName},
    ID: ${teacherObjectID},
    Subject: ${teacherObjectSubject}`
);

console.log(
    `Library: ${libraryObjectName}, ${libraryObjectLocation}, ${libraryObjectHours}`
);

console.log("");

console.log(`Books: ${allBooks.join(", ")}`);

console.log(
    `Complete book list: ${completeBookList.join(", ")}`
);

console.log("");

console.log(
    `Complete Student: ${completeStudent.name}, ${completeStudent.age}, ${completeStudent.course}, ${completeStudent.section}`
);

console.log(
    `Complete Library: ${completeLibrary.name}, ${completeLibrary.location}, ${completeLibrary.hours}`
);

console.log("");

console.log(
    `Uppercase Books: ${uppercaseBooks.join(", ")}`
);

console.log(
    `New Prices: ${newPrices.map((price) => `₱${price}`).join(", ")}`
);

console.log("");

console.log(
    `Adult Student Ages: ${adultStudents.join(", ")}`
);

console.log(
    `Expensive Book Prices: ${expensiveBooks.map((price) => `₱${price}`).join(", ")}`
);

console.log("");

console.log(`Student Email: ${studentEmail}`);
console.log(`Librarian: ${librarianName}`);

console.log("");

console.log(greetStudent(studentName));
console.log(`Total Price: ₱${calculateTotal(bookPrice, 2)}`);
console.log(getBookInfo(bookTitle, bookAuthor));
console.log(`Adult Student: ${checkAge(studentAge)}`);
console.log(
    makeAnnouncement("Please return your books on time.")
);