# Quy tắc Kiến trúc Electron

- Mã renderer không được truy cập trực tiếp hệ thống tệp.
- Preload là cầu nối duy nhất giữa renderer và Electron main.
- Logic truy xuất và transcript segmentation nằm trong các module service, không phải trong UI component.
- Logging nên có cấu trúc và được phát ra từ các ranh giới service.
