---
title: SQLite UPSERT & RETURNING clauses
cover: /media/2135-database_management_software.webp
date: 2021-05-28T16:52:08.283Z
description: Quick post about the SQLite UPSERT and the new RETURNING clause.
slug: sqlite-upsert-returning-clauses
tags:
  - sql
  - sqlite
---
# The RETURNING clause

You can read the official docs [here](https://sqlite.org/lang_returning.html).

Many times we find ourselves wanting to return some data (probably the id) after inserting records in our database. Since version `3.35.0` (2021-03-12), SQLite supports the `RETURNING` clause, which allows you to **return a result row (or specific columns) for each modified database row by a `DELETE`, `UPDATE`or `INSERT`statement.** 

```sql
INSERT INTO customers (fullName, birthdateTimestamp, address) 
VALUES ('Andrew Mitch', 643911868, '206 Grange Road, Gillingham') 
RETURNING *;
```

The above query, after execution, will return us every value inserted in the database, along with `id` of each row. This way we can avoid make another `SELECT` query to the database. Pretty neat, eh?

# The UPSERT clause

You can read the official docs [here](https://sqlite.org/lang_upsert.html).

Another nice little feature is the `UPSERT` clause. This was added in version `3.24.0` (2018-06-04) and it causes `INSERT` to behave either like an `UPDATE` or a `no-op`, in case of a `UNIQUE CONSTRAINT` or a `PRIMARY KEY CONSTRAINT` violation. 

To elaborate, let's suppose that you have an `action_records` table which holds all actions fired by users in the `users` table, **for a specific session**. When a new action is fired you want to either insert a new `action_record` with no error, or, if existing **AND has the same session timestamp** (this is handled by the `ON CONFLICT` clause), update the old one. You can also optionally add a `WHERE` statement which will result in a `no-op`, if not met. The query below should do it:

```sql
-- Create users table and assign userID and sessionStartTimestamp as a UNIQUE CONSTRAINT.
DROP TABLE IF EXISTS "action_records";
CREATE TABLE IF NOT EXISTS "action_records" (
	"id" INTEGER NOT NULL,
	"userID" INTEGER NOT NULL,
	"sessionStartTimestamp" INTEGER NOT NULL,
	"errorMsg" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("userID") REFERENCES "users"("id") ON DELETE CASCADE,
    UNIQUE(userID, sessionStartTimestamp)
);

-- Insert new record or update the old one based on UNIQUE_CONSTRAINT OF userID & session_start_timestamp
INSERT INTO action_records (userID, errorMsg, sessionStartTimestamp) 
VALUES (258, null, 643911868) 
ON CONFLICT(userID, sessionStartTimestamp) -- Conflict when a record for the same user and session exists
DO UPDATE SET errorMsg = 'An error occured'
WHERE errorMsg IS NOT NULL -- This will be a no-op in case there is already an error and you don't want to update it
RETURNING *; -- Optionally adding RETURNING to retrieve any number of columns we want
```

# UPSERT & RETURNING combined

One thing I really liked is the fact that you can combine both those clauses by simply adding `RETURNING *` at the end of the query. This way any row (or specific columns), either inserted or updated, will be returned.