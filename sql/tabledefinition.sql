DROP TRIGGER IF EXISTS afterAccountCreate;
DROP TRIGGER IF EXISTS afterProjectCreate;
DROP PROCEDURE IF EXISTS createProject;
DROP PROCEDURE IF EXISTS createAccount;
DROP PROCEDURE IF EXISTS createTask;
DROP PROCEDURE IF EXISTS addUser;
DROP PROCEDURE IF EXISTS login;

DROP TABLE IF EXISTS AccountTasks, AccountProjects, Projects, ProjTypes, Statuses, Classes, ClassTitles, Accounts;

CREATE TABLE Accounts(
accountId INT AUTO_INCREMENT PRIMARY KEY,
accountUser VARCHAR(20),
accountPass VARCHAR(20),
accountEmail VARCHAR(255),
accountLog VARCHAR(255),
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
accountId INT,
projName VARCHAR(255),
projDesc TEXT,
FOREIGN KEY (projTypeId) REFERENCES ProjTypes(projTypeId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (statusId) REFERENCES Statuses(statusId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (accountId) REFERENCES Accounts(accountId) ON DELETE CASCADE ON UPDATE CASCADE
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
taskExp INT,
taskDesc TEXT,
FOREIGN KEY (classId) REFERENCES Classes(classId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (projId) REFERENCES Projects(projId) ON DELETE CASCADE ON UPDATE CASCADE
);


DELIMITER //

CREATE TRIGGER afterAccountCreate AFTER INSERT ON Accounts FOR EACH ROW
BEGIN
INSERT INTO Classes(accountId,classTitleId,classEXP) SELECT NEW.accountId, classTitleId, 0 FROM ClassTitles;
END; //

CREATE TRIGGER afterProjectCreate AFTER INSERT ON Projects FOR EACH ROW
BEGIN
INSERT INTO AccountProjects(accountId,projId) VALUES(NEW.accountId, NEW.projId);
END; //

CREATE PROCEDURE createProject(
IN newProjType VARCHAR(255),
IN newStatus VARCHAR(255),
IN newProjName VARCHAR(255),
IN newProjDesc TEXT,
IN creator TEXT)
BEGIN
INSERT INTO Projects(projTypeId,statusId,projName,projDesc,creatorId) 
	SELECT projTypeId,statusId,newProjName,newProjDesc,accountId 
	FROM ProjTypes,Statuses,Accounts 
	WHERE projTypeName=newProjType 
		AND statusName=newStatus 
		AND accountUser=creator;
END; //
 

CREATE PROCEDURE createAccount(
IN user VARCHAR(255),
IN email VARCHAR(255),
IN pass VARCHAR(255))
BEGIN
INSERT INTO Accounts(accountUser, accountPass, accountEmail, accountLog)
	VALUES (user, email, pass, 0);
END; //

CREATE PROCEDURE login(
IN user VARCHAR(255), 
IN pass VARCHAR(255)) 
BEGIN
	IF EXISTS(SELECT accountId FROM Accounts WHERE accountUser = user AND accountPass = pass) THEN
		UPDATE Accounts SET accountLog = 1 WHERE accountUser = user;
	END IF;
END;

CREATE PROCEDURE getProjects(
IN user VARCHAR(255)
)
BEGIN
	select Projects.projName as name, Statuses.statusName as stat 
	from Projects, Classes, Statuses, Accounts, AccountTasks 
	where Accounts.accountUser = user 
		and Accounts.accountId = Classes.accountId 
		and Classes.classId = AccountTasks.classId 
		and AccountTasks.projId = Projects.projId 
		and Projects.statusId = Statuses.statusId;
END;

CREATE PROCEDURE addUser(
IN user VARCHAR(255),
IN project VARCHAR(255))
BEGIN
	INSERT INTO AccountProjects(accountId, projId)
		SELECT Accounts.accountId, Projects.projId
		FROM Accounts, Projects
		WHERE Accounts.accountName = user
		AND Projects.projName = project; 
END;

CREATE PROCEDURE createTask(
IN user VARCHAR(255),
IN class VARCHAR(255),
IN description TEXT,
IN exp INT,
IN project VARCHAR(255)
)
BEGIN
	IF EXISTS(SELECT AccountProjects.actProjId FROM AccountProjects, Accounts 
		WHERE Accounts.accountName = user 
		AND Accounts.accountId = AccountProjects.accountId) THEN
		
		INSERT INTO AccountTasks(classId, projId, taskExp, taskDesc) 
			SELECT Classes.classId, Projects.projId, exp, description
			FROM Classes, Projects, AccountProjects, Accounts, ClassTitles
			WHERE Accounts.accountName = user 
				AND ClassTitles.classTitle = class
				AND Classes.classTitleId = ClassTitles.classTitleId
				AND Classes.accountId = Accounts.accountId
				AND Projects.projName = project;

	END IF;
END;
//
DELIMITER ;


INSERT INTO ProjTypes(projTypeName) VALUES ("Waterfall"),("Agile");
INSERT INTO Statuses(statusName) VALUES ("NOT-STARTED"),("INPROGRESS"),("COMPLETE");
INSERT INTO ClassTitles(classTitle) VALUES ("Dungeon Master"),("Warrior"),("Magician"),("Rogue"),("Tinkerer"),("Priest");