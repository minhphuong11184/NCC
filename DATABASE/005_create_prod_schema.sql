/* =====================================================================
   TanTrao2026 - Script 005: Tạo schema [prod] cho PRODUCTION service
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'prod')
    EXEC('CREATE SCHEMA [prod]');
GO
