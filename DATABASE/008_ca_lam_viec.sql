-- Bảng ca làm việc
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CA_LAM_VIEC' AND schema_id = SCHEMA_ID('prod'))
BEGIN
    CREATE TABLE [prod].[CA_LAM_VIEC] (
        id INT IDENTITY(1,1) PRIMARY KEY,
        giovao INT NULL,            -- giờ vào (phút từ 0h, vd: 360 = 6:00)
        gionghi INT NULL,           -- giờ nghỉ bắt đầu
        gionghi1 INT NULL,          -- giờ nghỉ kết thúc
        giora INT NULL,             -- giờ ra
        mealtime INT NULL DEFAULT 0,-- thời gian ăn (phút)
        thoigianlamviec INT NULL,   -- thời gian làm việc (phút)
        ma NVARCHAR(50) NULL,       -- mã ca
        ten NVARCHAR(100) NULL      -- tên ca
    )

    -- Dữ liệu mẫu
    INSERT INTO [prod].[CA_LAM_VIEC] (giovao, gionghi, gionghi1, giora, mealtime, thoigianlamviec, ma, ten) VALUES
    (360,  NULL, NULL, 840,  0,  480, 'Ca1_LT', 'Ca 1'),
    (840,  NULL, NULL, 1320, 0,  480, 'Ca2_LT', 'Ca 2'),
    (1320, NULL, NULL, 1800, 0,  480, 'c3',     'Ca 3'),
    (450,  720,  780,  990,  60, 480, 'HCVP',   'HCVP'),
    (360,  630,  675,  885,  45, 480, 'C1_S',   'Ca 1 S'),
    (795,  1065, 1110, 1320, 45, 480, 'C2_C',   'Ca 2 C'),
    (450,  720,  765,  975,  45, 480, 'HCSX',   'HCSX'),
    (360,  NULL, NULL, 1080, 0,  720, 'Ca1_BV', 'Ca 1 BV')
END
