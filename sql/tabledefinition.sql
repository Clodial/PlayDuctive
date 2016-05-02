DROP TRIGGER IF EXISTS afterAccountCreate;
DROP TRIGGER IF EXISTS afterProjectCreate;
DROP PROCEDURE IF EXISTS createProject;
DROP PROCEDURE IF EXISTS createAccount;
DROP PROCEDURE IF EXISTS login;
DROP PROCEDURE IF EXISTS getProjects;
DROP PROCEDURE IF EXISTS addUser;
DROP PROCEDURE IF EXISTS createTask;
DROP PROCEDURE IF EXISTS getStats;
DROP PROCEDURE IF EXISTS addStat;
DROP PROCEDURE IF EXISTS addAccountProject;

DROP TABLE IF EXISTS AccountTasks, AccountProjects, Projects, ProjTypes, Statuses, Classes, ClassTitles, Accounts;

CREATE TABLE Accounts(
accountId INT AUTO_INCREMENT PRIMARY KEY,
accountUser VARCHAR(20),
accountPass VARCHAR(20),
accountEmail VARCHAR(255),
CONSTRAINT accountId UNIQUE(accountUser)
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
creatorId INT,
FOREIGN KEY (projTypeId) REFERENCES ProjTypes(projTypeId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (statusId) REFERENCES Statuses(statusId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (creatorId) REFERENCES Accounts(accountId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE AccountProjects(
actProjId INT AUTO_INCREMENT PRIMARY KEY,
accountId INT,
projId INT,
FOREIGN KEY (projId) REFERENCES Projects(projId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (accountId) REFERENCES Accounts(accountId) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE AccountTasks(
taskId INT AUTO_INCREMENT PRIMARY KEY,
classId INT,
projId INT,
statusId INT,
taskExp INT,
taskDesc TEXT,
FOREIGN KEY (classId) REFERENCES Classes(classId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (projId) REFERENCES Projects(projId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (statusId) REFERENCES Statuses(statusId) ON DELETE CASCADE ON UPDATE CASCADE
);


DELIMITER //

CREATE TRIGGER afterAccountCreate AFTER INSERT ON Accounts FOR EACH ROW
BEGIN
INSERT INTO Classes(accountId,classTitleId,classExp) SELECT NEW.accountId, classTitleId, 0 FROM ClassTitles;
END; //

CREATE PROCEDURE createProject(
IN newProjType VARCHAR(255),
IN newStatus VARCHAR(255),
IN newProjName VARCHAR(255),
IN newProjDesc TEXT,
IN creator TEXT,
OUT newProjId INT)
BEGIN
INSERT INTO Projects(projTypeId,statusId,projName,projDesc,creatorId) 
	SELECT projTypeId,statusId,newProjName,newProjDesc,accountId 
	FROM ProjTypes,Statuses,Accounts 
	WHERE projTypeName=newProjType 
		AND statusName=newStatus 
		AND accountUser=creator;
SET newProjId=LAST_INSERT_ID();
END; //
 

CREATE PROCEDURE createAccount(
IN user VARCHAR(255),
IN pass VARCHAR(255)),
IN email VARCHAR(255)

BEGIN
INSERT INTO Accounts(accountUser, accountPass, accountEmail)
	VALUES (user, pass, email);
END; //

CREATE PROCEDURE login(
IN user VARCHAR(255), 
IN pass VARCHAR(255)) 
BEGIN
	IF EXISTS(SELECT accountId FROM Accounts WHERE accountUser = user AND accountPass = pass) THEN
		UPDATE Accounts SET accountLog = 1 WHERE accountUser = user;
	END IF;
END; //

CREATE PROCEDURE getProjects(
IN user VARCHAR(255)
)
BEGIN
	SELECT Projects.projId AS id, Projects.projName AS name, Statuses.statusName AS stat 
	from Projects, Statuses, Accounts, AccountProjects 
	WHERE Accounts.accountUser = user 
		AND AccountProjects.accountId = Accounts.accountId 
		AND AccountProjects.projId = Projects.projId 
		AND Projects.statusId = Statuses.statusId;
END; //

CREATE PROCEDURE addUser(
IN user VARCHAR(255),
IN project VARCHAR(255))
BEGIN
	INSERT INTO AccountProjects(accountId, projId)
		SELECT Accounts.accountId, Projects.projId
		FROM Accounts, Projects
		WHERE Accounts.accountName = user
		AND Projects.projName = project; 
END; //

CREATE PROCEDURE createTask(
IN user VARCHAR(255),
IN class VARCHAR(255),
IN description TEXT,
IN exp INT,
IN project VARCHAR(255)
)
BEGIN
	IF EXISTS(SELECT AccountProjects.actProjId FROM AccountProjects, Accounts 
		WHERE Accounts.accountUser = user 
		AND Accounts.accountId = AccountProjects.accountId) THEN
		
		INSERT INTO AccountTasks(classId, projId, statusId, taskExp, taskDesc) 
			SELECT Classes.classId, Projects.projId, Statuses.statusId, exp, description
			FROM Classes, Projects, AccountProjects, Accounts, ClassTitles, Statuses
			WHERE Accounts.accountName = user 
				AND ClassTitles.classTitle = class
				AND Classes.classTitleId = ClassTitles.classTitleId
				AND Classes.accountId = Accounts.accountId
				AND Projects.projName = project
				AND Statuses.statusName = "NOT-STARTED";
	END IF;
END; //

CREATE PROCEDURE createTask2(
IN newUser VARCHAR(255),
IN newClassTitle VARCHAR(255),
IN newTaskDesc TEXT,
IN newTaskExp INT,
IN newProjId VARCHAR(255),
OUT newTaskId INT
)
BEGIN
	IF EXISTS(SELECT AccountProjects.actProjId FROM AccountProjects, Accounts 
		WHERE Accounts.accountUser = newUser 
		AND Accounts.accountId = AccountProjects.accountId) THEN
		
		INSERT INTO AccountTasks(classId, projId, statusId, taskExp, taskDesc) 
			SELECT Classes.classId, Projects.projId, Statuses.statusId, newTaskExp, newTaskDesc
			FROM Classes, Projects, Accounts, ClassTitles, Statuses
			WHERE Accounts.accountUser = newUser
				AND ClassTitles.classTitle = newClassTitle
				AND Classes.classTitleId = ClassTitles.classTitleId
				AND Classes.accountId = Accounts.accountId
				AND Projects.projId = newProjId
				AND Statuses.statusName = "NOT-STARTED";
		SET newTaskId=LAST_INSERT_ID();
	END IF;
END; //

CREATE PROCEDURE getStats(
IN user VARCHAR(255)
)
BEGIN
	SELECT ClassTitles.classTitle AS class, Classes.classExp AS exp FROM ClassTitles, Classes, Accounts 
	WHERE Accounts.accountUser = user
		AND Accounts.accountId = Classes.accountId
        AND Classes.classTitleId = ClassTitles.classTitleId;
END; //

CREATE PROCEDURE addStat(
IN user VARCHAR(255),
IN exp INT,
IN class VARCHAR(255))
BEGIN
	UPDATE Classes, Accounts, ClassTitles set classExp = exp 
	WHERE Accounts.accountUser = user
		AND Accounts.accountId = Classes.accountId 
	    AND ClassTitles.classTitle = class
	    AND Classes.classTitleId = ClassTitles.classTitleId;
END; //

CREATE PROCEDURE addAccountProject(
IN user VARCHAR(255),
IN proj VARCHAR(255))
BEGIN
INSERT INTO AccountProjects(accountId, projId)
	SELECT accountId,proj FROM Accounts WHERE accountUser=user;
END; //

CREATE PROCEDURE completeTask(
IN completedTaskId INT)
BEGIN
	IF EXISTS(SELECT * FROM AccountTasks WHERE taskId=completedTaskId AND statusId!=(SELECT statusId FROM Statuses WHERE statusName="COMPLETE")) THEN
		UPDATE AccountTasks SET statusId=(SELECT statusId FROM Statuses WHERE statusName="COMPLETE") WHERE taskId=completedTaskId;
		SET @completedClassTitleId := (SELECT classTitleId FROM Classes WHERE classId=(SELECT classId FROM AccountTasks WHERE taskId=completedTaskId));
		UPDATE Classes SET classExp=classExp+(SELECT taskExp FROM AccountTasks WHERE taskId=completedTaskId) WHERE classTitleId=@completedClassTitleId
			AND accountId=ANY(SELECT accountId FROM AccountProjects WHERE projId=(SELECT projId FROM AccountTasks WHERE taskId=completedTaskId));
	END IF;
END; //

CREATE PROCEDURE completeProject(
IN completedProjId INT)
BEGIN
	IF EXISTS(SELECT * FROM Projects WHERE projId=completedProjId AND statusId!=(SELECT statusId FROM Statuses WHERE statusName="COMPLETE")) THEN
		UPDATE Projects SET statusId=(SELECT statusId FROM Statuses WHERE statusName="COMPLETE") WHERE projId=completedProjId;
		UPDATE Classes SET classExp=classExp+20 WHERE 
			accountId=(SELECT creatorId FROM Projects WHERE projId=completedProjId) AND classTitleId=(SELECT classTitleId FROM ClassTitles WHERE classTitle="Dungeon Master");
	END IF;
END; //
DELIMITER ;


INSERT INTO ProjTypes(projTypeName) VALUES ("Waterfall"),("Agile");
INSERT INTO Statuses(statusName) VALUES ("NOT-STARTED"),("INPROGRESS"),("COMPLETE");
INSERT INTO ClassTitles(classTitle) VALUES ("Dungeon Master"),("Warrior"),("Magician"),("Rogue"),("Tinkerer"),("Priest");