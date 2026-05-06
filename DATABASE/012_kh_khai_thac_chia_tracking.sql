/* =====================================================================
   TanTrao2026 - Script 012: Thêm cột chia_thang, chia_nam vào KH_KHAI_THAC
   Mục đích: đánh dấu các dòng tồn được tạo bởi POST /chia-xe/luu-ton
   thuộc lần chia xe của tháng nào (chia_thang/chia_nam = tháng đang chia
   tại UI, KHÁC với thang/nam là tháng gốc của hộ).
   Cho phép Reset hoàn toàn 1 lần chia xe (xóa cả phiếu lẫn tồn).
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[prod].[KH_KHAI_THAC]')
      AND name = 'chia_thang'
)
BEGIN
    ALTER TABLE [prod].[KH_KHAI_THAC] ADD [chia_thang] INT NULL;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[prod].[KH_KHAI_THAC]')
      AND name = 'chia_nam'
)
BEGIN
    ALTER TABLE [prod].[KH_KHAI_THAC] ADD [chia_nam] INT NULL;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'[prod].[KH_KHAI_THAC]')
      AND name = 'IX_KH_KHAI_THAC_chia_thang_nam'
)
BEGIN
    CREATE INDEX IX_KH_KHAI_THAC_chia_thang_nam
        ON [prod].[KH_KHAI_THAC]([chia_thang], [chia_nam]);
END
GO
