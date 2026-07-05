# Ghi chú bổ sung cho framework.pdf / how-it-works.pdf

Nội dung đã đối chiếu với paper (Section 4, Appendix A) và với code thật trong
`education-q/src/run/main.py` — **khớp chính xác, không có sai sót cần sửa**. Chi
tiết tinh vi nhất (Teacher chỉ nhận nhãn Correct/Incorrect, không nhận giá trị đáp án
thô) được diễn giải đúng và khớp với code thật (main.py, hàm build message cho
Teacher chỉ đưa nhãn so sánh). Đây là phần mạnh nhất trong 5 phần được review.

Chỉ có 2 gợi ý bổ sung nhỏ (không bắt buộc, làm cho bài thuyết trình chặt chẽ hơn):

## 1. Nối tên hàm code vào slide chính (framework.pdf)

Các tên hàm cụ thể (`generate_question`, `answer_question`, `take_test`,
`calculate_accuracy`) hiện chỉ xuất hiện trong `how-it-works.pdf`, không xuất hiện
trong `framework.pdf`. Nếu dùng riêng `framework.pdf` để trình bày kiến trúc, nên
thêm chú thích ngắn kiểu:

- "System prompt Appendix A.2 (Teacher) ↔ `TeacherLLM.generate_question()`"
- "System prompt Appendix A.1 (Student) ↔ `StudentLLM.answer_question()` /
  `StudentLLM.take_test()`"
- "System prompt Appendix A.3 (Evaluator) ↔ `EvaluatorLLM` scoring methods"

để phần lý thuyết và phần code không tách rời khi trình bày.

## 2. Thêm một ví dụ hội thoại thật để minh họa vòng lặp 5 round

Cả hai tài liệu hiện dừng ở mức diễn giải cơ chế (đúng nhưng trừu tượng). Có thể lấy
ngay ví dụ thật từ Appendix F của paper (Table 23, Question 240 — Business, Teacher:
Llama 3.1 70B Instruct) để minh họa cụ thể một vòng lặp 5-round thực tế, thay vì chỉ
mô tả luồng dữ liệu chung chung. Ví dụ này cũng đã được dùng làm case study replay
trong `webapp/src/lib/replayCases.ts` (phần demo tương tác của dự án) nếu cần tham
khảo nguyên văn.

## Việc không cần sửa

- framework.png khớp đúng bố cục Figure 3 gốc (3 hàng Student/Teacher/Evaluator ×
  3 cột Pre-Test/Interaction/Post-Test).
- Pipeline 3 giai đoạn, content boundary, Appendix A (3 system prompt) đều đúng.
- Phần bảng số liệu kết quả (ALG/PNIR/CSS) trong framework.pdf tuy hơi lệch trọng tâm
  Section 4 (đề bài chỉ yêu cầu framework, không yêu cầu kết quả), nhưng số liệu đúng
  — không bắt buộc cắt bỏ, chỉ là không cần thiết nếu muốn slide gọn hơn.
