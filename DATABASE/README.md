# TanTrao2026 - Database

## Thứ tự chạy

1. `001_create_database.sql` — tạo database `TanTrao2026_DB` + schema `base`
2. `002_create_tables.sql`   — tạo các bảng: ACCOUNT, ROLE, ROLE_GROUP, ROLE_TYPE, ROLE_VALUE, MODULE, MENU, DEPARTMENT
3. `003_seed_data.sql`       — thêm role `admin` + tài khoản `admin` / mật khẩu `admin`

Chạy bằng SSMS hoặc `sqlcmd`:

```cmd
sqlcmd -S 127.0.0.1 -U sa -P <password> -i 001_create_database.sql
sqlcmd -S 127.0.0.1 -U sa -P <password> -i 002_create_tables.sql
sqlcmd -S 127.0.0.1 -U sa -P <password> -i 003_seed_data.sql
```

## Ghi chú

- `FACTORY` và `XUONG` không có bảng riêng — đều lưu trong `[base].[DEPARTMENT]`
  phân biệt bằng cột `TYPE` (`'Nhà máy'` / `'Xưởng'` / `'Phòng ban'`).
- Khi thêm nghiệp vụ mới, tạo thêm file `004_*.sql`, `005_*.sql`…
