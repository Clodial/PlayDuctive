DROP TRIGGER IF EXISTS afterAccountCreate;

DROP TABLE IF EXISTS AccountTasks, Projects, ProjTypes, Statuses, Classes, ClassTitles, Accounts;

CREATE TABLE Accounts(
accountId INT AUTO_INCREMENT PRIMARY KEY,
accountUser VARCHAR(20),
accountPass VARCHAR(20),
accountEmail VARCHAR(255)
);

CREATE TABLE ClassTitles(
classTitleId INT AUTO_INCREMENT PRIMARY KEY,
classTitle VARCHAR(255)
);

CREATE TABLE Statuses(
statusId INT AUTO_INCREMENT PRIMARY KEY,
statusName VARCHAR(255)
);

CREATE TABLE ProjTypes(
projTypeId INT AUTO_INCREMENT PRIMARY KEY,
projTypeName VARCHAR(255)
);

CREATE TABLE Classes(
classId INT AUTO_INCREMENT PRIMARY KEY,
accountId INT,
classTitleId INT,
classExp INT,
FOREIGN KEY (accountId) REFERENCES Accounts(accountId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (classTitleId) REFERENCES ClassTitles(classTitleId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Projects(
projId INT AUTO_INCREMENT PRIMARY KEY,
projTypeId INT,
statusId INT,
projName VARCHAR(255),
projDesc TEXT,
FOREIGN KEY (projTypeId) REFERENCES ProjTypes(projTypeId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (statusId) REFERENCES Statuses(statusId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE AccountTasks(
taskId INT AUTO_INCREMENT PRIMARY KEY,
classId INT,
projId INT,
taskExp INT,
taskDesc TEXT,
FOREIGN KEY (classId) REFERENCES Classes(classId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (projId) REFERENCES Projects(projId) ON DELETE CASCADE ON UPDATE CASCADE
);


DELIMITER //

CREATE TRIGGER afterAccountCreate AFTER INSERT ON Accounts FOR EACH ROW
BEGIN
INSERT INTO Classes(accountId,classTitleId,classEXP) SELECT NEW.accountId, classTitleId, 0 FROM ClassTitles;
END; 

CREATE PROCEDURE createProject(
IN newProjType VARCHAR(255),
IN newStatus VARCHAR(255),
IN newProjName VARCHAR(255),
IN newProjDesc TEXT)
BEGIN
INSERT INTO Projects(projTypeId,statusId,projName,projDesc) SELECT projTypeId,statusId,newProjName,newProjDesc FROM ProjTypes,Statuses WHERE projTypeName=newProjType AND statusName=newStatus;
END; 

CREATE PROCEDURE createProject(
IN newProjType VARCHAR(255),
IN newStatus VARCHAR(255),
IN newProjName VARCHAR(255),
IN newProjDesc TEXT)
BEGIN
INSERT INTO Projects(projTypeId,statusId,projName,projDesc) SELECT projTypeId,statusId,newProjName,newProjDesc FROM ProjTypes,Statuses WHERE projTypeName=newProjType AND statusName=newStatus;
END; 

CREATE PROCEDURE createAccount(
IN user VARCHAR(255),
IN email VARCHAR(255),
IN pass VARCHAR(255))
BEGIN
INSERT INTO Accounts(accountUser, accountPass, accountEmail)
	VALUES user, email, pass;
INSERT INTO Classes(accountId, classTitleId, classExp) SELECT Accounts.accountId, ClassTitles.classTitleId, 0 FROM Accounts, ClassTitles WHERE Accounts.accountUser = user 
		AND ClassTitles.classTitle = "Dungeon Master";
INSERT INTO Classes(accountId, classTitleId, classExp) SELECT Accounts.accountId, ClassTitles.classTitleId, 0 FROM Accounts, ClassTitles WHERE Accounts.accountUser = user 
		AND ClassTitles.classTitle = "Warrior";
INSERT INTO Classes(accountId, classTitleId, classExp) SELECT Accounts.accountId, ClassTitles.classTitleId, 0 FROM Accounts, ClassTitles WHERE Accounts.accountUser = user 
		AND ClassTitles.classTitle = "Magician";
INSERT INTO Classes(accountId, classTitleId, classExp) SELECT Accounts.accountId, ClassTitles.classTitleId, 0 FROM Accounts, ClassTitles WHERE Accounts.accountUser = user 
		AND ClassTitles.classTitle = "Rogue";
INSERT INTO Classes(accountId, classTitleId, classExp) SELECT Accounts.accountId, ClassTitles.classTitleId, 0 FROM Accounts, ClassTitles WHERE Accounts.accountUser = user 
		AND ClassTitles.classTitle = "Tinkerer";
INSERT INTO Classes(accountId, classTitleId, classExp) SELECT Accounts.accountId, ClassTitles.classTitleId, 0 FROM Accounts, ClassTitles WHERE Accounts.accountUser = user 
		AND ClassTitles.classTitle = "Priest";

END;//
DELIMITER ;


INSERT INTO ProjTypes(projTypeName) VALUES ("Waterfall"),("Agile");
INSERT INTO Statuses(statusName) VALUES ("NOT-STARTED"),("INPROGRESS"),("COMPLETE");
INSERT INTO ClassTitles(classTitle) VALUES ("Dungeon Master"),("Warrior"),("Magician"),("Rogue"),("Tinkerer"),("Priest");