/* =====================================================================
   TanTrao2026 - Script 009: Bảng prod.PNK_WOODSLAND_IMPORT
   Lưu dữ liệu phiếu nhập kho từ Excel Woodsland (thay cho việc gọi
   trực tiếp DB Woodsland). 1 dòng = 1 chi tiết PHIEUNHAPKHO_DT.
   Chỉ giữ các cột thật sự cần để in biên bản BM.COC.01-b.
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF OBJECT_ID(N'[prod].[PNK_WOODSLAND_IMPORT]', N'U') IS NULL
BEGIN
    CREATE TABLE [prod].[PNK_WOODSLAND_IMPORT] (
        [id]            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [thang]         INT             NULL,
        [nam]           INT             NULL,
        [mancc]         NVARCHAR(50)    NULL,
        -- Phiếu nhập kho (header)
        [SOPHIEU]       NVARCHAR(50)    NULL,
        [MAKHO]         NVARCHAR(50)    NULL,
        [NHOMSP]        NVARCHAR(50)    NULL,
        [BIENSOXE]      NVARCHAR(50)    NULL,
        [CREATED_AT]    DATETIME        NULL,
        -- Chi tiết phiếu (quy cách + số lượng)
        [DAY]           FLOAT           NULL,
        [RONG]          FLOAT           NULL,
        [CAO]           FLOAT           NULL,
        [SOBO]          FLOAT           NULL,
        [SOTHANH_BO]    FLOAT           NULL,
        [KL_M3]         FLOAT           NULL,
        [imported_at]   DATETIME        DEFAULT GETDATE()
    );

    CREATE INDEX IX_PNK_IMPORT_thang_nam_mancc
        ON [prod].[PNK_WOODSLAND_IMPORT]([thang], [nam], [mancc]);
    CREATE INDEX IX_PNK_IMPORT_sophieu
        ON [prod].[PNK_WOODSLAND_IMPORT]([SOPHIEU]);
END
GO
