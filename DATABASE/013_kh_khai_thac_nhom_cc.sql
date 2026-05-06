/* =====================================================================
   TanTrao2026 - Script 013: Thêm cột nhom_chung_chi vào KH_KHAI_THAC
   File mẫu KH NGG mới (mau_20260428) có thêm 2 cột:
     - Số Chứng Chỉ Rừng       → đã có cột [chung_chi]
     - Tên Nhóm chứng chỉ rừng → cần thêm [nhom_chung_chi]
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[prod].[KH_KHAI_THAC]')
      AND name = 'nhom_chung_chi'
)
BEGIN
    ALTER TABLE [prod].[KH_KHAI_THAC] ADD [nhom_chung_chi] NVARCHAR(255) NULL;
END
GO
