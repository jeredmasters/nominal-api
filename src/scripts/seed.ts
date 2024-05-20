import { ServiceManager, dependency } from "@foal/core";
import { dataSource } from "../db";
import { DataSource } from "typeorm";
import { OrganisationRepository } from "../app/repositories/organisation.repo";
import { RESPONSE_TYPE } from "../app/const/election";
import { CandidateRepository } from "../app/repositories/candidate.repo";
import { VoterRepository } from "../app/repositories/voter.repo";
import { AdminUserRepository } from "../app/repositories/admin-user.repo";
import { AdminPasscodeRepository } from "../app/repositories/admin-passcode.repo";
import { PASSCODE_TYPE } from "../app/repositories/admin-passcode.repo/admin-passcode.entity";
import { randBool, randEnum, randInt, randPick } from "../app/util/rand";
import { ONE_DAY } from "../app/const/date";
import { RunningRepository } from "../app/repositories/running.repo";
import { ElectionRepository } from "../app/repositories/election.repo";
import { BallotRepository } from "../app/repositories/ballot.repo";
import { ADMIN_ROLE } from "../app/repositories/admin-user.repo/admin-user.entity";
import { CANDIDATE_STATUS } from "../app/repositories/candidate.repo/candidate.entity";
import { ELECTION_MODE, ELECTION_STATUS } from "../app/repositories/election.repo/election.entity";

