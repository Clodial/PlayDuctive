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
END; //
DELIMITER ;