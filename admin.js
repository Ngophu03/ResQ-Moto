(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('adminBookingCard');
    const count = document.getElementById('adminBookingCount');
    const raw = localStorage.getItem('resq-last-booking');

    if (!raw) {
      card.innerHTML = '<div class="inline-notice">Chưa có booking nào được lưu. Hãy hoàn tất một booking ở trang chính trước.</div>';
      count.textContent = '0';
      return;
    }

    try {
      const booking = JSON.parse(raw);
      card.innerHTML = `
        <div class="price-line"><span>Mã booking</span><strong>#${booking.code}</strong></div>
        <div class="price-line"><span>Khách hàng</span><strong>${booking.customer.name}</strong></div>
        <div class="price-line"><span>Số điện thoại</span><strong>${booking.customer.phone}</strong></div>
        <div class="price-line"><span>Tài xế</span><strong>${booking.driver?.name || '--'}</strong></div>
        <div class="price-line"><span>Thanh toán</span><strong>${booking.payment === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</strong></div>
        <div class="price-line"><span>Vị trí</span><strong>${booking.location.address}</strong></div>
        <div class="price-total"><span>Tổng tạm tính</span><strong>${Number(booking.total).toLocaleString('vi-VN')}đ</strong></div>
      `;
      count.textContent = '1';
    } catch (error) {
      card.innerHTML = '<div class="inline-notice warning">Không đọc được booking demo từ localStorage.</div>';
      count.textContent = '0';
    }
  });
})();
