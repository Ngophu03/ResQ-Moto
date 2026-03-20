# ResQ Moto – GitHub Ready Demo

Bản này được sắp xếp **phẳng ở thư mục chính** để bạn dễ upload lên GitHub hoặc GitHub Pages.

## File trong thư mục gốc
- `index.html`
- `admin.html`
- `style.css`
- `responsive.css`
- `data.js`
- `app.js`
- `admin.js`
- `README.md`

## Tính năng
- Flow 6 bước
- Leaflet + OpenStreetMap
- Tất cả tài xế hiện trên map
- Click marker để xem tuyến / chọn tài xế
- Random vị trí tài xế mỗi lần reload
- Thanh toán tiền mặt / chuyển khoản
- Mua xăng hộ E5 / RON95 / Diesel
- Song ngữ Việt / Anh
- Route thật bằng OSRM
- Admin demo đọc booking gần nhất từ localStorage

## Chạy local
### Cách 1: VS Code Live Server
Mở thư mục rồi chạy `Open with Live Server`.

### Cách 2: Python
```bash
python3 -m http.server 8000
```
Sau đó mở `http://localhost:8000`

## Upload GitHub Pages
1. Tạo repo mới trên GitHub.
2. Upload toàn bộ file trong thư mục này lên **root** của repo.
3. Vào **Settings → Pages**.
4. Chọn branch `main` và folder `/root`.
5. Save.

## Lưu ý
- App cần internet để tải map tiles, geocoding và route.
- OTP demo: `123456`


Balanced v2: smaller, more proportional layout tuned for GitHub Pages.
