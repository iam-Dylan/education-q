# Ghi chú dọn dẹp Legacy/

Nội dung chuyên môn của `overview.pdf` đã đối chiếu với paper (Section 1, 2, 9 +
Limitations) và **khớp chính xác**, không có sai lệch số liệu — không cần sửa nội
dung chính.

Chỉ dọn dẹp thư mục `Legacy/`:

- Đã xóa `educationq-full-prep-document-1206.md` vì trùng 100% (diff = 0 dòng khác
  biệt) với `educationq-full-prep-document.md` — chỉ là bản lưu nhầm/lưu lại 2 lần,
  không phải phiên bản khác nhau. Giữ lại bản không có hậu tố ngày.
- `readme.docx` hiện là ghi chú cá nhân "pending - WIP" (chưa hoàn thành), không phải
  README thật — giữ nguyên không xóa/sửa vì đây là ghi chú làm việc riêng của Khue,
  nhưng lưu ý không nên dùng file này khi tổng hợp báo cáo cuối, vì nó không phản ánh
  nội dung hoàn chỉnh (nội dung hoàn chỉnh đã ở `overview.pdf`).

## Còn thiếu (không bắt buộc, nên có nếu còn thời gian)

- Phần Code (README.md, docs/, examples/, demo) trong `overview.pdf` mục 5 mới là suy
  luận từ đọc tài liệu, chưa có bằng chứng đã thực chạy demo/clone repo thật. Nếu còn
  thời gian, nên tự clone `education-q` (đã có sẵn tại
  `/Users/nhantt/Downloads/MS_HCMUS/Study/DL/PJ/education-q`), chạy thử
  `examples/basic_usage.py` hoặc `python src/run/main.py`, chụp lại kết quả thật để
  thay phần suy luận bằng bằng chứng thực tế.
