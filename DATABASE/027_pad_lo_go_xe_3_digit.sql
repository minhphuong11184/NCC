/* =====================================================================
   TanTrao2026 - Script 027: Pad số trong mã lô gỗ xẻ thành 3 chữ số
   ---------------------------------------------------------------------
   Format hiện tại trong DB:  FSC100%26-06 S05  (số 06 chỉ 2 chữ số)
   Format mong muốn:           FSC100%26-006 S05 (3 chữ số có padding 0)

   Áp dụng cho các cột chứa mã lô gỗ xẻ:
     - [prod].[NHAP_GO_TRON].Lo_go
     - [prod].[GHEP_LO_GO_RESULT].LO_GO_GAN
     - [prod].[LO_GO_HE_SO].lo_go
     - [prod].[KH_KHAI_THAC].lo_go_xe

   *** CHẠY MỘT LẦN — chạy 2 lần không gây lỗi (logic chỉ pad nếu < 3 digit). ***
   *** BACKUP DB trước khi chạy. ***
   ===================================================================== */

USE [TanTrao2026_DB];
GO

/* =====================================================================
   BƯỚC 1 — PREVIEW: xem trước data sẽ thay đổi (KHÔNG sửa).
   ===================================================================== */
PRINT '=== Preview NHAP_GO_TRON.Lo_go ===';
SELECT TOP 20
    Lo_go AS old_value,
    LEFT(Lo_go, CHARINDEX('-', Lo_go))
      + RIGHT('000' + SUBSTRING(Lo_go,
            CHARINDEX('-', Lo_go) + 1,
            CHARINDEX(' ', Lo_go + ' ', CHARINDEX('-', Lo_go)) - CHARINDEX('-', Lo_go) - 1), 3)
      + SUBSTRING(Lo_go,
            CHARINDEX(' ', Lo_go + ' ', CHARINDEX('-', Lo_go)),
            LEN(Lo_go)) AS new_value
FROM [prod].[NHAP_GO_TRON]
WHERE Lo_go LIKE 'FSC100[%]%[0-9]-[0-9]%'
  AND CHARINDEX('-', Lo_go) > 0
  AND (CHARINDEX(' ', Lo_go + ' ', CHARINDEX('-', Lo_go))
       - CHARINDEX('-', Lo_go) - 1) BETWEEN 1 AND 2
  AND ISNUMERIC(SUBSTRING(Lo_go,
        CHARINDEX('-', Lo_go) + 1,
        CHARINDEX(' ', Lo_go + ' ', CHARINDEX('-', Lo_go)) - CHARINDEX('-', Lo_go) - 1)) = 1;
GO

/* =====================================================================
   BƯỚC 2 — UPDATE trong transaction (rollback được nếu sai).
   ===================================================================== */
BEGIN TRANSACTION FixLoGoXe;

/* --- NHAP_GO_TRON.Lo_go --- */
UPDATE [prod].[NHAP_GO_TRON]
SET Lo_go = LEFT(Lo_go, CHARINDEX('-', Lo_go))
          + RIGHT('000' + SUBSTRING(Lo_go,
                CHARINDEX('-', Lo_go) + 1,
                CHARINDEX(' ', Lo_go + ' ', CHARINDEX('-', Lo_go)) - CHARINDEX('-', Lo_go) - 1), 3)
          + SUBSTRING(Lo_go,
                CHARINDEX(' ', Lo_go + ' ', CHARINDEX('-', Lo_go)),
                LEN(Lo_go))
WHERE Lo_go LIKE 'FSC100[%]%[0-9]-[0-9]%'
  AND CHARINDEX('-', Lo_go) > 0
  AND (CHARINDEX(' ', Lo_go + ' ', CHARINDEX('-', Lo_go))
       - CHARINDEX('-', Lo_go) - 1) BETWEEN 1 AND 2
  AND ISNUMERIC(SUBSTRING(Lo_go,
        CHARINDEX('-', Lo_go) + 1,
        CHARINDEX(' ', Lo_go + ' ', CHARINDEX('-', Lo_go)) - CHARINDEX('-', Lo_go) - 1)) = 1;
PRINT 'NHAP_GO_TRON.Lo_go updated: ' + CAST(@@ROWCOUNT AS NVARCHAR(20));

