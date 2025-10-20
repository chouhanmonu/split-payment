CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "userid" varchar(30) UNIQUE NOT NULL,
  "name" varchar(100),
  "email" varchar(254) UNIQUE NOT NULL,
  "password" varchar(255),
  "profile_picture_url" varchar(512),
  "phone" varchar(20),
  "default_currency" char(3) NOT NULL DEFAULT 'USD',
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "blocked_users" (
  "blocker_id" integer,
  "blocked_id" integer,
  "created_at" timestamp DEFAULT (now()),
  "primary" key(blocker_id,blocked_id)
);

CREATE TABLE "groups" (
  "id" serial PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "image_url" varchar(512),
  "description" text,
  "created_by" integer NOT NULL,
  "default_currency" char(3) NOT NULL DEFAULT 'USD',
  "is_archived" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "users_on_groups" (
  "user_id" integer,
  "group_id" integer,
  "role" enum(member,admin) DEFAULT 'member',
  "joined_at" timestamp DEFAULT (now()),
  "primary" key(user_id,group_id)
);

CREATE TABLE "expenses" (
  "id" serial PRIMARY KEY,
  "description" varchar(200) NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "added_by" integer NOT NULL,
  "payer_id" integer NOT NULL,
  "group_id" integer,
  "split_type" enum(equal,unequal,percentage) NOT NULL DEFAULT 'equal',
  "currency" char(3) NOT NULL DEFAULT 'USD',
  "note" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "splits" (
  "id" serial PRIMARY KEY,
  "expense_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "value" numeric(10,2) NOT NULL,
  "value_type" enum(amount,percent) NOT NULL DEFAULT 'amount',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "transactions" (
  "id" serial PRIMARY KEY,
  "expense_id" integer,
  "payer_id" integer NOT NULL,
  "payee_id" integer NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "settlements" (
  "id" serial PRIMARY KEY,
  "group_id" integer,
  "payer_id" integer NOT NULL,
  "payee_id" integer NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "note" varchar(200),
  "settled_on" timestamp DEFAULT (now()),
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "notifications" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL,
  "type" enum(expense_added,expense_updated,settled,group_invite,reminder) NOT NULL,
  "title" varchar(150) NOT NULL,
  "message" text,
  "read" boolean DEFAULT false,
  "related_type" enum(expense,settlement,group,none) DEFAULT 'none',
  "related_id" integer,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "currencies" (
  "code" char(3) PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "symbol" varchar(10) NOT NULL,
  "exchange_rate" numeric(10,6) NOT NULL,
  "base_currency" boolean DEFAULT false,
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "balances" (
  "id" serial PRIMARY KEY,
  "group_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "total_paid" numeric(12,2) DEFAULT 0,
  "total_owed" numeric(12,2) DEFAULT 0,
  "net_balance" numeric(12,2) DEFAULT 0,
  "last_calculated" timestamp DEFAULT (now())
);

CREATE TABLE "audit_logs" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL,
  "action" enum(create,update,delete,settle) NOT NULL,
  "entity_type" varchar(50) NOT NULL,
  "entity_id" integer NOT NULL,
  "details" jsonb,
  "created_at" timestamp DEFAULT (now())
);

COMMENT ON COLUMN "expenses"."amount" IS 'add constrain `CHECK (amount > 0)`';

COMMENT ON COLUMN "splits"."value" IS 'check: >= 0';

COMMENT ON COLUMN "transactions"."amount" IS 'check: > 0';

COMMENT ON COLUMN "settlements"."amount" IS 'check: > 0';

COMMENT ON COLUMN "currencies"."exchange_rate" IS 'check: > 0';

ALTER TABLE "blocked_users" ADD FOREIGN KEY ("blocker_id") REFERENCES "users" ("id");

ALTER TABLE "blocked_users" ADD FOREIGN KEY ("blocked_id") REFERENCES "users" ("id");

ALTER TABLE "groups" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "users_on_groups" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "users_on_groups" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "expenses" ADD FOREIGN KEY ("added_by") REFERENCES "users" ("id");

ALTER TABLE "expenses" ADD FOREIGN KEY ("payer_id") REFERENCES "users" ("id");

ALTER TABLE "expenses" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "splits" ADD FOREIGN KEY ("expense_id") REFERENCES "expenses" ("id");

ALTER TABLE "splits" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "transactions" ADD FOREIGN KEY ("expense_id") REFERENCES "expenses" ("id");

ALTER TABLE "transactions" ADD FOREIGN KEY ("payer_id") REFERENCES "users" ("id");

ALTER TABLE "transactions" ADD FOREIGN KEY ("payee_id") REFERENCES "users" ("id");

ALTER TABLE "settlements" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "settlements" ADD FOREIGN KEY ("payer_id") REFERENCES "users" ("id");

ALTER TABLE "settlements" ADD FOREIGN KEY ("payee_id") REFERENCES "users" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "balances" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "balances" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "audit_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "audit_logs" ADD FOREIGN KEY ("user_id") REFERENCES "audit_logs" ("id");
