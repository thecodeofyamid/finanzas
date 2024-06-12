-- BEGIN TRANSACTION;
-- CREATE TABLE IF NOT EXISTS "Users" (
-- 	"id"	INTEGER,
-- 	"name"	TEXT,
-- 	"password"	TEXT,
-- 	PRIMARY KEY("id" AUTOINCREMENT)
-- );
-- CREATE TABLE IF NOT EXISTS "Cash" (
-- 	"id"	INTEGER,
-- 	"number"	INTEGER,
-- 	"total"	REAL,
-- 	"Users_id"	INTEGER,
-- 	FOREIGN KEY("Users_id") REFERENCES "Users"("id"),
-- 	PRIMARY KEY("id" AUTOINCREMENT)
-- );
-- CREATE TABLE IF NOT EXISTS "History_changes" (
-- 	"id"	INTEGER,
-- 	"table_name"	TEXT,
-- 	"change"	TEXT,
-- 	"description"	TEXT,
-- 	"price"	REAL,
-- 	"date_time"	TEXT,
-- 	"Cash_id"	INTEGER,
-- 	"Cash_Usuario_id"	INTEGER,
-- 	FOREIGN KEY("Cash_id") REFERENCES "Cash"("id"),
-- 	FOREIGN KEY("Cash_Usuario_id") REFERENCES "Cash"("Usuario_id"),
-- 	PRIMARY KEY("id")
-- );
DROP TABLE Transactions;
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
-- CREATE TABLE IF NOT EXISTS "Expenses" (
-- 	"id"	INTEGER,
-- 	"type"	TEXT,
-- 	"Transactions_id"	INTEGER,
-- 	FOREIGN KEY("Transactions_id") REFERENCES "Transactions"("id"),
-- 	PRIMARY KEY("id" AUTOINCREMENT)
-- );
-- CREATE TABLE IF NOT EXISTS "Incomes" (
-- 	"id"	INTEGER,
-- 	"type"	TEXT,
-- 	"Transactions_id"	INTEGER,
-- 	FOREIGN KEY("Transactions_id") REFERENCES "Transactions"("id"),
-- 	PRIMARY KEY("id" AUTOINCREMENT)
-- );
 CREATE TABLE IF NOT EXISTS "Buys" (
 	"id"	INTEGER,
 	"type"	TEXT,
 	"importance"	TEXT,
 	"ready"	INTEGER,
 	"Transactions_id"	INTEGER,
 	FOREIGN KEY("Transactions_id") REFERENCES "Transactions"("id"),
 	PRIMARY KEY("id" AUTOINCREMENT)
 );
-- CREATE TABLE IF NOT EXISTS "Debts" (
-- 	"id"	INTEGER,
-- 	"type"	TEXT,
-- 	"importance"	TEXT,
-- 	"deadline"	TEXT,
-- 	"ready"	INTEGER,
-- 	"Transactions_id"	INTEGER,
-- 	FOREIGN KEY("Transactions_id") REFERENCES "Transactions"("id"),
-- 	PRIMARY KEY("id" AUTOINCREMENT)
-- );
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
--     INSERT INTO Debts(type, importance, ready,deadline, Transactions_id)
--     VALUES (NEW.type, NEW.importance, NEW.deadline,NEW.ready,NEW.deadline,NEW.id);
-- END;
-- CREATE TRIGGER after_insert_transactions_expenses AFTER INSERT ON Transactions
-- FOR EACH ROW
-- WHEN NEW.type = 'Expenses'
-- BEGIN
--     INSERT INTO Expenses(type, Transactions_id)
--     VALUES (NEW.type, NEW.id);
-- END;
-- CREATE TRIGGER after_insert_transactions_incomes AFTER INSERT ON Transactions
-- FOR EACH ROW
-- WHEN NEW.type = 'Incomes'
-- BEGIN
--     INSERT INTO Incomes(type, Transactions_id)
--     VALUES (NEW.type,NEW.id);
-- END;
-- COMMIT;

--DROP TABLE Transactions;
--DROP TRIGGER after_insert_transactions_incomes;
--DROP TRIGGER after_insert_transactions;
--DROP TRIGGER after_insert_transactions_debts;
--DROP TRIGGER after_insert_transactions_expenses;

INSERT INTO Transactions(description,price,date,importance,type,category,ready,deadline,Users_id) VALUES ('Utiles de Aseo',30000.0,'2024-09-06','Alta','Buys','Aseo Personal',0,'2024-09-06',1);
--DELETE FROM Transactions WHERE id>4;
--SELECT * FROM Transactions;
--SELECT * FROM Buys;
--SELECT * FROM Users;
--CREATE INDEX IF NOT EXISTS idx_buys_transactions_id ON Buys(Transactions_id);
--CREATE INDEX IF NOT EXISTS idx_transactions_id ON Transactions(id);