/* --- GHEP_LO_GO_RESULT.LO_GO_GAN --- */
UPDATE [prod].[GHEP_LO_GO_RESULT]
SET LO_GO_GAN = LEFT(LO_GO_GAN, CHARINDEX('-', LO_GO_GAN))
          + RIGHT('000' + SUBSTRING(LO_GO_GAN,
                CHARINDEX('-', LO_GO_GAN) + 1,
                CHARINDEX(' ', LO_GO_GAN + ' ', CHARINDEX('-', LO_GO_GAN)) - CHARINDEX('-', LO_GO_GAN) - 1), 3)
          + SUBSTRING(LO_GO_GAN,
                CHARINDEX(' ', LO_GO_GAN + ' ', CHARINDEX('-', LO_GO_GAN)),
                LEN(LO_GO_GAN))
WHERE LO_GO_GAN LIKE 'FSC100[%]%[0-9]-[0-9]%'
  AND CHARINDEX('-', LO_GO_GAN) > 0
  AND (CHARINDEX(' ', LO_GO_GAN + ' ', CHARINDEX('-', LO_GO_GAN))
       - CHARINDEX('-', LO_GO_GAN) - 1) BETWEEN 1 AND 2
  AND ISNUMERIC(SUBSTRING(LO_GO_GAN,
        CHARINDEX('-', LO_GO_GAN) + 1,
        CHARINDEX(' ', LO_GO_GAN + ' ', CHARINDEX('-', LO_GO_GAN)) - CHARINDEX('-', LO_GO_GAN) - 1)) = 1;
PRINT 'GHEP_LO_GO_RESULT.LO_GO_GAN updated: ' + CAST(@@ROWCOUNT AS NVARCHAR(20));

/* --- LO_GO_HE_SO.lo_go --- */
UPDATE [prod].[LO_GO_HE_SO]
SET lo_go = LEFT(lo_go, CHARINDEX('-', lo_go))
          + RIGHT('000' + SUBSTRING(lo_go,
                CHARINDEX('-', lo_go) + 1,
                CHARINDEX(' ', lo_go + ' ', CHARINDEX('-', lo_go)) - CHARINDEX('-', lo_go) - 1), 3)
          + SUBSTRING(lo_go,
                CHARINDEX(' ', lo_go + ' ', CHARINDEX('-', lo_go)),
                LEN(lo_go))
WHERE lo_go LIKE 'FSC100[%]%[0-9]-[0-9]%'
  AND CHARINDEX('-', lo_go) > 0
  AND (CHARINDEX(' ', lo_go + ' ', CHARINDEX('-', lo_go))
       - CHARINDEX('-', lo_go) - 1) BETWEEN 1 AND 2
  AND ISNUMERIC(SUBSTRING(lo_go,
        CHARINDEX('-', lo_go) + 1,
        CHARINDEX(' ', lo_go + ' ', CHARINDEX('-', lo_go)) - CHARINDEX('-', lo_go) - 1)) = 1;
PRINT 'LO_GO_HE_SO.lo_go updated: ' + CAST(@@ROWCOUNT AS NVARCHAR(20));

/* --- KH_KHAI_THAC.lo_go_xe --- */
UPDATE [prod].[KH_KHAI_THAC]
SET lo_go_xe = LEFT(lo_go_xe, CHARINDEX('-', lo_go_xe))
          + RIGHT('000' + SUBSTRING(lo_go_xe,
                CHARINDEX('-', lo_go_xe) + 1,
                CHARINDEX(' ', lo_go_xe + ' ', CHARINDEX('-', lo_go_xe)) - CHARINDEX('-', lo_go_xe) - 1), 3)
          + SUBSTRING(lo_go_xe,
                CHARINDEX(' ', lo_go_xe + ' ', CHARINDEX('-', lo_go_xe)),
                LEN(lo_go_xe))
WHERE lo_go_xe LIKE 'FSC100[%]%[0-9]-[0-9]%'
  AND CHARINDEX('-', lo_go_xe) > 0
  AND (CHARINDEX(' ', lo_go_xe + ' ', CHARINDEX('-', lo_go_xe))
       - CHARINDEX('-', lo_go_xe) - 1) BETWEEN 1 AND 2
  AND ISNUMERIC(SUBSTRING(lo_go_xe,
        CHARINDEX('-', lo_go_xe) + 1,
        CHARINDEX(' ', lo_go_xe + ' ', CHARINDEX('-', lo_go_xe)) - CHARINDEX('-', lo_go_xe) - 1)) = 1;
PRINT 'KH_KHAI_THAC.lo_go_xe updated: ' + CAST(@@ROWCOUNT AS NVARCHAR(20));

-- Kiểm tra số rows in trên message tab.
-- Nếu đúng:    COMMIT TRANSACTION FixLoGoXe;
-- Nếu sai:     ROLLBACK TRANSACTION FixLoGoXe;
-- COMMIT TRANSACTION FixLoGoXe;
-- ROLLBACK TRANSACTION FixLoGoXe;
