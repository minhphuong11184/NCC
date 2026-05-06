/* =====================================================================
   TanTrao2026 - Script 011: Thêm cột thang_chia, nam_chia vào NHAP_GO_TRON
   Mục đích: đánh dấu phiếu nào được tạo bởi tính năng Chia xe (POST /chia-xe/luu)
   để chặn không cho chia lại 1 tháng đã có data chia xe.
   Dữ liệu cũ (do Import Excel ImportGoTron) sẽ có 2 cột này = NULL
   → không bị tính là "đã chia xe".
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[prod].[NHAP_GO_TRON]')
      AND name = 'thang_chia'
)
BEGIN
    ALTER TABLE [prod].[NHAP_GO_TRON] ADD [thang_chia] INT NULL;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[prod].[NHAP_GO_TRON]')
      AND name = 'nam_chia'
)
BEGIN
    ALTER TABLE [prod].[NHAP_GO_TRON] ADD [nam_chia] INT NULL;
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'[prod].[NHAP_GO_TRON]')
      AND name = 'IX_NHAP_GO_TRON_thang_chia_nam_chia'
)
BEGIN
    CREATE INDEX IX_NHAP_GO_TRON_thang_chia_nam_chia
        ON [prod].[NHAP_GO_TRON]([thang_chia], [nam_chia]);
END
GO