const surnames_list = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young', 'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips', 'Evans', 'Turner', 'Torres', 'Parker', 'Collins', 'Edwards', 'Stewart', 'Flores', 'Morris', 'Nguyen', 'Murphy', 'Rivera', 'Cook', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bailey', 'Bell', 'Gomez', 'Kelly', 'Howard', 'Ward', 'Cox', 'Diaz', 'Richardson', 'Wood', 'Watson', 'Brooks', 'Bennett', 'Gray', 'James', 'Reyes', 'Cruz', 'Hughes', 'Price', 'Myers', 'Long', 'Foster', 'Sanders', 'Ross', 'Morales', 'Powell', 'Sullivan', 'Russell', 'Ortiz', 'Jenkins', 'Gutierrez', 'Perry', 'Butler', 'Barnes', 'Fisher', 'Henderson', 'Coleman', 'Simmons', 'Patterson', 'Jordan', 'Reynolds', 'Hamilton', 'Graham', 'Kim', 'Gonzales', 'Alexander', 'Ramos', 'Wallace', 'Griffin', 'West', 'Cole', 'Hayes', 'Chavez', 'Gibson', 'Bryant', 'Ellis', 'Stevens', 'Murray', 'Ford', 'Marshall', 'Owens', 'Mcdonald', 'Harrison', 'Ruiz', 'Kennedy', 'Wells', 'Alvarez', 'Woods', 'Mendoza', 'Castillo', 'Olson', 'Webb', 'Washington', 'Tucker', 'Freeman', 'Burns', 'Henry', 'Vasquez', 'Snyder', 'Simpson', 'Crawford', 'Jimenez', 'Porter', 'Mason', 'Shaw', 'Gordon', 'Wagner', 'Hunter', 'Romero', 'Hicks', 'Dixon', 'Hunt', 'Palmer', 'Robertson', 'Black', 'Holmes', 'Stone', 'Meyer', 'Boyd', 'Mills', 'Warren', 'Fox', 'Rose', 'Rice', 'Moreno', 'Schmidt', 'Patel', 'Ferguson', 'Nichols', 'Herrera', 'Medina', 'Ryan', 'Fernandez', 'Weaver', 'Daniels', 'Stephens', 'Gardner', 'Payne', 'Kelley', 'Dunn', 'Pierce', 'Arnold', 'Tran', 'Spencer', 'Peters', 'Hawkins', 'Grant', 'Hansen', 'Castro', 'Hoffman', 'Hart', 'Elliott', 'Cunningham', 'Knight', 'Bradley', 'Carroll', 'Hudson', 'Duncan', 'Armstrong', 'Berry', 'Andrews', 'Johnston', 'Ray', 'Lane', 'Riley', 'Carpenter', 'Perkins', 'Aguilar', 'Silva', 'Richards', 'Willis', 'Matthews', 'Chapman', 'Lawrence', 'Garza', 'Vargas', 'Watkins', 'Wheeler', 'Larson', 'Carlson', 'Harper', 'George', 'Greene', 'Burke', 'Guzman', 'Morrison', 'Munoz', 'Jacobs', 'Obrien', 'Lawson', 'Franklin', 'Lynch', 'Bishop', 'Carr', 'Salazar', 'Austin', 'Mendez', 'Gilbert', 'Jensen', 'Williamson', 'Montgomery', 'Harvey', 'Oliver', 'Howell', 'Dean', 'Hanson', 'Weber', 'Garrett', 'Sims', 'Burton', 'Fuller', 'Soto', 'Mccoy', 'Welch', 'Chen', 'Schultz', 'Walters', 'Reid', 'Fields', 'Walsh', 'Little', 'Fowler', 'Bowman', 'Davidson', 'May', 'Day', 'Schneider', 'Newman', 'Brewer', 'Lucas', 'Holland', 'Wong', 'Banks', 'Santos', 'Curtis', 'Pearson', 'Delgado', 'Valdez', 'Pena', 'Rios', 'Douglas', 'Sandoval', 'Barrett', 'Hopkins', 'Keller', 'Guerrero', 'Stanley', 'Bates', 'Alvarado', 'Beck', 'Ortega', 'Wade', 'Estrada', 'Contreras', 'Barnett', 'Caldwell', 'Santiago', 'Lambert', 'Powers', 'Chambers', 'Nunez', 'Craig', 'Leonard', 'Lowe', 'Rhodes', 'Byrd', 'Gregory', 'Shelton', 'Frazier', 'Becker', 'Maldonado', 'Fleming', 'Vega', 'Sutton', 'Cohen', 'Jennings', 'Parks', 'Mcdaniel', 'Watts', 'Barker', 'Norris', 'Vaughn', 'Vazquez', 'Holt', 'Schwartz', 'Steele', 'Benson', 'Neal', 'Dominguez', 'Horton', 'Terry', 'Wolfe', 'Hale', 'Lyons', 'Graves', 'Haynes', 'Miles', 'Park', 'Warner', 'Padilla', 'Bush', 'Thornton', 'Mccarthy', 'Mann', 'Zimmerman', 'Erickson', 'Fletcher', 'Mckinney', 'Page', 'Dawson', 'Joseph', 'Marquez', 'Reeves', 'Klein', 'Espinoza', 'Baldwin', 'Moran', 'Love', 'Robbins', 'Higgins', 'Ball', 'Cortez', 'Le', 'Griffith', 'Bowen', 'Sharp', 'Cummings', 'Ramsey', 'Hardy', 'Swanson', 'Barber', 'Acosta', 'Luna', 'Chandler', 'Blair', 'Daniel', 'Cross', 'Simon', 'Dennis', 'Oconnor', 'Quinn', 'Gross', 'Navarro', 'Moss', 'Fitzgerald', 'Doyle', 'Mclaughlin', 'Rojas', 'Rodgers', 'Stevenson', 'Singh', 'Yang', 'Figueroa', 'Harmon', 'Newton', 'Paul', 'Manning', 'Garner', 'Mcgee', 'Reese', 'Francis', 'Burgess', 'Adkins', 'Goodman', 'Curry', 'Brady', 'Christensen', 'Potter', 'Walton', 'Goodwin', 'Mullins', 'Molina', 'Webster', 'Fischer', 'Campos', 'Avila', 'Sherman', 'Todd', 'Chang', 'Blake', 'Malone', 'Wolf', 'Hodges', 'Juarez', 'Gill', 'Farmer', 'Hines', 'Gallagher', 'Duran', 'Hubbard', 'Cannon', 'Miranda', 'Wang', 'Saunders', 'Tate', 'Mack', 'Hammond', 'Carrillo', 'Townsend', 'Wise', 'Ingram', 'Barton', 'Mejia', 'Ayala', 'Schroeder', 'Hampton', 'Rowe', 'Parsons', 'Frank', 'Waters', 'Strickland', 'Osborne', 'Maxwell', 'Chan', 'Deleon', 'Norman', 'Harrington', 'Casey', 'Patton', 'Logan', 'Bowers', 'Mueller', 'Glover', 'Floyd', 'Hartman', 'Buchanan', 'Cobb', 'French', 'Kramer', 'Mccormick', 'Clarke', 'Tyler', 'Gibbs', 'Moody', 'Conner', 'Sparks', 'Mcguire', 'Leon', 'Bauer', 'Norton', 'Pope', 'Flynn', 'Hogan', 'Robles', 'Salinas', 'Yates', 'Lindsey', 'Lloyd', 'Marsh', 'Mcbride', 'Owen', 'Solis', 'Pham', 'Lang', 'Pratt', 'Lara', 'Brock', 'Ballard', 'Trujillo', 'Shaffer', 'Drake', 'Roman', 'Aguirre', 'Morton', 'Stokes', 'Lamb', 'Pacheco', 'Patrick', 'Cochran', 'Shepherd', 'Cain', 'Burnett', 'Hess', 'Li', 'Cervantes', 'Olsen', 'Briggs', 'Ochoa', 'Cabrera', 'Velasquez', 'Montoya', 'Roth', 'Meyers', 'Cardenas', 'Fuentes', 'Weiss', 'Wilkins', 'Hoover', 'Nicholson', 'Underwood', 'Short', 'Carson', 'Morrow', 'Colon', 'Holloway', 'Summers', 'Bryan', 'Petersen', 'Mckenzie', 'Serrano', 'Wilcox', 'Carey', 'Clayton', 'Poole', 'Calderon', 'Gallegos', 'Greer', 'Rivas', 'Guerra', 'Decker', 'Collier', 'Wall', 'Whitaker', 'Bass', 'Flowers', 'Davenport', 'Conley', 'Houston', 'Huff', 'Copeland', 'Hood', 'Monroe', 'Massey', 'Roberson', 'Combs', 'Franco', 'Larsen', 'Pittman', 'Randall', 'Skinner', 'Wilkinson', 'Kirby', 'Cameron', 'Bridges', 'Anthony', 'Richard', 'Kirk', 'Bruce', 'Singleton', 'Mathis', 'Bradford', 'Boone', 'Abbott', 'Charles', 'Allison', 'Sweeney', 'Atkinson', 'Horn', 'Jefferson', 'Rosales', 'York', 'Christian', 'Phelps', 'Farrell', 'Castaneda', 'Nash', 'Dickerson', 'Bond', 'Wyatt', 'Foley', 'Chase', 'Gates', 'Vincent', 'Mathews', 'Hodge', 'Garrison', 'Trevino', 'Villarreal', 'Heath', 'Dalton', 'Valencia', 'Callahan', 'Hensley', 'Atkins', 'Huffman', 'Roy', 'Boyer', 'Shields', 'Lin', 'Hancock', 'Grimes', 'Glenn', 'Cline', 'Delacruz', 'Camacho', 'Dillon', 'Parrish', 'Oneill', 'Melton', 'Booth', 'Kane', 'Berg', 'Harrell', 'Pitts', 'Savage', 'Wiggins', 'Brennan', 'Salas', 'Marks', 'Russo', 'Sawyer', 'Baxter', 'Golden', 'Hutchinson', 'Liu', 'Walter', 'Mcdowell', 'Wiley', 'Rich', 'Humphrey', 'Johns', 'Koch', 'Suarez', 'Hobbs', 'Beard', 'Gilmore', 'Ibarra', 'Keith', 'Macias', 'Khan', 'Andrade', 'Ware', 'Stephenson', 'Henson', 'Wilkerson', 'Dyer', 'Mcclure', 'Blackwell', 'Mercado', 'Tanner', 'Eaton', 'Clay', 'Barron', 'Beasley', 'Oneal', 'Small', 'Preston', 'Wu', 'Zamora', 'Macdonald', 'Vance', 'Snow', 'Mcclain', 'Stafford', 'Orozco', 'Barry', 'English', 'Shannon', 'Kline', 'Jacobson', 'Woodard', 'Huang', 'Kemp', 'Mosley', 'Prince', 'Merritt', 'Hurst', 'Villanueva', 'Roach', 'Nolan', 'Lam', 'Yoder', 'Mccullough', 'Lester', 'Santana', 'Valenzuela', 'Winters', 'Barrera', 'Orr', 'Leach', 'Berger', 'Mckee', 'Strong', 'Conway', 'Stein', 'Whitehead', 'Bullock', 'Escobar', 'Knox', 'Meadows', 'Solomon', 'Velez', 'Odonnell', 'Kerr', 'Stout', 'Blankenship', 'Browning', 'Kent', 'Lozano', 'Bartlett', 'Pruitt', 'Buck', 'Barr', 'Gaines', 'Durham', 'Gentry', 'Mcintyre', 'Sloan', 'Rocha', 'Melendez', 'Herman', 'Sexton', 'Moon', 'Hendricks', 'Rangel', 'Stark', 'Lowery', 'Hardin', 'Hull', 'Sellers', 'Ellison', 'Calhoun', 'Gillespie', 'Mora', 'Knapp', 'Mccall', 'Morse', 'Dorsey', 'Weeks', 'Nielsen', 'Livingston', 'Leblanc', 'Mclean', 'Bradshaw', 'Glass', 'Middleton', 'Buckley', 'Schaefer', 'Frost', 'Howe', 'House', 'Mcintosh', 'Ho', 'Pennington', 'Reilly', 'Hebert', 'Mcfarland', 'Hickman', 'Noble', 'Spears', 'Conrad', 'Arias', 'Galvan', 'Velazquez', 'Huynh', 'Frederick', 'Randolph', 'Cantu', 'Fitzpatrick', 'Mahoney', 'Peck', 'Villa', 'Michael', 'Donovan', 'Mcconnell', 'Walls', 'Boyle', 'Mayer', 'Zuniga', 'Giles', 'Pineda', 'Pace', 'Hurley', 'Mays', 'Mcmillan', 'Crosby', 'Ayers', 'Case', 'Bentley', 'Shepard', 'Everett', 'Pugh', 'David', 'Mcmahon', 'Dunlap', 'Bender', 'Hahn', 'Harding', 'Acevedo', 'Raymond', 'Blackburn', 'Duffy', 'Landry', 'Dougherty', 'Bautista', 'Shah', 'Potts', 'Arroyo', 'Valentine', 'Meza', 'Gould', 'Vaughan', 'Fry', 'Rush', 'Avery', 'Herring', 'Dodson', 'Clements', 'Sampson', 'Tapia', 'Bean', 'Lynn', 'Crane', 'Farley', 'Cisneros', 'Benton', 'Ashley', 'Mckay', 'Finley', 'Best', 'Blevins', 'Friedman', 'Moses', 'Sosa', 'Blanchard', 'Huber', 'Frye', 'Krueger', 'Bernard', 'Rosario', 'Rubio', 'Mullen', 'Benjamin', 'Haley', 'Chung', 'Moyer', 'Choi', 'Horne', 'Yu', 'Woodward', 'Ali', 'Nixon', 'Hayden', 'Rivers', 'Estes', 'Mccarty', 'Richmond', 'Stuart', 'Maynard', 'Brandt', 'Oconnell', 'Hanna', 'Sanford', 'Sheppard', 'Church', 'Burch', 'Levy', 'Rasmussen', 'Coffey', 'Ponce', 'Faulkner', 'Donaldson', 'Schmitt', 'Novak', 'Costa', 'Montes', 'Booker', 'Cordova', 'Waller', 'Arellano', 'Maddox', 'Mata', 'Bonilla', 'Stanton', 'Compton', 'Kaufman', 'Dudley', 'Mcpherson', 'Beltran', 'Dickson', 'Mccann', 'Villegas', 'Proctor', 'Hester', 'Cantrell', 'Daugherty', 'Cherry', 'Bray', 'Davila', 'Rowland', 'Madden', 'Levine', 'Spence', 'Good', 'Irwin', 'Werner', 'Krause', 'Petty', 'Whitney', 'Baird', 'Hooper', 'Pollard', 'Zavala', 'Jarvis', 'Holden', 'Haas', 'Hendrix', 'Mcgrath', 'Bird', 'Lucero', 'Terrell', 'Riggs', 'Joyce', 'Mercer', 'Rollins', 'Galloway', 'Duke', 'Odom', 'Andersen', 'Downs', 'Hatfield', 'Benitez', 'Archer', 'Huerta', 'Travis', 'Mcneil', 'Hinton', 'Zhang', 'Hays', 'Mayo', 'Fritz', 'Branch', 'Mooney', 'Ewing', 'Ritter', 'Esparza', 'Frey', 'Braun', 'Gay', 'Riddle', 'Haney', 'Kaiser', 'Holder', 'Chaney', 'Mcknight', 'Gamble', 'Vang', 'Cooley', 'Carney', 'Cowan', 'Forbes', 'Ferrell', 'Davies', 'Barajas', 'Shea', 'Osborn', 'Bright', 'Cuevas', 'Bolton', 'Murillo', 'Lutz', 'Duarte', 'Kidd', 'Key', 'Cooke']

