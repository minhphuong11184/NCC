/* =====================================================================
   TanTrao2026 - Script 007: Bảng prod.KH_KHAI_THAC
   (Kế hoạch khai thác gỗ tròn — import từ file KH khai thác)
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF OBJECT_ID(N'[prod].[KH_KHAI_THAC]', N'U') IS NULL
BEGIN
    CREATE TABLE [prod].[KH_KHAI_THAC] (
        [ID]              INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [thang]           INT             NULL,   -- tháng KH (10 = tháng 10)
        [nam]             INT             NULL,   -- năm KH (2025)
        [xa]              NVARCHAR(100)   NULL,
        [ten_ho]          NVARCHAR(200)   NULL,
        [thon]            NVARCHAR(500)   NULL,
        [cccd]            NVARCHAR(500)   NULL,
        [chung_chi]       NVARCHAR(500)   NULL,
        [khoanh]          NVARCHAR(50)    NULL,
        [lo]              NVARCHAR(50)    NULL,
        [dien_tich]       FLOAT           NULL,
        [loai_cay]        NVARCHAR(100)   NULL,
        [nam_trong]       INT             NULL,
        [kl_bang_ke]      FLOAT           NULL,   -- KL bảng kê (dự kiến)
        [kl_go]           FLOAT           NULL,   -- KL gỗ thực (kế hoạch)
        [noi_xe]          NVARCHAR(200)   NULL,   -- Tân Trào- bóc / xẻ
        [ngay_lam_hs]     NVARCHAR(200)   NULL,
        [thoi_gian_kt]    NVARCHAR(500)   NULL,   -- thời gian khai thác
        [so_bkls]         NVARCHAR(100)   NULL,
        [ngay_bkls]       NVARCHAR(200)   NULL,
        [KD]              NVARCHAR(50)    NULL,
        [VD]              NVARCHAR(50)    NULL,
        [source_sheet]    NVARCHAR(100)   NULL,   -- sheet gốc trong file Excel
        [source_file]     NVARCHAR(500)   NULL    -- tên file gốc
    );
END
GO
