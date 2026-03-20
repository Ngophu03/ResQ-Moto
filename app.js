(() => {
  const { DRIVERS, DISTRICT_CENTERS, SERVICE_CATALOG, FUEL_PRICES, BANK_INFO, STRINGS } = window.APP_DATA;

  const state = {
    lang: localStorage.getItem('resq-lang') || 'vi',
    step: 1,
    otpVerified: false,
    customer: {
      name: '',
      phone: '',
      licensePlate: ''
    },
    service: {
      vehicleType: 'motorbike',
      serviceType: 'flat_tire_tube_patch',
      priority: 'normal',
      note: '',
      flags: {
        night: false,
        rain: false,
        peak: false,
        parkingHard: false
      },
      fuelDelivery: false,
      fuelType: 'e5',
      fuelLiters: 1
    },
    location: {
      lat: 10.7291,
      lng: 106.6944,
      address: 'Rờ Mít, TP.HCM'
    },
    payment: 'cash',
    drivers: [],
    selectedDriverId: null,
    routeCoords: [],
    prices: {
      base: 0,
      condition: 0,
      priority: 0,
      time: 0,
      distance: 0,
      fuel: 0,
      total: 0
    },
    bookingCode: '',
    tracking: {
      statusIndex: 0,
      etaText: '--',
      distanceKm: 0,
      statusLabels: ['Đã nhận yêu cầu', 'Tài xế đang di chuyển', 'Tài xế đã tới nơi', 'Đang kiểm tra / xử lý', 'Hoàn thành']
    }
  };

  const els = {};
  let map;
  let customerMarker;
  let routeLine;
  let selectedRoutePreviewDriverId = null;
  let driverMarkers = new Map();
  let trackingTimer = null;

  const STEP_META = [
    { vi: 'Xác thực', en: 'Verify' },
    { vi: 'Dịch vụ', en: 'Service' },
    { vi: 'Vị trí', en: 'Location' },
    { vi: 'Tài xế', en: 'Driver' },
    { vi: 'Thanh toán', en: 'Payment' },
    { vi: 'Theo dõi', en: 'Tracking' }
  ];

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    cacheElements();
    seedDrivers();
    initMap();
    renderStepChips();
    bindEvents();
    populateStaticData();
    setLanguage(state.lang);
    syncLocationInputs();
    calculatePricing();
    renderDrivers();
    renderTrackingTimeline();
    updateWizard();
  }

  function cacheElements() {
    [
      'stepCounter', 'stepChips', 'prevBtn', 'nextBtn', 'customerName', 'customerPhone', 'otpInput', 'sendOtpBtn', 'verifyOtpBtn',
      'otpSuccess', 'otpHint', 'vehicleType', 'serviceType', 'licensePlate', 'priorityLevel', 'serviceNote', 'fuelDeliveryToggle',
      'fuelFields', 'fuelType', 'fuelLiters', 'addressInput', 'searchAddressBtn', 'useCurrentLocationBtn', 'latInput', 'lngInput',
      'locationStatus', 'driverList', 'refreshDriversBtn', 'bankName', 'bankAccount', 'bankOwner', 'bankNote', 'estimatedTotal',
      'lineBasePrice', 'lineConditionFee', 'linePriorityFee', 'lineTimeFee', 'lineDistanceFee', 'lineFuelFee', 'lineFinalPrice',
      'trackingDriverName', 'trackingDriverRating', 'trackingDriverPhone', 'trackingPaymentType', 'jobStatusPill', 'trackingEta',
      'trackingDistance', 'trackingCurrentStep', 'trackingTimeline', 'bookingSummaryList', 'summaryCode', 'callDriverBtn', 'chatDriverBtn',
      'recalcRouteBtn', 'transferBox', 'openPricingBtn', 'pricingModal', 'priceTableGrid'
    ].forEach((id) => {
      els[id] = document.getElementById(id);
    });
    els.stepPanels = [...document.querySelectorAll('.step-panel')];
    els.langBtns = [...document.querySelectorAll('.lang-btn')];
    els.paymentCards = [...document.querySelectorAll('.payment-card')];
    els.toggleChips = [...document.querySelectorAll('.toggle-chip')];
    els.modalClosers = [...document.querySelectorAll('[data-close-modal]')];
  }

  function bindEvents() {
    els.prevBtn.addEventListener('click', prevStep);
    els.nextBtn.addEventListener('click', nextStep);
    els.sendOtpBtn.addEventListener('click', sendOtp);
    els.verifyOtpBtn.addEventListener('click', verifyOtp);
    els.customerName.addEventListener('input', (e) => state.customer.name = e.target.value.trim());
    els.customerPhone.addEventListener('input', (e) => state.customer.phone = e.target.value.trim());
    els.licensePlate.addEventListener('input', (e) => state.customer.licensePlate = e.target.value.trim().toUpperCase());
    els.vehicleType.addEventListener('change', onVehicleChange);
    els.serviceType.addEventListener('change', onServiceChange);
    els.priorityLevel.addEventListener('change', () => { state.service.priority = els.priorityLevel.value; calculatePricing(); });
    els.serviceNote.addEventListener('input', () => state.service.note = els.serviceNote.value.trim());
    els.fuelDeliveryToggle.addEventListener('change', () => {
      state.service.fuelDelivery = els.fuelDeliveryToggle.checked;
      els.fuelFields.classList.toggle('hidden', !state.service.fuelDelivery);
      calculatePricing();
    });
    els.fuelType.addEventListener('change', () => { state.service.fuelType = els.fuelType.value; calculatePricing(); });
    els.fuelLiters.addEventListener('input', () => {
      state.service.fuelLiters = Math.max(1, Number(els.fuelLiters.value || 1));
      calculatePricing();
    });
    els.searchAddressBtn.addEventListener('click', searchAddress);
    els.useCurrentLocationBtn.addEventListener('click', useCurrentLocation);
    els.latInput.addEventListener('change', updateLocationFromInputs);
    els.lngInput.addEventListener('change', updateLocationFromInputs);
    els.addressInput.addEventListener('change', () => state.location.address = els.addressInput.value.trim());
    els.refreshDriversBtn.addEventListener('click', () => {
      seedDrivers();
      renderDrivers();
      renderDriverMarkers();
      clearRoute();
      toast('Đã random lại vị trí tài xế mới.');
    });
    els.paymentCards.forEach((card) => card.addEventListener('click', () => selectPayment(card.dataset.payment)));
    els.openPricingBtn.addEventListener('click', openPricingModal);
    els.modalClosers.forEach((btn) => btn.addEventListener('click', closePricingModal));
    els.langBtns.forEach((btn) => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
    els.toggleChips.forEach((chip) => chip.addEventListener('click', () => {
      const flag = chip.dataset.flag;
      state.service.flags[flag] = !state.service.flags[flag];
      chip.classList.toggle('active', state.service.flags[flag]);
      calculatePricing();
    }));
    els.callDriverBtn.addEventListener('click', (e) => {
      const driver = getSelectedDriver();
      if (!driver) {
        e.preventDefault();
        return;
      }
      els.callDriverBtn.href = `tel:${driver.phone}`;
    });
    els.chatDriverBtn.addEventListener('click', () => {
      const driver = getSelectedDriver();
      if (!driver) return toast('Hãy chọn tài xế trước.');
      toast(`${driver.name}: Tôi đang tới, khoảng ${state.tracking.etaText}.`);
    });
    els.recalcRouteBtn.addEventListener('click', async () => {
      const driver = getSelectedDriver();
      if (!driver) return toast('Hãy chọn tài xế trước.');
      await previewRoute(driver.id, true);
      toast('Đã tính lại tuyến đường.');
    });
    window.addEventListener('beforeunload', () => trackingTimer && clearInterval(trackingTimer));
  }

  function populateStaticData() {
    populateVehicleOptions();
    populateServiceOptions();
    populateFuelOptions();
    selectPayment('cash');
    els.bankName.textContent = BANK_INFO.bank;
    els.bankAccount.textContent = BANK_INFO.accountNumber;
    els.bankOwner.textContent = BANK_INFO.accountName;
    els.bankNote.textContent = `${BANK_INFO.notePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    renderPriceTable();
  }

  function populateVehicleOptions() {
    const options = [
      { value: 'motorbike', vi: 'Xe số', en: 'Manual bike' },
      { value: 'scooter', vi: 'Xe tay ga', en: 'Scooter' },
      { value: 'ev', vi: 'Xe điện', en: 'Electric bike' }
    ];
    els.vehicleType.innerHTML = options.map((opt) => `<option value="${opt.value}">${state.lang === 'vi' ? opt.vi : opt.en}</option>`).join('');
    els.vehicleType.value = state.service.vehicleType;
  }

  function populateServiceOptions() {
    const options = getServicesForVehicle(state.service.vehicleType);
    els.serviceType.innerHTML = options.map((svc) => {
      const label = state.lang === 'vi' ? svc.labelVi : svc.labelEn;
      return `<option value="${svc.key}">${label}</option>`;
    }).join('');
    if (!options.find((item) => item.key === state.service.serviceType)) {
      state.service.serviceType = options[0]?.key || 'flat_tire_tube_patch';
    }
    els.serviceType.value = state.service.serviceType;
  }

  function populateFuelOptions() {
    els.fuelType.innerHTML = Object.entries(FUEL_PRICES).map(([key, item]) => {
      const label = state.lang === 'vi' ? item.vi : item.en;
      return `<option value="${key}">${label} · ${formatMoney(item.price)}/L</option>`;
    }).join('');
    els.fuelType.value = state.service.fuelType;
  }

  function renderStepChips() {
    els.stepChips.innerHTML = STEP_META.map((step, index) => {
      const label = state.lang === 'vi' ? step.vi : step.en;
      const stepNo = index + 1;
      const classes = ['step-chip'];
      if (stepNo === state.step) classes.push('active');
      if (stepNo < state.step) classes.push('done');
      return `
        <button class="step-chip ${classes.slice(1).join(' ')}" data-step-jump="${stepNo}" type="button">
          <span class="step-chip-index">${stepNo}</span>
          <span class="step-chip-label">${label}</span>
        </button>
      `;
    }).join('');
    [...els.stepChips.querySelectorAll('[data-step-jump]')].forEach((btn) => btn.addEventListener('click', () => {
      const target = Number(btn.dataset.stepJump);
      if (target <= state.step) {
        state.step = target;
        updateWizard();
      }
    }));
  }

  function seedDrivers() {
    state.drivers = DRIVERS.map((driver) => {
      const center = DISTRICT_CENTERS[driver.zone] || DISTRICT_CENTERS.q1;
      const latJitter = (Math.random() - 0.5) * 0.018;
      const lngJitter = (Math.random() - 0.5) * 0.02;
      return {
        ...driver,
        lat: center.lat + latJitter,
        lng: center.lng + lngJitter,
        distanceKm: calcDistanceKm(center.lat + latJitter, center.lng + lngJitter, state.location.lat, state.location.lng),
        etaMin: 6 + Math.floor(Math.random() * 12)
      };
    });
    state.selectedDriverId = null;
  }

  function initMap() {
    map = L.map('map', { zoomControl: true }).setView([state.location.lat, state.location.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    customerMarker = L.marker([state.location.lat, state.location.lng], {
      draggable: true,
      icon: L.divIcon({ className: '', html: '<div class="customer-marker"></div>', iconSize: [20, 20], iconAnchor: [10, 10] })
    }).addTo(map);

    customerMarker.on('dragend', async (e) => {
      const latlng = e.target.getLatLng();
      setCustomerLocation(latlng.lat, latlng.lng, state.location.address);
      await reverseGeocode();
      renderDrivers();
      renderDriverMarkers();
      calculatePricing();
    });

    renderDriverMarkers();
  }

  function renderDriverMarkers() {
    driverMarkers.forEach((marker) => map.removeLayer(marker));
    driverMarkers = new Map();

    state.drivers.forEach((driver) => {
      const marker = L.marker([driver.lat, driver.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div class="driver-marker ${driver.id === state.selectedDriverId ? 'selected' : ''}"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        })
      }).addTo(map);

      marker.bindPopup(driverPopupHtml(driver));
      marker.on('popupopen', () => bindPopupButtons(driver.id));
      marker.on('click', () => {
        selectedRoutePreviewDriverId = driver.id;
      });
      driverMarkers.set(driver.id, marker);
    });
  }

  function driverPopupHtml(driver) {
    const labels = state.lang === 'vi'
      ? { zone: 'Khu vực', eta: 'ETA', rating: 'Rating', choose: 'Chọn tài xế', preview: 'Xem tuyến' }
      : { zone: 'Zone', eta: 'ETA', rating: 'Rating', choose: 'Choose driver', preview: 'Preview route' };
    return `
      <div class="popup-card">
        <h4>${driver.name}</h4>
        <p>${labels.zone}: ${DISTRICT_CENTERS[driver.zone]?.name || 'TP.HCM'} · ${labels.rating}: ${driver.rating}</p>
        <p>${labels.eta}: ${driver.etaMin} min · ${formatDistance(driver.distanceKm)}</p>
        <div class="popup-actions">
          <button class="popup-btn secondary" data-preview-driver="${driver.id}">${labels.preview}</button>
          <button class="popup-btn primary" data-select-driver="${driver.id}">${labels.choose}</button>
        </div>
      </div>
    `;
  }

  function bindPopupButtons(driverId) {
    const previewBtn = document.querySelector(`[data-preview-driver="${driverId}"]`);
    const selectBtn = document.querySelector(`[data-select-driver="${driverId}"]`);
    if (previewBtn) previewBtn.addEventListener('click', () => previewRoute(driverId, true));
    if (selectBtn) selectBtn.addEventListener('click', () => chooseDriver(driverId));
  }

  async function previewRoute(driverId, fit = true) {
    const driver = state.drivers.find((item) => item.id === driverId);
    if (!driver) return;
    selectedRoutePreviewDriverId = driverId;
    const coords = await getRoute(driver.lat, driver.lng, state.location.lat, state.location.lng);
    if (coords.length) {
      drawRoute(coords, fit);
    }
  }

  function renderDrivers() {
    state.drivers.forEach((driver) => {
      driver.distanceKm = calcDistanceKm(driver.lat, driver.lng, state.location.lat, state.location.lng);
      driver.etaMin = Math.max(4, Math.round(driver.distanceKm * 5 + 3));
    });

    const relevantTag = SERVICE_CATALOG[state.service.serviceType]?.tags?.[0];
    const sorted = [...state.drivers].sort((a, b) => {
      const aSkill = a.skills.includes(relevantTag) ? 0 : 1;
      const bSkill = b.skills.includes(relevantTag) ? 0 : 1;
      if (aSkill !== bSkill) return aSkill - bSkill;
      return a.distanceKm - b.distanceKm;
    });

    els.driverList.innerHTML = sorted.map((driver) => {
      const selected = driver.id === state.selectedDriverId;
      return `
        <article class="driver-item ${selected ? 'selected' : ''}">
          <div class="driver-top">
            <div>
              <h3 class="driver-title">${driver.name}</h3>
              <div class="driver-meta">⭐ ${driver.rating} · ${driver.completed} jobs · ${DISTRICT_CENTERS[driver.zone]?.name || 'TP.HCM'}</div>
            </div>
            <span class="small-badge">${driver.etaMin} phút</span>
          </div>
          <div class="driver-badges">
            ${driver.skills.slice(0, 3).map((skill) => `<span class="tag">${skillLabel(skill)}</span>`).join('')}
          </div>
          <div class="feedback-list">${driver.feedback.join(' · ')}</div>
          <div class="driver-actions">
            <button class="secondary-btn" data-preview-driver-list="${driver.id}" type="button">Xem tuyến đường</button>
            <button class="primary-btn" data-select-driver-list="${driver.id}" type="button">${selected ? 'Đã chọn' : 'Chọn tài xế'}</button>
          </div>
        </article>
      `;
    }).join('');

    [...els.driverList.querySelectorAll('[data-preview-driver-list]')].forEach((btn) => btn.addEventListener('click', () => previewRoute(btn.dataset.previewDriverList)));
    [...els.driverList.querySelectorAll('[data-select-driver-list]')].forEach((btn) => btn.addEventListener('click', () => chooseDriver(btn.dataset.selectDriverList)));
  }

  async function chooseDriver(driverId) {
    state.selectedDriverId = driverId;
    renderDrivers();
    renderDriverMarkers();
    const driver = getSelectedDriver();
    if (driver) {
      await previewRoute(driver.id, true);
      calculatePricing();
      toast(`Đã chọn ${driver.name}.`);
    }
  }

  function selectPayment(type) {
    state.payment = type;
    els.paymentCards.forEach((card) => card.classList.toggle('active', card.dataset.payment === type));
    els.transferBox.classList.toggle('hidden', type !== 'transfer');
    if (state.bookingCode) renderBookingSummary();
  }

  function openPricingModal() {
    els.pricingModal.classList.remove('hidden');
    els.pricingModal.setAttribute('aria-hidden', 'false');
  }

  function closePricingModal() {
    els.pricingModal.classList.add('hidden');
    els.pricingModal.setAttribute('aria-hidden', 'true');
  }

  function renderPriceTable() {
    const groups = [
      {
        title: 'Vá xe – thủng lốp',
        items: [
          'Vá thường bánh ruột: 10.000 – 20.000đ',
          'Vá keo / vá ép: 20.000 – 40.000đ',
          'Thay ruột: 80.000 – 150.000đ',
          'Vá dùi xe tay ga: 20.000 – 50.000đ',
          'Vá nấm: 40.000 – 80.000đ'
        ]
      },
      {
        title: 'Sửa xe cơ bản',
        items: [
          'Thay bugi: 40.000 – 120.000đ',
          'Thay nhớt xe số: 80.000 – 120.000đ',
          'Thay nhớt xe tay ga: 120.000 – 250.000đ',
          'Vệ sinh kim phun / chế hòa khí: 80.000 – 200.000đ',
          'Thay bố thắng: 80.000 – 200.000đ'
        ]
      },
      {
        title: 'Xe điện',
        items: [
          'Sạc tại chỗ: 5.000 – 20.000đ',
          'Cứu hộ sạc pin tận nơi: 50.000 – 150.000đ',
          'Thay bình thường: 300.000 – 900.000đ',
          'Combo 4–5 bình: 1.2 – 3 triệu'
        ]
      },
      {
        title: 'Cứu hộ & nhiên liệu',
        items: [
          'Vá xe tận nơi: 50.000 – 100.000đ',
          'Sửa nhẹ tại chỗ: 50.000 – 150.000đ',
          'Kéo xe gần: 100.000 – 200.000đ',
          'Xăng E5 / RON95 / Diesel tính theo lít + phí giao'
        ]
      }
    ];

    els.priceTableGrid.innerHTML = groups.map((group) => `
      <article class="price-table-card">
        <h3>${group.title}</h3>
        <ul>${group.items.map((item) => `<li>${item}</li>`).join('')}</ul>
      </article>
    `).join('');
  }

  function onVehicleChange() {
    state.service.vehicleType = els.vehicleType.value;
    populateServiceOptions();
    calculatePricing();
    renderDrivers();
  }

  function onServiceChange() {
    state.service.serviceType = els.serviceType.value;
    calculatePricing();
    renderDrivers();
  }

  function sendOtp() {
    toast('OTP demo đã gửi: 123456');
  }

  function verifyOtp() {
    if (els.otpInput.value.trim() === '123456') {
      state.otpVerified = true;
      els.otpSuccess.classList.remove('hidden');
      toast('Xác minh OTP thành công.');
    } else {
      state.otpVerified = false;
      els.otpSuccess.classList.add('hidden');
      toast('OTP chưa đúng. Dùng mã demo 123456.');
    }
  }

  function prevStep() {
    if (state.step > 1) {
      state.step -= 1;
      updateWizard();
    }
  }

  async function nextStep() {
    const ok = await validateStep(state.step);
    if (!ok) return;

    if (state.step < 6) {
      state.step += 1;
      if (state.step === 6) {
        await finalizeBooking();
      }
      updateWizard();
    } else {
      resetApp();
    }
  }

  async function validateStep(step) {
    switch (step) {
      case 1:
        if (!state.customer.name || !state.customer.phone) return toast('Vui lòng nhập họ tên và số điện thoại.'), false;
        if (!state.otpVerified) return toast('Bạn cần xác minh OTP trước.'), false;
        return true;
      case 2:
        if (!state.customer.licensePlate) return toast('Vui lòng nhập biển số xe.'), false;
        return true;
      case 3:
        if (!state.location.lat || !state.location.lng) return toast('Vui lòng chọn vị trí hợp lệ.'), false;
        return true;
      case 4:
        if (!state.selectedDriverId) return toast('Hãy chọn tài xế từ map hoặc danh sách.'), false;
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  }

  async function finalizeBooking() {
    if (!state.selectedDriverId) return;
    state.bookingCode = `${BANK_INFO.notePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    els.summaryCode.textContent = `#${state.bookingCode}`;
    els.bankNote.textContent = state.bookingCode;
    renderBookingSummary();
    renderTrackingCard();
    await ensureRouteToSelectedDriver();
    startTrackingSimulation();
    localStorage.setItem('resq-last-booking', JSON.stringify(buildBookingSnapshot()));
  }

  function buildBookingSnapshot() {
    const driver = getSelectedDriver();
    return {
      code: state.bookingCode,
      customer: state.customer,
      service: {
        vehicleType: state.service.vehicleType,
        serviceType: state.service.serviceType,
        priority: state.service.priority,
        note: state.service.note
      },
      payment: state.payment,
      driver: driver ? { name: driver.name, phone: driver.phone, rating: driver.rating } : null,
      location: state.location,
      total: state.prices.total,
      createdAt: new Date().toISOString()
    };
  }

  function renderTrackingCard() {
    const driver = getSelectedDriver();
    if (!driver) return;
    els.trackingDriverName.textContent = driver.name;
    els.trackingDriverRating.textContent = `${driver.rating}`;
    els.trackingDriverPhone.textContent = driver.phone;
    els.trackingPaymentType.textContent = state.payment === 'cash' ? 'Tiền mặt' : 'Chuyển khoản';
    els.callDriverBtn.href = `tel:${driver.phone}`;
    renderTrackingTimeline();
  }

  function renderTrackingTimeline() {
    const labels = state.lang === 'vi'
      ? ['Đã nhận yêu cầu', 'Tài xế đang di chuyển', 'Tài xế đã tới nơi', 'Đang kiểm tra / xử lý', 'Hoàn thành']
      : ['Request received', 'Driver is on the way', 'Driver arrived', 'Inspecting / working', 'Completed'];
    state.tracking.statusLabels = labels;

    els.trackingTimeline.innerHTML = labels.map((label, index) => {
      const statusClass = index < state.tracking.statusIndex ? 'done' : index === state.tracking.statusIndex ? 'active' : '';
      return `
        <div class="timeline-item ${statusClass}">
          <span class="timeline-dot"></span>
          <strong>${label}</strong>
        </div>
      `;
    }).join('');

    els.trackingCurrentStep.textContent = labels[Math.min(state.tracking.statusIndex, labels.length - 1)] || '--';
    els.jobStatusPill.textContent = labels[Math.min(state.tracking.statusIndex, labels.length - 1)] || '--';
  }

  function startTrackingSimulation() {
    trackingTimer && clearInterval(trackingTimer);
    state.tracking.statusIndex = 0;
    renderTrackingTimeline();

    const driver = getSelectedDriver();
    if (!driver) return;

    if (!state.routeCoords.length) {
      state.tracking.etaText = `${driver.etaMin} phút`;
      els.trackingEta.textContent = state.tracking.etaText;
      els.trackingDistance.textContent = formatDistance(driver.distanceKm);
      return;
    }

    let pathIndex = 0;
    const totalPoints = state.routeCoords.length;

    const advanceStatus = (progress) => {
      if (progress >= 0.95) state.tracking.statusIndex = 4;
      else if (progress >= 0.78) state.tracking.statusIndex = 3;
      else if (progress >= 0.52) state.tracking.statusIndex = 2;
      else if (progress >= 0.16) state.tracking.statusIndex = 1;
      else state.tracking.statusIndex = 0;
      renderTrackingTimeline();
    };

    trackingTimer = setInterval(() => {
      if (pathIndex >= totalPoints) {
        clearInterval(trackingTimer);
        state.tracking.statusIndex = 4;
        state.tracking.etaText = state.lang === 'vi' ? 'Đã xong' : 'Done';
        state.tracking.distanceKm = 0;
        els.trackingEta.textContent = state.tracking.etaText;
        els.trackingDistance.textContent = formatDistance(0);
        renderTrackingTimeline();
        return;
      }

      const latlng = state.routeCoords[pathIndex];
      const marker = driverMarkers.get(driver.id);
      if (marker) marker.setLatLng(latlng);

      const remaining = totalPoints - pathIndex;
      const etaMin = Math.max(0, Math.round(remaining / 12));
      const distanceKm = calcDistanceKm(latlng[0], latlng[1], state.location.lat, state.location.lng);
      state.tracking.etaText = etaMin === 0 ? (state.lang === 'vi' ? 'Đã xong' : 'Done') : `${etaMin} ${state.lang === 'vi' ? 'phút' : 'min'}`;
      state.tracking.distanceKm = distanceKm;
      els.trackingEta.textContent = state.tracking.etaText;
      els.trackingDistance.textContent = formatDistance(distanceKm);
      advanceStatus(pathIndex / totalPoints);

      pathIndex += 1;
    }, 400);
  }

  function updateWizard() {
    els.stepPanels.forEach((panel) => panel.classList.toggle('active', Number(panel.dataset.step) === state.step));
    els.stepCounter.textContent = `${state.step} / 6`;
    renderStepChips();
    els.prevBtn.disabled = state.step === 1;
    els.prevBtn.style.opacity = state.step === 1 ? '0.55' : '1';

    if (state.step === 6) {
      els.prevBtn.textContent = STRINGS[state.lang].backToPayment;
      els.nextBtn.textContent = STRINGS[state.lang].newBooking;
    } else {
      els.prevBtn.textContent = state.lang === 'vi' ? 'Quay lại' : 'Back';
      els.nextBtn.textContent = state.lang === 'vi' ? 'Tiếp tục' : 'Continue';
    }
  }

  function calculatePricing() {
    const service = SERVICE_CATALOG[state.service.serviceType];
    const base = service?.price || 0;
    const condition = state.service.flags.parkingHard ? 15000 : 0;
    const priority = state.service.priority === 'urgent' ? 18000 : state.service.priority === 'sos' ? 35000 : 0;
    const time = (state.service.flags.night ? 25000 : 0) + (state.service.flags.rain ? 12000 : 0) + (state.service.flags.peak ? 15000 : 0);

    const driver = getSelectedDriver();
    const distanceSource = driver ? driver.distanceKm : nearestDriverDistance();
    const distance = distanceSource <= 1.5 ? 12000 : Math.round(distanceSource * 9000);

    let fuel = 0;
    if (state.service.fuelDelivery) {
      const selectedFuel = FUEL_PRICES[state.service.fuelType];
      fuel = (selectedFuel?.price || 0) * Number(state.service.fuelLiters || 1) + SERVICE_CATALOG.fuel_delivery.price;
    }

    const total = base + condition + priority + time + distance + fuel;
    state.prices = { base, condition, priority, time, distance, fuel, total };

    els.lineBasePrice.textContent = formatMoney(base);
    els.lineConditionFee.textContent = formatMoney(condition);
    els.linePriorityFee.textContent = formatMoney(priority);
    els.lineTimeFee.textContent = formatMoney(time);
    els.lineDistanceFee.textContent = formatMoney(distance);
    els.lineFuelFee.textContent = formatMoney(fuel);
    els.lineFinalPrice.textContent = formatMoney(total);
    els.estimatedTotal.textContent = formatMoney(total);
  }

  function renderBookingSummary() {
    const driver = getSelectedDriver();
    const service = SERVICE_CATALOG[state.service.serviceType];
    const summary = [
      ['Khách hàng', `${state.customer.name || '--'} · ${state.customer.phone || '--'}`],
      ['Dịch vụ', service ? (state.lang === 'vi' ? service.labelVi : service.labelEn) : '--'],
      ['Vị trí', state.location.address || `${state.location.lat.toFixed(5)}, ${state.location.lng.toFixed(5)}`],
      ['Tài xế', driver ? driver.name : '--'],
      ['Thanh toán', state.payment === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'],
      ['Lưu ý', state.service.note || 'Không có ghi chú thêm'],
      ['Tổng tạm tính', formatMoney(state.prices.total)]
    ];

    els.bookingSummaryList.innerHTML = summary.map(([label, value]) => `
      <div class="summary-row">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `).join('');
  }

  function nearestDriverDistance() {
    return Math.min(...state.drivers.map((driver) => driver.distanceKm || 1.4), 1.4);
  }

  function getSelectedDriver() {
    return state.drivers.find((driver) => driver.id === state.selectedDriverId) || null;
  }

  function getServicesForVehicle(vehicleType) {
    return Object.entries(SERVICE_CATALOG)
      .filter(([, svc]) => svc.vehicleTypes.includes(vehicleType))
      .map(([key, svc]) => ({ key, ...svc }));
  }

  async function searchAddress() {
    const query = els.addressInput.value.trim();
    if (!query) return toast('Vui lòng nhập địa chỉ cần tìm.');
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query + ', Ho Chi Minh City, Vietnam')}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      const data = await res.json();
      if (!data.length) return toast('Không tìm thấy địa chỉ phù hợp.');
      const result = data[0];
      setCustomerLocation(Number(result.lat), Number(result.lon), result.display_name);
      map.setView([state.location.lat, state.location.lng], 15);
      renderDrivers();
      renderDriverMarkers();
      calculatePricing();
      toast('Đã cập nhật vị trí theo địa chỉ.');
    } catch (error) {
      toast('Không thể tìm địa chỉ lúc này.');
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return toast('Trình duyệt không hỗ trợ lấy vị trí hiện tại.');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      setCustomerLocation(pos.coords.latitude, pos.coords.longitude, state.location.address);
      map.setView([state.location.lat, state.location.lng], 15);
      await reverseGeocode();
      renderDrivers();
      renderDriverMarkers();
      calculatePricing();
      toast('Đã cập nhật vị trí hiện tại.');
    }, () => toast('Không thể lấy vị trí hiện tại.'));
  }

  async function reverseGeocode() {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${state.location.lat}&lon=${state.location.lng}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      const data = await res.json();
      if (data?.display_name) {
        state.location.address = data.display_name;
        els.addressInput.value = data.display_name;
      }
    } catch (error) {
      // ignore demo failures
    }
  }

  function updateLocationFromInputs() {
    const lat = Number(els.latInput.value);
    const lng = Number(els.lngInput.value);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    setCustomerLocation(lat, lng, els.addressInput.value.trim() || state.location.address);
    map.setView([lat, lng], 15);
    renderDrivers();
    renderDriverMarkers();
    calculatePricing();
  }

  function setCustomerLocation(lat, lng, address) {
    state.location.lat = lat;
    state.location.lng = lng;
    state.location.address = address;
    customerMarker.setLatLng([lat, lng]);
    syncLocationInputs();
  }

  function syncLocationInputs() {
    els.latInput.value = state.location.lat.toFixed(6);
    els.lngInput.value = state.location.lng.toFixed(6);
    els.addressInput.value = state.location.address;
  }

  async function getRoute(fromLat, fromLng, toLat, toLng) {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      const coords = data.routes?.[0]?.geometry?.coordinates || [];
      return coords.map(([lng, lat]) => [lat, lng]);
    } catch (error) {
      toast('Không thể tính tuyến đường lúc này.');
      return [];
    }
  }

  function drawRoute(coords, fit) {
    state.routeCoords = coords;
    clearRoute();
    routeLine = L.polyline(coords, {
      color: '#73f0d7',
      weight: 5,
      opacity: 0.92,
      lineJoin: 'round'
    }).addTo(map);

    if (fit) {
      map.fitBounds(routeLine.getBounds(), { padding: [28, 28] });
    }
  }

  async function ensureRouteToSelectedDriver() {
    const driver = getSelectedDriver();
    if (!driver) return;
    if (!state.routeCoords.length || selectedRoutePreviewDriverId !== driver.id) {
      await previewRoute(driver.id, true);
    }
    els.trackingEta.textContent = `${driver.etaMin} phút`;
    els.trackingDistance.textContent = formatDistance(driver.distanceKm);
  }

  function clearRoute() {
    if (routeLine) map.removeLayer(routeLine);
    routeLine = null;
  }

  function setLanguage(lang) {
    state.lang = lang;
    localStorage.setItem('resq-lang', lang);
    document.documentElement.lang = lang;
    els.langBtns.forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === lang));
    applyI18nTexts();
    populateVehicleOptions();
    populateServiceOptions();
    populateFuelOptions();
    renderStepChips();
    renderDrivers();
    renderTrackingTimeline();
    if (state.bookingCode) renderBookingSummary();
  }

  function applyI18nTexts() {
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      const value = STRINGS[state.lang][key];
      if (value) node.textContent = value;
    });
  }

  function resetApp() {
    state.step = 1;
    state.otpVerified = false;
    state.selectedDriverId = null;
    state.bookingCode = '';
    state.service = {
      vehicleType: 'motorbike',
      serviceType: 'flat_tire_tube_patch',
      priority: 'normal',
      note: '',
      flags: { night: false, rain: false, peak: false, parkingHard: false },
      fuelDelivery: false,
      fuelType: 'e5',
      fuelLiters: 1
    };
    state.customer = { name: '', phone: '', licensePlate: '' };
    state.payment = 'cash';
    state.routeCoords = [];
    trackingTimer && clearInterval(trackingTimer);
    selectedRoutePreviewDriverId = null;
    seedDrivers();
    customerMarker.setLatLng([10.7769, 106.7009]);
    state.location = { lat: 10.7769, lng: 106.7009, address: 'Quận 1, TP.HCM' };
    [els.customerName, els.customerPhone, els.otpInput, els.licensePlate, els.serviceNote].forEach((input) => input.value = '');
    els.priorityLevel.value = 'normal';
    els.fuelDeliveryToggle.checked = false;
    els.fuelFields.classList.add('hidden');
    els.otpSuccess.classList.add('hidden');
    els.toggleChips.forEach((chip) => chip.classList.remove('active'));
    syncLocationInputs();
    populateVehicleOptions();
    populateServiceOptions();
    populateFuelOptions();
    selectPayment('cash');
    renderDrivers();
    renderDriverMarkers();
    clearRoute();
    calculatePricing();
    updateWizard();
    toast('Đã tạo booking mới.');
  }

  function skillLabel(skill) {
    const labels = {
      flat_tire: 'Vá lốp',
      battery: 'Ắc quy',
      fuel_delivery: 'Mua xăng hộ',
      engine: 'Máy',
      oil_change: 'Nhớt',
      ev_charge: 'Sạc điện',
      ev_battery: 'Bình xe điện',
      repair_basic: 'Sửa nhẹ',
      brake: 'Bố thắng',
      lights: 'Điện / đèn',
      tow: 'Kéo xe'
    };
    return labels[skill] || skill;
  }

  function formatMoney(num) {
    return `${Math.round(num).toLocaleString('vi-VN')}đ`;
  }

  function formatDistance(km) {
    return `${km.toFixed(1)} km`;
  }

  function calcDistanceKm(lat1, lng1, lat2, lng2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function toast(message) {
    const node = document.createElement('div');
    node.textContent = message;
    node.style.position = 'fixed';
    node.style.left = '50%';
    node.style.bottom = '18px';
    node.style.transform = 'translateX(-50%)';
    node.style.background = 'rgba(8, 18, 36, 0.92)';
    node.style.border = '1px solid rgba(88, 239, 208, 0.3)';
    node.style.color = '#eef4ff';
    node.style.padding = '12px 16px';
    node.style.borderRadius = '14px';
    node.style.zIndex = '50';
    node.style.boxShadow = '0 14px 38px rgba(0,0,0,0.28)';
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2400);
  }
})();
