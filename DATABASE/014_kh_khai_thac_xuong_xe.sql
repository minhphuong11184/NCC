/* =====================================================================
   TanTrao2026 - Script 014: Thêm cột xuong_xe vào KH_KHAI_THAC
   Mục đích: Khi import KH NGG cho phép chọn xưởng xẻ (lấy từ bảng
   [prod].[XUONG_XE]) và lưu kèm theo từng dòng KH để khi chia xe
   không cần chọn lại.
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[prod].[KH_KHAI_THAC]')
      AND name = 'xuong_xe'
)
BEGIN
    ALTER TABLE [prod].[KH_KHAI_THAC] ADD [xuong_xe] NVARCHAR(255) NULL;
END
GO