const male_names_list = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Charles', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Paul', 'Mark', 'Donald', 'George', 'Kenneth', 'Steven', 'Edward', 'Brian', 'Ronald', 'Anthony', 'Kevin', 'Jason', 'Matthew', 'Gary', 'Timothy', 'Jose', 'Larry', 'Jeffrey', 'Frank', 'Scott', 'Eric', 'Stephen', 'Andrew', 'Raymond', 'Gregory', 'Joshua', 'Jerry', 'Dennis', 'Walter', 'Patrick', 'Peter', 'Harold', 'Douglas', 'Henry', 'Carl', 'Arthur', 'Ryan', 'Roger', 'Joe', 'Juan', 'Jack', 'Albert', 'Jonathan', 'Justin', 'Terry', 'Gerald', 'Keith', 'Samuel', 'Willie', 'Ralph', 'Lawrence', 'Nicholas', 'Roy', 'Benjamin', 'Bruce', 'Brandon', 'Adam', 'Harry', 'Fred', 'Wayne', 'Billy', 'Steve', 'Louis', 'Jeremy', 'Aaron', 'Randy', 'Howard', 'Eugene', 'Carlos', 'Russell', 'Bobby', 'Victor', 'Martin', 'Ernest', 'Phillip', 'Todd', 'Jesse', 'Craig', 'Alan', 'Shawn', 'Clarence', 'Sean', 'Philip', 'Chris', 'Johnny', 'Earl', 'Jimmy', 'Antonio', 'Danny', 'Bryan', 'Tony', 'Luis', 'Mike', 'Stanley', 'Leonard', 'Nathan', 'Dale', 'Manuel', 'Rodney', 'Curtis', 'Norman', 'Allen', 'Marvin', 'Vincent', 'Glenn', 'Jeffery', 'Travis', 'Jeff', 'Chad', 'Jacob', 'Lee', 'Melvin', 'Alfred', 'Kyle', 'Francis', 'Bradley', 'Jesus', 'Herbert', 'Frederick', 'Ray', 'Joel', 'Edwin', 'Don', 'Eddie', 'Ricky', 'Troy', 'Randall', 'Barry', 'Alexander', 'Bernard', 'Mario', 'Leroy', 'Francisco', 'Marcus', 'Micheal', 'Theodore', 'Clifford', 'Miguel', 'Oscar', 'Jay', 'Jim', 'Tom', 'Calvin', 'Alex', 'Jon', 'Ronnie', 'Bill', 'Lloyd', 'Tommy', 'Leon', 'Derek', 'Warren', 'Darrell', 'Jerome', 'Floyd', 'Leo', 'Alvin', 'Tim', 'Wesley', 'Gordon', 'Dean', 'Greg', 'Jorge', 'Dustin', 'Pedro', 'Derrick', 'Dan', 'Lewis', 'Zachary', 'Corey', 'Herman', 'Maurice', 'Vernon', 'Roberto', 'Clyde', 'Glen', 'Hector', 'Shane', 'Ricardo', 'Sam', 'Rick', 'Lester', 'Brent', 'Ramon', 'Charlie', 'Tyler', 'Gilbert', 'Gene', 'Marc', 'Reginald', 'Ruben', 'Brett', 'Angel', 'Nathaniel', 'Rafael', 'Leslie', 'Edgar', 'Milton', 'Raul', 'Ben', 'Chester', 'Cecil', 'Duane', 'Franklin', 'Andre', 'Elmer', 'Brad', 'Gabriel', 'Ron', 'Mitchell', 'Roland', 'Arnold', 'Harvey', 'Jared', 'Adrian', 'Karl', 'Cory', 'Claude', 'Erik', 'Darryl', 'Jamie', 'Neil', 'Jessie', 'Christian', 'Javier', 'Fernando', 'Clinton', 'Ted', 'Mathew', 'Tyrone', 'Darren', 'Lonnie', 'Lance', 'Cody', 'Julio', 'Kelly', 'Kurt', 'Allan', 'Nelson', 'Guy', 'Clayton', 'Hugh', 'Max', 'Dwayne', 'Dwight', 'Armando', 'Felix', 'Jimmie', 'Everett', 'Jordan', 'Ian', 'Wallace', 'Ken', 'Bob', 'Jaime', 'Casey', 'Alfredo', 'Alberto', 'Dave', 'Ivan', 'Johnnie', 'Sidney', 'Byron', 'Julian', 'Isaac', 'Morris', 'Clifton', 'Willard', 'Daryl', 'Ross', 'Virgil', 'Andy', 'Marshall', 'Salvador', 'Perry', 'Kirk', 'Sergio', 'Marion', 'Tracy', 'Seth', 'Kent', 'Terrance', 'Rene', 'Eduardo', 'Terrence', 'Enrique', 'Freddie', 'Wade']

