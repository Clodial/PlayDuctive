INSERT INTO ClassTitles(classTitle) VALUES("testClass1"),("testClass2"),("testClass3");
INSERT INTO Accounts(accountUser,accountPass,accountEmail) VALUES("testUser","testPass","testEmail");

SELECT classId,accountUser,accountPass,classTitle,classExp FROM Classes,ClassTitles,Accounts WHERE 
Classes.accountId=Accounts.accountId AND Classes.classTitleId=ClassTitles.classTitleId;