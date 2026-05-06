/* =====================================================================
   TanTrao2026 - Script 006: Bảng prod.NHAP_GO_TRON
   (phục vụ trang BB nghiệm thu gỗ keo tròn)
   Schema copy từ [Woodsland].[dbo].[NHAP_GO_TRON]
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF OBJECT_ID(N'[prod].[NHAP_GO_TRON]', N'U') IS NULL
BEGIN
    CREATE TABLE [prod].[NHAP_GO_TRON] (
        [ID]             INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [TT]             FLOAT           NULL,
        [Xuong_xe]       NVARCHAR(100)   NULL,
        [Chu_rung]       NVARCHAR(100)   NULL,
        [So_hop_dong]    NVARCHAR(255)   NULL,
        [Xa]             NVARCHAR(100)   NULL,
        [Huyen]          NVARCHAR(100)   NULL,
        [Loai_go]        NVARCHAR(50)    NULL,
        [Lo_go]          NVARCHAR(50)    NULL,
        [Thang]          INT             NULL,
        [So_phieu]       NVARCHAR(50)    NULL,
        [Ngay_nhap]      DATETIME        NULL,
        [Khoi_luong]     FLOAT           NULL,
        [Xe]             NVARCHAR(50)    NULL,
        [So_BKLS]        NVARCHAR(50)    NULL,
        [Ngay_BKLS]      NVARCHAR(255)   NULL,
        [So_chung_chi]   NVARCHAR(255)   NULL,
        [Hinh_thuc_xe]   NVARCHAR(50)    NULL,
        [Khoang]         NVARCHAR(50)    NULL,
        [Lo]             NVARCHAR(50)    NULL,
        [Dien_tich]      FLOAT           NULL,
        [Nam]            INT             NULL,
        [Go_xe_giao]     FLOAT           NULL,
        [UQ]             NVARCHAR(50)    NULL,
        [Don_gia]        FLOAT           NULL,
        [Thon]           NVARCHAR(255)   NULL,
        [cccd]           NVARCHAR(255)   NULL,
        [Ngay_hieu_luc]  NVARCHAR(255)   NULL,
        [sophieu]        NVARCHAR(50)    NULL,
        [mst]            NVARCHAR(50)    NULL,
        [factoryId]      INT             NULL   -- bổ sung để filter theo nhà máy
    );

    -- Dữ liệu demo để test ngay trang BB nghiệm thu
    INSERT INTO [prod].[NHAP_GO_TRON]
        ([TT],[Chu_rung],[So_phieu],[Ngay_nhap],[Khoi_luong],[Xe],[factoryId],[Loai_go],[Xa],[Huyen])
    VALUES
        (1, N'Nguyễn Văn A', N'P001', GETDATE(), 25.5, N'29H-12345', 100004, N'Keo', N'Yên Sơn', N'Tuyên Quang'),
        (2, N'Trần Thị B',   N'P002', GETDATE(), 18.0, N'29H-67890', 100004, N'Keo', N'Yên Sơn', N'Tuyên Quang'),
        (3, N'Lê Văn C',     N'P003', GETDATE(), 31.2, N'17H-11111', 100005, N'Keo', N'Thái Bình', N'Thái Bình');
END
GO
