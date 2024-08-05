-- Add columns as nullable initially
ALTER TABLE "Option" ADD COLUMN "optionNumber" INTEGER;
ALTER TABLE "Question" ADD COLUMN "questionNumber" INTEGER;

-- Update existing rows with default values (optional)
UPDATE "Option" SET "optionNumber" = 0 WHERE "optionNumber" IS NULL;
UPDATE "Question" SET "questionNumber" = 0 WHERE "questionNumber" IS NULL;

-- Alter columns to be NOT NULL
ALTER TABLE "Option" ALTER COLUMN "optionNumber" SET NOT NULL;
ALTER TABLE "Question" ALTER COLUMN "questionNumber" SET NOT NULL;
