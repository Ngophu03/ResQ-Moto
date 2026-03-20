
(() => {
  const { translations } = window.APP_DATA;
  let language = 'vi';

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('langViBtn').addEventListener('click', () => switchLang('vi'));
    document.getElementById('langEnBtn').addEventListener('click', () => switchLang('en'));
    render();
  });

  function t(key) {
    return translations[language][key] || key;
  }

  function switchLang(lang) {
    language = lang;
    document.getElementById('langViBtn').classList.toggle('is-active', lang === 'vi');
    document.getElementById('langEnBtn').classList.toggle('is-active', lang === 'en');
    document.querySelectorAll('[data-i18n]').forEach(node => {
      node.innerHTML = t(node.dataset.i18n);
    });
    render();
  }

  function render() {
    const bookings = JSON.parse(localStorage.getItem('resqBookings') || '[]');
    const cashCount = bookings.filter(item => item.payment === 'cash').length;
    const transferCount = bookings.filter(item => item.payment === 'transfer').length;
    const revenue = bookings.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const latest = bookings[0];

    document.getElementById('metricBookings').textContent = bookings.length;
    document.getElementById('metricCash').textContent = cashCount;
    document.getElementById('metricTransfer').textContent = transferCount;
    document.getElementById('metricRevenue').textContent = formatCurrency(revenue);
    document.getElementById('metricService').textContent = latest?.service || '—';
    document.getElementById('metricDriver').textContent = latest?.mechanic || '—';

    const list = document.getElementById('bookingList');
    if (!bookings.length) {
      list.innerHTML = `<div class="driver-card"><h4>${language === 'vi' ? 'Chưa có booking nào.' : 'No bookings yet.'}</h4><p>${language === 'vi' ? 'Xác nhận một booking ở màn hình chính để thấy dữ liệu ở đây.' : 'Confirm a booking from the main app to see data here.'}</p></div>`;
      return;
    }

    list.innerHTML = bookings.map(item => `
      <article class="driver-card">
        <div class="driver-top">
          <div>
            <h4>${item.customerName}</h4>
            <p>${item.phone} · ${item.plate}</p>
          </div>
          <div class="badge-soft">${formatCurrency(item.total)}</div>
        </div>
        <div class="driver-meta-row">
          <div><span class="mini-label">${language === 'vi' ? 'Dịch vụ' : 'Service'}</span><strong>${item.service}</strong></div>
          <div><span class="mini-label">${language === 'vi' ? 'Tài xế' : 'Driver'}</span><strong>${item.mechanic}</strong></div>
          <div><span class="mini-label">${language === 'vi' ? 'Thanh toán' : 'Payment'}</span><strong>${item.payment}</strong></div>
        </div>
        <div class="notice-card accent-blue" style="margin-top:12px;">
          <p>${item.address}</p>
        </div>
      </article>
    `).join('');
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value || 0)) + 'đ';
  }
})();
