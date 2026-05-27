/* =====================================================================
   TanTrao2026 - Script 029: Thêm cột NGUỒN GỐC vào prod.LO_GO_TON_TRON
   ---------------------------------------------------------------------
   Với tồn NHẬP TAY (lô gỗ tròn không có trong NHAP_GO_TRON), cần lưu kèm
   thông tin nguồn gốc để Bảng kê lâm sản (BKLS) gỗ xẻ kê được mục 7, 8:
     - so_bkls  : Số BKLS gốc của gỗ tròn
     - chu_rung : Chủ rừng
     - khoang   : Khoảnh
     - lo       : Lô
     - dia_chi  : Địa chỉ (thôn, xã, huyện gộp 1 chuỗi)
     - kd, vd   : Tọa độ Kinh độ / Vĩ độ
     - chung_chi      : Số chứng chỉ rừng
     - nhom_chung_chi : Tên nhóm chứng chỉ

   Tồn TỰ NHIÊN (lô đã có trong NHAP_GO_TRON) không cần điền — BKLS tự
   JOIN lấy theo mã lô.

   *** CHẠY MỘT LẦN. BACKUP DB trước khi chạy. ***
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF COL_LENGTH('[prod].[LO_GO_TON_TRON]', 'so_bkls') IS NULL
    ALTER TABLE [prod].[LO_GO_TON_TRON] ADD [so_bkls] NVARCHAR(100) NULL;
GO
IF COL_LENGTH('[prod].[LO_GO_TON_TRON]', 'chu_rung') IS NULL
    ALTER TABLE [prod].[LO_GO_TON_TRON] ADD [chu_rung] NVARCHAR(200) NULL;
GO
IF COL_LENGTH('[prod].[LO_GO_TON_TRON]', 'khoang') IS NULL
    ALTER TABLE [prod].[LO_GO_TON_TRON] ADD [khoang] NVARCHAR(50) NULL;
GO
IF COL_LENGTH('[prod].[LO_GO_TON_TRON]', 'lo') IS NULL
    ALTER TABLE [prod].[LO_GO_TON_TRON] ADD [lo] NVARCHAR(50) NULL;
GO
IF COL_LENGTH('[prod].[LO_GO_TON_TRON]', 'dia_chi') IS NULL
    ALTER TABLE [prod].[LO_GO_TON_TRON] ADD [dia_chi] NVARCHAR(500) NULL;
GO
IF COL_LENGTH('[prod].[LO_GO_TON_TRON]', 'kd') IS NULL
    ALTER TABLE [prod].[LO_GO_TON_TRON] ADD [kd] NVARCHAR(50) NULL;
GO
IF COL_LENGTH('[prod].[LO_GO_TON_TRON]', 'vd') IS NULL
    ALTER TABLE [prod].[LO_GO_TON_TRON] ADD [vd] NVARCHAR(50) NULL;
GO
IF COL_LENGTH('[prod].[LO_GO_TON_TRON]', 'chung_chi') IS NULL
    ALTER TABLE [prod].[LO_GO_TON_TRON] ADD [chung_chi] NVARCHAR(255) NULL;
GO
IF COL_LENGTH('[prod].[LO_GO_TON_TRON]', 'nhom_chung_chi') IS NULL
    ALTER TABLE [prod].[LO_GO_TON_TRON] ADD [nhom_chung_chi] NVARCHAR(255) NULL;
GO
