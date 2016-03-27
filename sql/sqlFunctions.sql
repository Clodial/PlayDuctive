DELIMITER //

CREATE PROCEDURE createProject(
IN newProjType VARCHAR(255),
IN newStatus VARCHAR(255),
IN newProjName VARCHAR(255),
IN newProjDesc TEXT)
BEGIN
INSERT INTO Projects(
	projTypeId,
	statusId,
	projName,
	projDesc) 
	SELECT 
		projTypeId,
		statusId,
		newProjName,
		newProjDesc 
	FROM 
		ProjTypes,
		Statuses 
	WHERE projTypeName=newProjType 
		AND statusName=newStatus;
END; 

CREATE PROCEDURE createAccount(
IN user VARCHAR(255),
IN email VARCHAR(255),
IN pass VARCHAR(255)
)
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

END; //
DELIMITER ;