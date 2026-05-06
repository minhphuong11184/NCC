/* =====================================================================
   TanTrao2026 - Script 016: Thêm cột nhom_chung_chi vào NHAP_GO_TRON
   Mục đích: Lưu "Tên nhóm chứng chỉ rừng" (= tên cty đại diện chứng chỉ)
   từ KH_KHAI_THAC.nhom_chung_chi để hiển thị trên báo cáo tổng hợp.
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[prod].[NHAP_GO_TRON]')
      AND name = 'nhom_chung_chi'
)
BEGIN
    ALTER TABLE [prod].[NHAP_GO_TRON] ADD [nhom_chung_chi] NVARCHAR(255) NULL;
END
GO
