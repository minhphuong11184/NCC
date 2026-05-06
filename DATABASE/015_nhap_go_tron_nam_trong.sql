/* =====================================================================
   TanTrao2026 - Script 015: Thêm cột Nam_trong vào NHAP_GO_TRON
   Mục đích: Lưu năm trồng cây (lấy từ KH_KHAI_THAC.nam_trong) khi chia xe.
   Trước đó cột Nam đang lưu nhầm năm trồng — đã sửa code, từ giờ Nam = năm KH.
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[prod].[NHAP_GO_TRON]')
      AND name = 'Nam_trong'
)
BEGIN
    ALTER TABLE [prod].[NHAP_GO_TRON] ADD [Nam_trong] INT NULL;
END
GO