const female_names_list = ['Mary', 'Patricia', 'Linda', 'Barbara', 'Elizabeth', 'Jennifer', 'Maria', 'Susan', 'Margaret', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly', 'Deborah', 'Jessica', 'Shirley', 'Cynthia', 'Angela', 'Melissa', 'Brenda', 'Amy', 'Anna', 'Rebecca', 'Virginia', 'Kathleen', 'Pamela', 'Martha', 'Debra', 'Amanda', 'Stephanie', 'Carolyn', 'Christine', 'Marie', 'Janet', 'Catherine', 'Frances', 'Ann', 'Joyce', 'Diane', 'Alice', 'Julie', 'Heather', 'Teresa', 'Doris', 'Gloria', 'Evelyn', 'Jean', 'Cheryl', 'Mildred', 'Katherine', 'Joan', 'Ashley', 'Judith', 'Rose', 'Janice', 'Kelly', 'Nicole', 'Judy', 'Christina', 'Kathy', 'Theresa', 'Beverly', 'Denise', 'Tammy', 'Irene', 'Jane', 'Lori', 'Rachel', 'Marilyn', 'Andrea', 'Kathryn', 'Louise', 'Sara', 'Anne', 'Jacqueline', 'Wanda', 'Bonnie', 'Julia', 'Ruby', 'Lois', 'Tina', 'Phyllis', 'Norma', 'Paula', 'Diana', 'Annie', 'Lillian', 'Emily', 'Robin', 'Peggy', 'Crystal', 'Gladys', 'Rita', 'Dawn', 'Connie', 'Florence', 'Tracy', 'Edna', 'Tiffany', 'Carmen', 'Rosa', 'Cindy', 'Grace', 'Wendy', 'Victoria', 'Edith', 'Kim', 'Sherry', 'Sylvia', 'Josephine', 'Thelma', 'Shannon', 'Sheila', 'Ethel', 'Ellen', 'Elaine', 'Marjorie', 'Carrie', 'Charlotte', 'Monica', 'Esther', 'Pauline', 'Emma', 'Juanita', 'Anita', 'Rhonda', 'Hazel', 'Amber', 'Eva', 'Debbie', 'April', 'Leslie', 'Clara', 'Lucille', 'Jamie', 'Joanne', 'Eleanor', 'Valerie', 'Danielle', 'Megan', 'Alicia', 'Suzanne', 'Michele', 'Gail', 'Bertha', 'Darlene', 'Veronica', 'Jill', 'Erin', 'Geraldine', 'Lauren', 'Cathy', 'Joann', 'Lorraine', 'Lynn', 'Sally', 'Regina', 'Erica', 'Beatrice', 'Dolores', 'Bernice', 'Audrey', 'Yvonne', 'Annette', 'June', 'Samantha', 'Marion', 'Dana', 'Stacy', 'Ana', 'Renee', 'Ida', 'Vivian', 'Roberta', 'Holly', 'Brittany', 'Melanie', 'Loretta', 'Yolanda', 'Jeanette', 'Laurie', 'Katie', 'Kristen', 'Vanessa', 'Alma', 'Sue', 'Elsie', 'Beth', 'Jeanne', 'Vicki', 'Carla', 'Tara', 'Rosemary', 'Eileen', 'Terri', 'Gertrude', 'Lucy', 'Tonya', 'Ella', 'Stacey', 'Wilma', 'Gina', 'Kristin', 'Jessie', 'Natalie', 'Agnes', 'Vera', 'Willie', 'Charlene', 'Bessie', 'Delores', 'Melinda', 'Pearl', 'Arlene', 'Maureen', 'Colleen', 'Allison', 'Tamara', 'Joy', 'Georgia', 'Constance', 'Lillie', 'Claudia', 'Jackie', 'Marcia', 'Tanya', 'Nellie', 'Minnie', 'Marlene', 'Heidi', 'Glenda', 'Lydia', 'Viola', 'Courtney', 'Marian', 'Stella', 'Caroline', 'Dora', 'Jo', 'Vickie', 'Mattie', 'Terry', 'Maxine', 'Irma', 'Mabel', 'Marsha', 'Myrtle', 'Lena', 'Christy', 'Deanna', 'Patsy', 'Hilda', 'Gwendolyn', 'Jennie', 'Nora', 'Margie', 'Nina', 'Cassandra', 'Leah', 'Penny', 'Kay', 'Priscilla', 'Naomi', 'Carole', 'Brandy', 'Olga', 'Billie', 'Dianne', 'Tracey', 'Leona', 'Jenny', 'Felicia', 'Sonia', 'Miriam', 'Velma', 'Becky', 'Bobbie', 'Violet', 'Kristina', 'Toni', 'Misty', 'Mae', 'Shelly', 'Daisy', 'Ramona', 'Sherri', 'Erika', 'Katrina', 'Claire', 'Lindsey', 'Lindsay', 'Geneva', 'Guadalupe', 'Belinda', 'Margarita', 'Sheryl', 'Cora', 'Faye', 'Ada', 'Natasha', 'Sabrina', 'Isabel', 'Marguerite', 'Hattie', 'Harriet', 'Molly', 'Cecilia', 'Kristi', 'Brandi', 'Blanche', 'Sandy', 'Rosie', 'Joanna', 'Iris', 'Eunice', 'Angie', 'Inez', 'Lynda', 'Madeline', 'Amelia', 'Alberta', 'Genevieve', 'Monique', 'Jodi', 'Janie', 'Maggie', 'Kayla', 'Sonya', 'Jan', 'Lee', 'Kristine', 'Candace', 'Fannie', 'Maryann', 'Opal', 'Alison', 'Yvette', 'Melody', 'Luz', 'Susie', 'Olivia', 'Flora', 'Shelley', 'Kristy', 'Mamie', 'Lula', 'Lola', 'Verna', 'Beulah', 'Antoinette', 'Candice', 'Juana', 'Jeannette', 'Pam', 'Kelli', 'Hannah', 'Whitney', 'Bridget', 'Karla', 'Celia', 'Latoya', 'Patty', 'Shelia', 'Gayle', 'Della', 'Vicky', 'Lynne', 'Sheri', 'Marianne', 'Kara', 'Jacquelyn', 'Erma', 'Blanca', 'Myra', 'Leticia', 'Pat', 'Krista', 'Roxanne', 'Angelica', 'Johnnie', 'Robyn', 'Francis', 'Adrienne', 'Rosalie', 'Alexandra', 'Brooke', 'Bethany', 'Sadie', 'Bernadette', 'Traci', 'Jody', 'Kendra', 'Jasmine', 'Nichole', 'Rachael', 'Chelsea', 'Mable', 'Ernestine', 'Muriel', 'Marcella', 'Elena', 'Krystal', 'Angelina', 'Nadine', 'Kari', 'Estelle', 'Dianna', 'Paulette', 'Lora', 'Mona', 'Doreen', 'Rosemarie', 'Angel', 'Desiree', 'Antonia', 'Hope', 'Ginger', 'Janis', 'Betsy', 'Christie', 'Freda', 'Mercedes', 'Meredith', 'Lynette', 'Teri', 'Cristina', 'Eula', 'Leigh', 'Meghan', 'Sophia', 'Eloise', 'Rochelle', 'Gretchen', 'Cecelia', 'Raquel', 'Henrietta', 'Alyssa', 'Jana', 'Kelley', 'Gwen', 'Kerry', 'Jenna', 'Tricia', 'Laverne', 'Olive', 'Alexis', 'Tasha', 'Silvia', 'Elvira', 'Casey', 'Delia', 'Sophie', 'Kate', 'Patti', 'Lorena', 'Kellie', 'Sonja', 'Lila', 'Lana', 'Darla', 'May', 'Mindy', 'Essie', 'Mandy', 'Lorene', 'Elsa', 'Josefina', 'Jeannie', 'Miranda', 'Dixie', 'Lucia', 'Marta', 'Faith', 'Lela', 'Johanna', 'Shari', 'Camille', 'Tami', 'Shawna', 'Elisa', 'Ebony', 'Melba', 'Ora', 'Nettie', 'Tabitha', 'Ollie', 'Jaime', 'Winifred', 'Kristie', 'Marina', 'Alisha', 'Aimee', 'Rena', 'Myrna', 'Marla', 'Tammie', 'Latasha', 'Bonita', 'Patrice', 'Ronda', 'Sherrie', 'Addie', 'Francine', 'Deloris', 'Stacie', 'Adriana', 'Cheri', 'Shelby', 'Abigail', 'Celeste', 'Jewel', 'Cara', 'Adele', 'Rebekah', 'Lucinda', 'Dorthy', 'Chris', 'Effie', 'Trina', 'Reba', 'Shawn', 'Sallie', 'Aurora', 'Lenora', 'Etta', 'Lottie', 'Kerri', 'Trisha', 'Nikki', 'Estella', 'Francisca', 'Josie', 'Tracie', 'Marissa', 'Karin', 'Brittney', 'Janelle', 'Lourdes', 'Laurel', 'Helene', 'Fern', 'Elva', 'Corinne', 'Kelsey', 'Ina', 'Bettie', 'Elisabeth', 'Aida', 'Caitlin', 'Ingrid', 'Iva', 'Eugenia', 'Christa', 'Goldie', 'Cassie', 'Maude', 'Jenifer', 'Therese', 'Frankie', 'Dena', 'Lorna', 'Janette', 'Latonya', 'Candy', 'Morgan', 'Consuelo', 'Tamika', 'Rosetta', 'Debora', 'Cherie', 'Polly', 'Dina', 'Jewell', 'Fay', 'Jillian', 'Dorothea', 'Nell', 'Trudy', 'Esperanza', 'Patrica', 'Kimberley', 'Shanna', 'Helena', 'Carolina', 'Cleo', 'Stefanie', 'Rosario', 'Ola', 'Janine', 'Mollie', 'Lupe', 'Alisa', 'Lou', 'Maribel', 'Susanne', 'Bette', 'Susana', 'Elise', 'Cecile', 'Isabelle', 'Lesley', 'Jocelyn', 'Paige', 'Joni', 'Rachelle', 'Leola', 'Daphne', 'Alta', 'Ester', 'Petra', 'Graciela', 'Imogene', 'Jolene', 'Keisha', 'Lacey', 'Glenna', 'Gabriela', 'Keri', 'Ursula', 'Lizzie', 'Kirsten', 'Shana', 'Adeline', 'Mayra', 'Jayne', 'Jaclyn', 'Gracie', 'Sondra', 'Carmela', 'Marisa', 'Rosalind', 'Charity', 'Tonia', 'Beatriz', 'Marisol', 'Clarice', 'Jeanine', 'Sheena', 'Angeline', 'Frieda', 'Lily', 'Robbie', 'Shauna', 'Millie', 'Claudette', 'Cathleen', 'Angelia', 'Gabrielle', 'Autumn', 'Katharine', 'Summer', 'Jodie', 'Staci', 'Lea', 'Christi', 'Jimmie', 'Justine', 'Elma', 'Luella', 'Margret', 'Dominique', 'Socorro', 'Rene', 'Martina', 'Margo', 'Mavis', 'Callie', 'Bobbi', 'Maritza', 'Lucile', 'Leanne', 'Jeannine', 'Deana', 'Aileen', 'Lorie', 'Ladonna', 'Willa', 'Manuela', 'Gale', 'Selma', 'Dolly', 'Sybil', 'Abby', 'Lara', 'Dale', 'Ivy', 'Dee', 'Winnie', 'Marcy', 'Luisa', 'Jeri', 'Magdalena', 'Ofelia', 'Meagan', 'Audra', 'Matilda', 'Leila', 'Cornelia', 'Bianca', 'Simone', 'Bettye', 'Randi', 'Virgie', 'Latisha', 'Barbra', 'Georgina', 'Eliza', 'Leann', 'Bridgette', 'Rhoda', 'Haley', 'Adela', 'Nola', 'Bernadine', 'Flossie', 'Ila', 'Greta', 'Ruthie', 'Nelda', 'Minerva', 'Lilly', 'Terrie', 'Letha', 'Hilary', 'Estela', 'Valarie', 'Brianna', 'Rosalyn', 'Earline', 'Catalina', 'Ava', 'Mia', 'Clarissa', 'Lidia', 'Corrine', 'Alexandria', 'Concepcion', 'Tia', 'Sharron', 'Rae', 'Dona', 'Ericka', 'Jami', 'Elnora', 'Chandra', 'Lenore', 'Neva', 'Marylou', 'Melisa', 'Tabatha', 'Serena', 'Avis', 'Allie', 'Sofia', 'Jeanie', 'Odessa', 'Nannie', 'Harriett', 'Loraine', 'Penelope', 'Milagros', 'Emilia', 'Benita', 'Allyson', 'Ashlee', 'Tania', 'Tommie', 'Esmeralda', 'Karina', 'Eve', 'Pearlie', 'Zelma', 'Malinda', 'Noreen', 'Tameka', 'Saundra', 'Hillary', 'Amie', 'Althea', 'Rosalinda', 'Jordan', 'Lilia', 'Alana', 'Gay', 'Clare', 'Alejandra', 'Elinor', 'Michael', 'Lorrie', 'Jerri', 'Darcy', 'Earnestine', 'Carmella', 'Taylor', 'Noemi', 'Marcie', 'Liza', 'Annabelle', 'Louisa', 'Earlene', 'Mallory', 'Carlene', 'Nita', 'Selena', 'Tanisha', 'Katy', 'Julianne', 'John', 'Lakisha', 'Edwina', 'Maricela', 'Margery', 'Kenya', 'Dollie', 'Roxie', 'Roslyn', 'Kathrine', 'Nanette', 'Charmaine', 'Lavonne', 'Ilene', 'Kris', 'Tammi', 'Suzette', 'Corine', 'Kaye', 'Jerry', 'Merle', 'Chrystal', 'Lina', 'Deanne', 'Lilian', 'Juliana', 'Aline', 'Luann', 'Kasey', 'Maryanne', 'Evangeline', 'Colette', 'Melva', 'Lawanda', 'Yesenia', 'Nadia', 'Madge', 'Kathie', 'Eddie', 'Ophelia', 'Valeria', 'Nona', 'Mitzi', 'Mari', 'Georgette', 'Claudine', 'Fran', 'Alissa', 'Roseann', 'Lakeisha', 'Susanna', 'Reva', 'Deidre', 'Chasity', 'Sheree', 'Carly', 'James', 'Elvia', 'Alyce', 'Deirdre', 'Gena', 'Briana', 'Araceli', 'Katelyn', 'Rosanne', 'Wendi', 'Tessa', 'Berta', 'Marva', 'Imelda', 'Marietta', 'Marci', 'Leonor', 'Arline', 'Sasha', 'Madelyn', 'Janna', 'Juliette', 'Deena', 'Aurelia', 'Josefa', 'Augusta', 'Liliana', 'Young', 'Christian', 'Lessie', 'Amalia', 'Savannah', 'Anastasia', 'Vilma', 'Natalia', 'Rosella', 'Lynnette', 'Corina', 'Alfreda', 'Leanna', 'Carey', 'Amparo', 'Coleen', 'Tamra', 'Aisha', 'Wilda', 'Karyn', 'Cherry', 'Queen', 'Maura', 'Mai', 'Evangelina', 'Rosanna', 'Hallie', 'Erna', 'Enid', 'Mariana', 'Lacy', 'Juliet', 'Jacklyn', 'Freida', 'Madeleine', 'Mara', 'Hester', 'Cathryn', 'Lelia', 'Casandra', 'Bridgett', 'Angelita', 'Jannie', 'Dionne', 'Annmarie', 'Katina', 'Beryl', 'Phoebe', 'Millicent', 'Katheryn', 'Diann', 'Carissa', 'Maryellen', 'Liz', 'Lauri', 'Helga', 'Gilda', 'Adrian', 'Rhea', 'Marquita', 'Hollie', 'Tisha', 'Tamera', 'Angelique', 'Francesca', 'Britney', 'Kaitlin', 'Lolita', 'Florine', 'Rowena', 'Reyna', 'Twila', 'Fanny', 'Janell', 'Ines', 'Concetta', 'Bertie', 'Alba', 'Brigitte', 'Alyson', 'Vonda', 'Pansy', 'Elba', 'Noelle', 'Letitia', 'Kitty', 'Deann', 'Brandie', 'Louella', 'Leta', 'Felecia', 'Sharlene', 'Lesa', 'Beverley', 'Robert', 'Isabella', 'Herminia', 'Terra', 'Celina']

const company_names = ['Wave', 'Apex', 'Link', 'Sphere', 'Code', 'Craft', 'Innova', 'Digital Nexus', 'Tech', 'Pulse', 'Cyber', 'Peak', 'Virtuo', 'Inno', 'Sync', 'Fusion', 'Forge', 'Labs', 'Infinite', 'Byte', 'Logic', 'Research']

const election_types = [
    { label: "AGM", type: RESPONSE_TYPE.PREFERENCE },
    { label: "State Election", type: RESPONSE_TYPE.PREFERENCE },
    { label: "Federal Election", type: RESPONSE_TYPE.PREFERENCE },
    { label: "Referendum", type: RESPONSE_TYPE.RANKING },
    { label: "Plebiscite", type: RESPONSE_TYPE.YES_NO },
    { label: "Poll", type: RESPONSE_TYPE.YES_NO }
]

const ballot_types = [
    { label: "Federal", type: RESPONSE_TYPE.PREFERENCE },
    { label: "Referndum", type: RESPONSE_TYPE.YES_NO },
    { label: "Poll", type: RESPONSE_TYPE.YES_NO },
    { label: "Poll", type: RESPONSE_TYPE.PREFERENCE },
    { label: "Local", type: RESPONSE_TYPE.PREFERENCE },
    { label: "Camps", type: RESPONSE_TYPE.PREFERENCE },
    { label: "General", type: RESPONSE_TYPE.PREFERENCE }
]

const randFirstName = () => {
    if (randBool()) {
        return male_names_list[randInt(0, male_names_list.length)]
    }
    else {
        return female_names_list[randInt(0, female_names_list.length)]
    }
}

const randLastName = () => {
    return surnames_list[randInt(0, surnames_list.length)]
}

const randName = () => {
    return randFirstName() + ' ' + randLastName();
}

const randCompany = () => {
    return company_names[randInt(0, company_names.length)] + " " + company_names[randInt(0, company_names.length)]
}

const randElection = () => {
    return randPick(election_types)
}

const randBallot = () => {
    return randPick(ballot_types)
}

const promiseAll = <T = any>(count: number, func: (index: number) => Promise<T>): Promise<Array<T>> => {
    return Promise.all(Array(count).fill(0).map((_, i) => func(i)));
}

export async function main() {
    await dataSource.initialize();
    const serviceManager = new ServiceManager();
    serviceManager.set(DataSource, dataSource)

    const organisationRepo = serviceManager.get(OrganisationRepository);
    const electionSeeder = serviceManager.get(ElectionSeeder);

    const adminUserRepo = serviceManager.get(AdminUserRepository);
    const adminPasscodeRepo = serviceManager.get(AdminPasscodeRepository);

    const adminUser = await adminUserRepo.save({
        first_name: "Test",
        last_name: "Admin",
        email: "admin@example.com",
        role: ADMIN_ROLE.SUPER_ADMIN
    })

    await adminPasscodeRepo.save({
        admin_user_id: adminUser.id,
        type: PASSCODE_TYPE.PASSWORD,
        value: "asdf1234"
    })

    const now = Date.now();

    console.log("Admin created")

    for (let o = 0; o < 5; o++) {


        const org = await organisationRepo.save({
            label: randCompany(),
            owner: 'PRIVATE',
            country: 'AU'
        })
        console.log("Org created")

        console.log(org)


        await promiseAll(randInt(5, 30), async () =>

            electionSeeder.seedElection(org.id)
        );
    }

    console.log('destroy')

    dataSource.destroy();
}

interface Times {
    nominations_close_at?: Date;
    nominations_open_at?: Date;
    voting_close_at: Date;
    voting_open_at: Date;
}
const getTimes = (status: ELECTION_STATUS): Times => {
    const now = Date.now();
    let nominations_open_at: number | undefined;
    let nominations_close_at: number | undefined;
    let voting_close_at: number = 0;
    let voting_open_at: number = 0;

    switch (status) {
        case ELECTION_STATUS.CANCELLED:
            nominations_open_at = now + randInt(100, 100) * ONE_DAY
            nominations_close_at = nominations_open_at + randInt(10, 30) * ONE_DAY;
            voting_open_at = nominations_close_at + randInt(10, 30) * ONE_DAY;
            voting_close_at = voting_close_at + randInt(10, 30) * ONE_DAY;
            break;
        case ELECTION_STATUS.DRAFT:
        case ELECTION_STATUS.READY:
            nominations_open_at = now + randInt(10, 30) * ONE_DAY
            nominations_close_at = nominations_open_at + randInt(10, 30) * ONE_DAY;
            voting_open_at = nominations_close_at + randInt(10, 30) * ONE_DAY;
            voting_close_at = voting_close_at + randInt(10, 30) * ONE_DAY;
            break;
        case ELECTION_STATUS.NOMINATIONS:
            nominations_open_at = now + randInt(-20, -5) * ONE_DAY
            nominations_close_at = now + randInt(5, 20) * ONE_DAY;
            voting_open_at = nominations_close_at + randInt(10, 30) * ONE_DAY;
            voting_close_at = voting_close_at + randInt(10, 30) * ONE_DAY;
            break;
        case ELECTION_STATUS.RUNNING:
            voting_open_at = now + randInt(-20, -5) * ONE_DAY;
            voting_close_at = now + randInt(5, 20) * ONE_DAY;
            nominations_close_at = voting_open_at + randInt(-30, -10) * ONE_DAY;
            nominations_open_at = nominations_close_at + randInt(-30, -10) * ONE_DAY;
            break;
        case ELECTION_STATUS.COMPLETE:
            voting_close_at = now + randInt(-20 - 5) * ONE_DAY;
            voting_open_at = voting_close_at + randInt(-30, -10) * ONE_DAY;
            nominations_close_at = voting_open_at + randInt(-30, -10) * ONE_DAY;
            nominations_open_at = nominations_close_at + randInt(-30, -10) * ONE_DAY;
            break;
    }

    return {
        nominations_open_at: nominations_open_at ? new Date(nominations_open_at) : undefined,
        nominations_close_at: nominations_close_at ? new Date(nominations_close_at) : undefined,
        voting_open_at: new Date(voting_open_at),
        voting_close_at: new Date(voting_close_at)
    }
}

export class ElectionSeeder {
    @dependency
    electionRepository: ElectionRepository;

    @dependency
    voterRepo: VoterRepository;

    @dependency
    candidateRepo: CandidateRepository;

    @dependency
    ballotRepo: BallotRepository;

    @dependency
    runningRepo: RunningRepository;


    seedElection = async (organisation_id: string) => {
        const label = "";

        const status = randEnum(ELECTION_STATUS) as ELECTION_STATUS;

        const times = getTimes(status);
        const election = await this.electionRepository.save({
            status: status,
            label: label,
            organisation_id: organisation_id,
            ...times,
            mode: ELECTION_MODE.SCHEDULE
        })

        const voters = await promiseAll(randInt(10, 1000), () => this.voterRepo.save({
            first_name: randFirstName(),
            last_name: randLastName(),
            email: "person@example.com",
            election_id: election.id
        }))
        const ballots = await promiseAll(randInt(1, 3), (i) => this.seedBallots(election.id, i));
        return election;
    }

    seedBallots = async (election_id: string, index: number) => {

        const eballot = randBallot();

        const ballot = await this.ballotRepo.save({
            election_id: election_id,
            label: eballot.label,
            response_type: eballot.type,
            shuffle_candidates: Math.random() < 0.7,
            display_order: randInt(0, 10)
        });

        if (ballot.response_type === RESPONSE_TYPE.YES_NO) {
            return;
        }

        console.log('fetch candidates')

        const candidates = await this.candidateRepo.getByElectionId(election_id);


        if (randBool() || candidates.length === 0) {
            // 50/50 chance to create new candidates or reuse from existing
            // always create on the first ballot
            await promiseAll(randInt(5, 30), () => this.candidateRepo.save({
                election_id: election_id,
                first_name: randFirstName(),
                last_name: randLastName(),
                email: randFirstName() + '@example.com',
                status: randPick([CANDIDATE_STATUS.APPROVED, CANDIDATE_STATUS.NOMINATED, CANDIDATE_STATUS.REJECTED])
            }).then(c => this.runningRepo.getOrCreateRunning(c.id, ballot.id)));
        }
        else {

            for (let i = 0; i < 10; i++) {
                const candidate = randPick(candidates);
                await this.runningRepo.getOrCreateRunning(candidate.id, ballot.id);
            }
        }

        return ballot;

    }
}

