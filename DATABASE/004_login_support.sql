/* =====================================================================
   TanTrao2026 - Script 004: Bảng/cột phụ trợ cho luồng LOGIN
   (BASE/src/controllers/auth.js có tham chiếu sẵn các bảng này)
   ===================================================================== */

USE [TanTrao2026_DB];
GO

/* ---- Bảng CATEGORY ---- */
IF OBJECT_ID(N'[base].[CATEGORY]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[CATEGORY] (
        [ID]          INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [NAME]        NVARCHAR(200)     NULL,
        [PERMISSION]  INT               NULL
    );
END
GO

/* ---- Bảng POSITION ---- */
IF OBJECT_ID(N'[base].[POSITION]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[POSITION] (
        [ID]    INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CODE]  VARCHAR(50)       NULL,
        [NAME]  NVARCHAR(200)     NULL
    );
END
GO

/* ---- Bảng ROLE_DEPARTMENT ---- */
IF OBJECT_ID(N'[base].[ROLE_DEPARTMENT]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[ROLE_DEPARTMENT] (
        [ID]            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [ACCOUNT_ID]    INT               NULL,
        [DEPARTMENT_ID] INT               NULL,
        [POSITION_ID]   INT               NULL
    );
END
GO

/* ---- Thêm cột ACCOUNT.notificationMail ---- */
IF COL_LENGTH('[base].[ACCOUNT]', 'notificationMail') IS NULL
BEGIN
    ALTER TABLE [base].[ACCOUNT] ADD [notificationMail] NVARCHAR(200) NULL;
END
GO

/* ---- Thêm cột DEPARTMENT.ERROR (text mô tả lỗi, do query dùng D.ERROR) ---- */
IF COL_LENGTH('[base].[DEPARTMENT]', 'ERROR') IS NULL
BEGIN
    ALTER TABLE [base].[DEPARTMENT] ADD [ERROR] NVARCHAR(500) NULL;
END
GO
