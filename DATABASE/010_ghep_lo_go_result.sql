/* =====================================================================
   TanTrao2026 - Script 010: Bảng prod.GHEP_LO_GO_RESULT
   Lưu kết quả ghép lô gỗ vào phiếu nhập kho (snapshot biên bản BM.COC.01-b)
   1 dòng = 1 chi tiết PHIEUNHAPKHO_DT đã được gán mã lô gỗ.
   Mỗi lần lưu lại cùng (thang, nam, mancc) sẽ xóa snapshot cũ trước khi insert.
   Chỉ giữ các cột cần để in biên bản.
   ===================================================================== */

USE [TanTrao2026_DB];
GO

IF OBJECT_ID(N'[prod].[GHEP_LO_GO_RESULT]', N'U') IS NULL
BEGIN
    CREATE TABLE [prod].[GHEP_LO_GO_RESULT] (
        [id]            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [thang]         INT             NULL,
        [nam]           INT             NULL,
        [mancc]         NVARCHAR(50)    NULL,
        [source]        NVARCHAR(20)    NULL,    -- 'woodsland' | 'import'
        [he_so]         FLOAT           NULL,
        -- Phiếu nhập kho (header)
        [SOPHIEU]       NVARCHAR(50)    NULL,
        [MAKHO]         NVARCHAR(50)    NULL,
        [NHOMSP]        NVARCHAR(50)    NULL,
        [BIENSOXE]      NVARCHAR(50)    NULL,
        [CREATED_AT]    DATETIME        NULL,
        -- Chi tiết phiếu
        [DAY]           FLOAT           NULL,
        [RONG]          FLOAT           NULL,
        [CAO]           FLOAT           NULL,
        [SOBO]          FLOAT           NULL,
        [SOTHANH_BO]    FLOAT           NULL,
        [TONG_THANH]    FLOAT           NULL,
        [KL_M3]         FLOAT           NULL,
        -- Kết quả gán lô gỗ
        [LO_GO_GAN]     NVARCHAR(50)    NULL,
        [CHUNG_CHI_GAN] NVARCHAR(255)   NULL,
        [saved_at]      DATETIME        DEFAULT GETDATE()
    );

    CREATE INDEX IX_GHEP_RESULT_thang_nam_mancc
        ON [prod].[GHEP_LO_GO_RESULT]([thang], [nam], [mancc]);
    CREATE INDEX IX_GHEP_RESULT_sophieu
        ON [prod].[GHEP_LO_GO_RESULT]([SOPHIEU]);
END
GO
