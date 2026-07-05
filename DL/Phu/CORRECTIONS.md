# Đính chính educationq-report-vi.pdf / educationq-beamer-vi.pdf

Nội dung chuyên môn (Section 8 expert alignment, Limitations, Ethics, Appendix F case
studies) đã đối chiếu và **khớp chính xác** với paper gốc — không cần sửa số liệu. Chỉ
có 1 điểm cần xác minh/sửa gấp trước khi trình bày:

## Notebook Kaggle được nhắc tới không tồn tại trong repo

Report và slide có đoạn khẳng định nhóm "đã bổ sung 2 notebook Kaggle
(`educationq-kaggle.ipynb`, `educationq-kaggle-full.ipynb`)" ở mục 4.3 / phần "Ba cách
demo".

Đã kiểm tra trực tiếp repo `education-q` (cả working tree lẫn toàn bộ git history, mọi
commit từ đầu tới nay): **không có file nào tên như vậy**. Các notebook thật sự tồn
tại trong repo chỉ có (đều nằm trong `src/run/tools/`, mục đích convert JSON kết quả
sang Excel — không phải notebook demo):

- `pretest_results-json-to-excel-v1.ipynb`
- `comperehensive_json_to_excel_v1.ipynb`
- `interaction_analysis_json_to_excel_v1.ipynb`
- `merge_results_data.ipynb`
- `experiment_results-json-to-excel-v5.ipynb`

**Cần làm:** hoặc (a) nếu 2 notebook Kaggle thực sự có nhưng nằm ở máy khác/Kaggle
account riêng chưa commit vào repo — thì đính kèm chúng vào repo trước khi nộp, hoặc
push lên Kaggle và dẫn link thật vào report; hoặc (b) nếu thực tế chưa làm — sửa lại
câu chữ trong report/slide thành "dự kiến làm" hoặc bỏ hẳn mục này, để tránh bị hỏi
ngược lúc bảo vệ khi ai đó thử mở link/tìm file mà không thấy.

## Không có vấn đề nào khác

Các phần còn lại (78%=39/50 alignment, ALG 7.38 vs 6.41, 7 limitation H1-H7 + Model
Content Limitations + Ethics Statement, 3 case study Table 22/23/24) đều trích đúng
số liệu và đúng nội dung paper — không cần sửa.
