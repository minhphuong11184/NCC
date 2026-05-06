/* =====================================================================
   TanTrao2026 - Script 003: Dữ liệu khởi tạo
   - 1 ROLE admin
   - 1 ACCOUNT admin / admin (password bcrypt cho chuỗi "admin")
   ===================================================================== */

USE [TanTrao2026_DB];
GO

-- Role admin
IF NOT EXISTS (SELECT 1 FROM [base].[ROLE] WHERE CODE = 'admin')
BEGIN
    INSERT INTO [base].[ROLE] (CODE, NAME) VALUES ('admin', N'Quản trị hệ thống');
END
GO

DECLARE @adminRoleId INT = (SELECT TOP 1 ID FROM [base].[ROLE] WHERE CODE = 'admin');

-- Account admin / mật khẩu "admin"
-- Hash bcrypt của "admin" (saltRounds=10)
IF NOT EXISTS (SELECT 1 FROM [base].[ACCOUNT] WHERE [ACCOUNT] = 'admin')
BEGIN
    INSERT INTO [base].[ACCOUNT]
        ([GUID],[ACCOUNT],[PASSWORD],[FIRST_NAME],[LAST_NAME],[ACTIVE],[ROLE_ID])
    VALUES
        (NEWID(), 'admin',
         '$2b$10$K/o9Axb1ICr.TlJCNRfm7.XXkfh7ZQPK5I5IKQ2u98TRzaHB2IV4i',
         N'Quản trị', N'Hệ thống', 1, @adminRoleId);
END
GO
