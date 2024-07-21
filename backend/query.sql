BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "Users" (
 	"id"	INTEGER,
 	"name"	TEXT,
 	"password"	TEXT,
 	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "Cash" (
 	"id"	INTEGER,
 	"number"	INTEGER,
 	"total"	REAL,
 	"Users_id"	INTEGER,
 	FOREIGN KEY("Users_id") REFERENCES "Users"("id"),
 	PRIMARY KEY("id" AUTOINCREMENT)
);

DROP TABLE History_changes;
CREATE TABLE IF NOT EXISTS "History_changes" (
 	"id"	INTEGER,
 	"table_name"	TEXT,
 	"change"	TEXT,
 	"description"	TEXT,
 	"price"	REAL,
 	"date_time"	TEXT,
 	"Cash_id"	INTEGER,
 	"Cash_Usuario_id"	INTEGER,
 	FOREIGN KEY("Cash_id") REFERENCES "Cash"("id"),
 	FOREIGN KEY("Cash_Usuario_id") REFERENCES "Cash"("Usuario_id"),
 	PRIMARY KEY("id" AUTOINCREMENT)
 );
-- DROP TABLE Transactions;
 CREATE TABLE IF NOT EXISTS "Transactions" (
 	"id"	INTEGER,
 	"description"	TEXT,
 	"price"	REAL,
 	"date"	TEXT,
 	"importance"	TEXT,
 	"type"	TEXT,
 	"category"	TEXT,
 	"ready"	INTEGER,
 	"deadline"	TEXT,
 	"Users_id"	INTEGER,
 	FOREIGN KEY("Users_id") REFERENCES "Users"("id"),
 	PRIMARY KEY("id" AUTOINCREMENT)
 );
--  DROP TABLE Expenses;
CREATE TABLE IF NOT EXISTS "Expenses" (
	"id"	INTEGER,
	"type"	TEXT,
	"Transactions_id"	INTEGER,
	FOREIGN KEY("Transactions_id") REFERENCES "Transactions"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
-- DROP TABLE Incomes;
CREATE TABLE IF NOT EXISTS "Incomes" (
	"id"	INTEGER,
	"type"	TEXT,
	"Transactions_id"	INTEGER,
	FOREIGN KEY("Transactions_id") REFERENCES "Transactions"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
-- DROP TABLE Buys;
 CREATE TABLE IF NOT EXISTS "Buys" (
 	"id"	INTEGER,
 	"type"	TEXT,
 	"importance"	TEXT,
 	"ready"	INTEGER,
 	"Transactions_id"	INTEGER,
 	FOREIGN KEY("Transactions_id") REFERENCES "Transactions"("id"),
 	PRIMARY KEY("id" AUTOINCREMENT)
 );
-- DROP TABLE Debts;
CREATE TABLE IF NOT EXISTS "Debts" (
	"id"	INTEGER,
	"type"	TEXT,
	"importance"	TEXT,
	"deadline"	TEXT,
	"ready"	INTEGER,
	"Transactions_id"	INTEGER,
	FOREIGN KEY("Transactions_id") REFERENCES "Transactions"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

-- INSERT INTO "Users" ("id","name","password") VALUES (1,'YamidR','123456789');
-- INSERT INTO "Cash" ("id","number","total","Users_id") VALUES (1,1,0.0,1);

-- CREATE TRIGGER after_insert_transactions AFTER INSERT ON Transactions
-- FOR EACH ROW
-- WHEN NEW.type = 'Buys'
-- BEGIN
--     INSERT INTO Buys(type, importance, ready, Transactions_id)
--     VALUES (NEW.type, NEW.importance, NEW.ready, NEW.id);
-- END;
-- CREATE TRIGGER after_insert_transactions_debts AFTER INSERT ON Transactions
-- FOR EACH ROW
-- WHEN NEW.type = 'Debts'
-- BEGIN
--     INSERT INTO Debts(type, importance,deadline, ready, Transactions_id)
--     VALUES (NEW.type, NEW.importance, NEW.deadline,NEW.ready,NEW.id);
-- END;
-- CREATE TRIGGER after_insert_transactions_expenses AFTER INSERT ON Transactions
-- FOR EACH ROW
-- WHEN NEW.type = 'Expenses'
-- BEGIN
--    INSERT INTO Expenses(type, Transactions_id)
--    VALUES (NEW.type, NEW.id);
-- END;
-- CREATE TRIGGER after_insert_transactions_incomes AFTER INSERT ON Transactions
-- FOR EACH ROW
-- WHEN NEW.type = 'Incomes'
-- BEGIN
--     INSERT INTO Incomes(type, Transactions_id)
--     VALUES (NEW.type,NEW.id);
-- END;


-- DROP TRIGGER IF EXISTS after_delete_transaction;
-- CREATE TRIGGER after_delete_transaction AFTER DELETE ON Transactions
-- FOR EACH ROW 
-- WHEN OLD.type = 'Buys'
-- BEGIN
--     DELETE FROM Buys WHERE Transactions_id = OLD.id;
-- END;
-- DROP TRIGGER IF EXISTS after_delete_transaction_incomes;
-- CREATE TRIGGER after_delete_transaction_expenses AFTER DELETE ON Transactions
-- FOR EACH ROW 
-- WHEN OLD.type = 'Expenses'
-- BEGIN
--     DELETE FROM Expenses WHERE Transactions_id = OLD.id;
-- END;
-- CREATE TRIGGER after_delete_transaction_debts AFTER DELETE ON Transactions
-- FOR EACH ROW 
-- WHEN OLD.type = 'Debts'
-- BEGIN
--     DELETE FROM Debts WHERE Transactions_id = OLD.id;
-- END;
-- CREATE TRIGGER after_delete_expenses AFTER DELETE ON Expenses
-- FOR EACH ROW
-- BEGIN
--     DELETE FROM Expenses WHERE id = OLD.Transactions_id;
-- END;
--DELETE FROM Transactions WHERE id=23;
-- CREATE TRIGGER after_delete_incomes AFTER DELETE ON Incomes
-- FOR EACH ROW
-- BEGIN
--     DELETE FROM Incomes WHERE id = OLD.Transactions_id;
-- END;
-- CREATE TRIGGER after_update_check 
-- AFTER UPDATE ready ON Transactions
-- FOR EACH ROW
-- WHEN NEW.check = 0
-- BEGIN
	
-- END;

-- DROP TABLE Transactions;
-- DROP TRIGGER after_insert_transactions_incomes;
-- DROP TRIGGER after_insert_transactions;
-- DROP TRIGGER after_insert_transactions_debts;
-- DROP TRIGGER after_insert_transactions_expenses;
--INSERT INTO Transactions(description,price,date,importance,type,category,ready,deadline,Users_id) VALUES ('Computador',3000000.0,'2024-06-12','Alta','Buys','Tech',0,'2024-06-12',1);
-- DELETE FROM Transactions WHERE id=62;
-- DELETE FROM Expenses WHERE id>0;
--DELETE FROM Incomes WHERE Transactions_id=5;
--DELETE FROM Buys WHERE id=2;
--SELECT * FROM Transactions;
--SELECT * FROM Buys;
-- SELECT * FROM Incomes;
-- SELECT * FROM Expenses;
-- SELECT * FROM Transactions;
-- SELECT * FROM Buys;
-- SELECT * FROM Debts;
-- SELECT * FROM Cash;
-- SELECT * FROM Users;
--SELECT * FROM History_changes;
--SELECT * FROM Users;
-- CREATE INDEX IF NOT EXISTS idx_buys_transactions_id ON Buys(Transactions_id);
-- CREATE INDEX IF NOT EXISTS idx_transactions_id ON Transactions(id);