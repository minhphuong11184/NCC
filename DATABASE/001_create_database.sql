/* =====================================================================
   TanTrao2026 - Script 001: Tạo database + schema
   SQL Server
   ===================================================================== */

IF DB_ID(N'TanTrao2026_DB') IS NULL
BEGIN
    CREATE DATABASE [TanTrao2026_DB];
END
GO

USE [TanTrao2026_DB];
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'base')
    EXEC('CREATE SCHEMA [base]');
GO
