/* =====================================================================
   TanTrao2026 - Script 002: Tạo bảng (schema base)
   Phạm vi: Auth / Account / Role / Menu / Department
   ===================================================================== */

USE [TanTrao2026_DB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* ---------------------- ACCOUNT ---------------------- */
IF OBJECT_ID(N'[base].[ACCOUNT]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[ACCOUNT] (
        [ID]            INT IDENTITY(100000,1) NOT NULL PRIMARY KEY,
        [GUID]          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
        [ACCOUNT]       VARCHAR(50)      NULL,
        [PASSWORD]      NVARCHAR(500)    NULL,
        [FIRST_NAME]    NVARCHAR(200)    NULL,
        [LAST_NAME]     NVARCHAR(200)    NULL,
        [EMAIL]         VARCHAR(200)     NULL,
        [POSITION]      INT              NULL,
        [PHONE]         VARCHAR(50)      NULL,
        [ADDRESS]       NVARCHAR(200)    NULL,
        [ACTIVE]        INT              NULL DEFAULT 1,
        [ROLE_ID]       INT              NULL,
        [factoryId]     INT              NULL,
        [departmentId]  INT              NULL,
        [CREATE_BY]     INT              NULL,
        [unActive]      INT              NULL DEFAULT 0,
        [timeUnActive]  VARCHAR(50)      NULL,
        [createdAt]     DATETIME         NULL DEFAULT GETDATE(),
        [updatedAt]     DATETIME         NULL DEFAULT GETDATE()
    );
END
GO

/* ---------------------- ROLE ---------------------- */
IF OBJECT_ID(N'[base].[ROLE]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[ROLE] (
        [ID]    INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [GUID]  UNIQUEIDENTIFIER  NOT NULL DEFAULT NEWID(),
        [CODE]  VARCHAR(50)       NULL,
        [NAME]  NVARCHAR(200)     NULL
    );
END
GO

/* ---------------------- ROLE_GROUP ---------------------- */
IF OBJECT_ID(N'[base].[ROLE_GROUP]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[ROLE_GROUP] (
        [ID]    INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CODE]  VARCHAR(50)       NULL,
        [NAME]  NVARCHAR(200)     NULL
    );
END
GO

/* ---------------------- ROLE_TYPE ---------------------- */
IF OBJECT_ID(N'[base].[ROLE_TYPE]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[ROLE_TYPE] (
        [ID]    INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CODE]  VARCHAR(50)       NULL,
        [NAME]  NVARCHAR(200)     NULL
    );
END
GO

/* ---------------------- ROLE_VALUE ---------------------- */
IF OBJECT_ID(N'[base].[ROLE_VALUE]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[ROLE_VALUE] (
        [ID]            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [GUID]          UNIQUEIDENTIFIER  NOT NULL DEFAULT NEWID(),
        [ROLE_ID]       INT               NULL,
        [ROLE_TYPE_ID]  INT               NULL,
        [VALUE]         NVARCHAR(500)     NULL
    );
END
GO

/* ---------------------- MODULE ---------------------- */
IF OBJECT_ID(N'[base].[MODULE]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[MODULE] (
        [ID]    INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [GUID]  UNIQUEIDENTIFIER  NOT NULL DEFAULT NEWID(),
        [CODE]  VARCHAR(50)       NULL,
        [NAME]  NVARCHAR(200)     NULL
    );
END
GO

/* ---------------------- MENU ---------------------- */
IF OBJECT_ID(N'[base].[MENU]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[MENU] (
        [ID]         INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [PARENT_ID]  INT               NULL,
        [TYPE]       VARCHAR(50)       NULL,
        [CODE]       VARCHAR(50)       NULL,
        [NAME]       NVARCHAR(200)     NULL,
        [PATH]       VARCHAR(500)      NULL,
        [sequence]   INT               NOT NULL DEFAULT 1,
        [permission] INT               NOT NULL DEFAULT 1,
        [isActive]   INT               NOT NULL DEFAULT 1
    );
END
GO

/* ---------------------- DEPARTMENT ---------------------- */
-- dùng cho Department / Factory / Xuong (phân biệt bằng cột TYPE)
IF OBJECT_ID(N'[base].[DEPARTMENT]', N'U') IS NULL
BEGIN
    CREATE TABLE [base].[DEPARTMENT] (
        [ID]                     INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [TYPE]                   NVARCHAR(100)     NULL,   -- 'Nhà máy' | 'Xưởng' | 'Phòng ban'
        [TYPE2]                  NVARCHAR(100)     NULL,
        [PARENT_ID]              VARCHAR(50)       NULL,
        [factoryId]              INT               NULL,
        [accountId]              INT               NULL,
        [accountId1]             INT               NULL,
        [accountId2]             INT               NULL,
        [CODE]                   VARCHAR(50)       NULL,
        [NAME]                   NVARCHAR(200)     NULL,
        [PACKAGE_TYPE_GROUP_ID]  INT               NULL,
        [GROUP_ID]               INT               NULL,
        [MODULE_ID]              INT               NULL
    );
END
GO
