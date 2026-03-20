
(() => {
  const { mechanics, serviceCatalog, pricingCatalog, fuelPrices, bankInfo, translations } = window.APP_DATA;

  const state = {
    language: 'vi',
    currentStep: 1,
    vehicleType: 'motorbike',
    selectedServiceCategory: null,
    selectedServiceValue: null,
    paymentMethod: 'cash',
    fuelEnabled: false,
    selectedMechanicId: null,
    customer: {
      name: '',
      phone: '',
      plate: '',
      brand: '',
      address: 'Quận 1, TP.HCM',
      lat: 10.7769,
      lng: 106.7009
    },
    routeCoords: [],
    routeDistanceKm: 0,
    routeDurationMin: 0,
    bookingId: null,
    trackingTimer: null,
    trackIndex: 0,
    selectedOrder: [...mechanics],
    map: null,
    routeLine: null,
    customerMarker: null,
    markersById: {}
  };

  const els = {};

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    bindElements();
    initMap();
    seedState();
    bindEvents();
    applyTranslations();
    renderPricingDrawer();
    renderServiceControls();
    renderMechanicMarkers();
    renderDriverList();
    updateFuelUI();
    updateBankInfo();
    updatePricingPreview();
    updateStepUI();
    updateCustomerLocationUI();
    updateSummary();
  }

  function bindElements() {
    els.stepScreens = [...document.querySelectorAll('.step-screen')];
    els.stepChips = [...document.querySelectorAll('.step-chip')];
    els.currentStepBadge = document.getElementById('currentStepBadge');
    els.customerName = document.getElementById('customerName');
    els.customerPhone = document.getElementById('customerPhone');
    els.licensePlate = document.getElementById('licensePlate');
    els.vehicleBrand = document.getElementById('vehicleBrand');
    els.otpCode = document.getElementById('otpCode');
    els.sendOtpBtn = document.getElementById('sendOtpBtn');
    els.verifyContinueBtn = document.getElementById('verifyContinueBtn');

    els.vehicleTypeGroup = document.getElementById('vehicleTypeGroup');
    els.serviceCategory = document.getElementById('serviceCategory');
    els.serviceOption = document.getElementById('serviceOption');
    els.priorityMode = document.getElementById('priorityMode');
    els.conditionLevel = document.getElementById('conditionLevel');
    els.issueDescription = document.getElementById('issueDescription');
    els.fuelDeliveryToggle = document.getElementById('fuelDeliveryToggle');
    els.fuelDeliveryBox = document.getElementById('fuelDeliveryBox');
    els.fuelType = document.getElementById('fuelType');
    els.fuelLiters = document.getElementById('fuelLiters');
    els.fuelSubtotal = document.getElementById('fuelSubtotal');
    els.fuelDeliveryFee = document.getElementById('fuelDeliveryFee');
    els.serviceBackBtn = document.getElementById('serviceBackBtn');
    els.serviceContinueBtn = document.getElementById('serviceContinueBtn');

    els.addressInput = document.getElementById('addressInput');
    els.searchAddressBtn = document.getElementById('searchAddressBtn');
    els.useCurrentLocationBtn = document.getElementById('useCurrentLocationBtn');
    els.latLngText = document.getElementById('latLngText');
    els.resolvedAddressText = document.getElementById('resolvedAddressText');
    els.locationBackBtn = document.getElementById('locationBackBtn');
    els.locationContinueBtn = document.getElementById('locationContinueBtn');

    els.refreshDriversBtn = document.getElementById('refreshDriversBtn');
    els.fitDriversBtn = document.getElementById('fitDriversBtn');
    els.driverList = document.getElementById('driverList');
    els.selectedDriverCard = document.getElementById('selectedDriverCard');
    els.driverBackBtn = document.getElementById('driverBackBtn');
    els.driverContinueBtn = document.getElementById('driverContinueBtn');

    els.paymentCards = [...document.querySelectorAll('.payment-card')];
    els.bankInfoCard = document.getElementById('bankInfoCard');
    els.bankNameText = document.getElementById('bankNameText');
    els.bankAccountText = document.getElementById('bankAccountText');
    els.bankOwnerText = document.getElementById('bankOwnerText');
    els.bankContentText = document.getElementById('bankContentText');
    els.totalPriceText = document.getElementById('totalPriceText');
    els.priceBreakdown = document.getElementById('priceBreakdown');
    els.paymentBackBtn = document.getElementById('paymentBackBtn');
    els.paymentContinueBtn = document.getElementById('paymentContinueBtn');

    els.trackingDriverName = document.getElementById('trackingDriverName');
    els.trackingStatusBadge = document.getElementById('trackingStatusBadge');
    els.trackingDriverMeta = document.getElementById('trackingDriverMeta');
    els.etaText = document.getElementById('etaText');
    els.distanceText = document.getElementById('distanceText');
    els.tripStepText = document.getElementById('tripStepText');
    els.tripTimeline = document.getElementById('tripTimeline');
    els.bookingSummary = document.getElementById('bookingSummary');
    els.callDriverBtn = document.getElementById('callDriverBtn');
    els.chatDriverBtn = document.getElementById('chatDriverBtn');
    els.recalculateRouteBtn = document.getElementById('recalculateRouteBtn');
    els.trackingBackBtn = document.getElementById('trackingBackBtn');
    els.newBookingBtn = document.getElementById('newBookingBtn');

    els.mapHintText = document.getElementById('mapHintText');
    els.togglePricingBtn = document.getElementById('togglePricingBtn');
    els.pricingDrawer = document.getElementById('pricingDrawer');
    els.pricingContent = document.getElementById('pricingContent');
    els.closePricingBtn = document.getElementById('closePricingBtn');
    els.langViBtn = document.getElementById('langViBtn');
    els.langEnBtn = document.getElementById('langEnBtn');
    els.toastContainer = document.getElementById('toastContainer');
  }

  function seedState() {
    const first = serviceCatalog[state.vehicleType][0];
    state.selectedServiceCategory = first.category;
    state.selectedServiceValue = first.value;
    state.selectedOrder = sortMechanics([...mechanics]);
  }

  function bindEvents() {
    els.sendOtpBtn.addEventListener('click', () => toast(t('otpSent'), 'info'));
    els.verifyContinueBtn.addEventListener('click', handleVerifyContinue);

    els.vehicleTypeGroup.addEventListener('click', handleVehicleChipClick);
    els.serviceCategory.addEventListener('change', handleServiceCategoryChange);
    els.serviceOption.addEventListener('change', () => {
      state.selectedServiceValue = els.serviceOption.value;
      updatePricingPreview();
    });
    [els.priorityMode, els.conditionLevel].forEach(el => el.addEventListener('change', updatePricingPreview));
    els.issueDescription.addEventListener('input', updateSummary);
    els.fuelDeliveryToggle.addEventListener('change', () => {
      state.fuelEnabled = els.fuelDeliveryToggle.checked;
      updateFuelUI();
      updatePricingPreview();
    });
    [els.fuelType, els.fuelLiters].forEach(el => el.addEventListener('input', () => {
      updateFuelUI();
      updatePricingPreview();
    }));
    els.serviceBackBtn.addEventListener('click', () => goToStep(1));
    els.serviceContinueBtn.addEventListener('click', () => {
      updatePricingPreview();
      goToStep(3);
    });

    els.searchAddressBtn.addEventListener('click', searchAddress);
    els.addressInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchAddress();
      }
    });
    els.useCurrentLocationBtn.addEventListener('click', useCurrentLocation);
    els.locationBackBtn.addEventListener('click', () => goToStep(2));
    els.locationContinueBtn.addEventListener('click', () => {
      updateCustomerLocationUI();
      goToStep(4);
      fitAllDrivers();
    });

    els.refreshDriversBtn.addEventListener('click', () => {
      state.selectedOrder = sortMechanics([...mechanics], true);
      renderDriverList();
      renderMechanicMarkers();
    });
    els.fitDriversBtn.addEventListener('click', fitAllDrivers);
    els.driverBackBtn.addEventListener('click', () => goToStep(3));
    els.driverContinueBtn.addEventListener('click', () => {
      if (!state.selectedMechanicId) {
        toast(t('selectDriverFirst'), 'error');
        return;
      }
      goToStep(5);
      updatePricingPreview();
    });

    els.paymentCards.forEach(card => card.addEventListener('click', () => {
      els.paymentCards.forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      state.paymentMethod = card.dataset.payment;
      updateBankInfo();
      updateSummary();
    }));
    els.paymentBackBtn.addEventListener('click', () => goToStep(4));
    els.paymentContinueBtn.addEventListener('click', confirmBooking);

    els.callDriverBtn.addEventListener('click', () => toast(t('driverCalled'), 'info'));
    els.chatDriverBtn.addEventListener('click', () => toast(t('driverChatted'), 'info'));
    els.recalculateRouteBtn.addEventListener('click', () => {
      if (!state.selectedMechanicId) return;
      previewRoute(state.selectedMechanicId, true);
    });
    els.trackingBackBtn.addEventListener('click', () => {
      stopTracking();
      goToStep(5);
    });
    els.newBookingBtn.addEventListener('click', resetApp);

    els.togglePricingBtn.addEventListener('click', () => {
      els.pricingDrawer.classList.add('is-open');
      toast(t('pricingOpenToast'), 'info');
    });
    els.closePricingBtn.addEventListener('click', () => els.pricingDrawer.classList.remove('is-open'));

    els.langViBtn.addEventListener('click', () => switchLanguage('vi'));
    els.langEnBtn.addEventListener('click', () => switchLanguage('en'));

    document.addEventListener('click', handleDelegatedClick);
  }

  function t(key) {
    return translations[state.language][key] || key;
  }

  function switchLanguage(lang) {
    state.language = lang;
    els.langViBtn.classList.toggle('is-active', lang === 'vi');
    els.langEnBtn.classList.toggle('is-active', lang === 'en');
    applyTranslations();
    renderPricingDrawer();
    renderServiceControls();
    renderDriverList();
    updateSelectedDriverCard();
    updateBankInfo();
    updatePricingPreview();
    updateTripUI();
    updateSummary();
    renderMechanicMarkers();
  }

  function applyTranslations() {
    document.documentElement.lang = state.language;
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.dataset.i18n;
      const value = t(key);
      if (value) node.innerHTML = value;
    });
    els.currentStepBadge.textContent = `${state.currentStep} / 6`;
  }

  function handleVehicleChipClick(event) {
    const button = event.target.closest('.choice-chip');
    if (!button) return;
    state.vehicleType = button.dataset.value;
    [...els.vehicleTypeGroup.children].forEach(chip => chip.classList.remove('is-selected'));
    button.classList.add('is-selected');
    renderServiceControls();
    updatePricingPreview();
  }

  function handleServiceCategoryChange() {
    const list = getServiceOptions().filter(item => item.category === els.serviceCategory.value);
    if (list.length) state.selectedServiceValue = list[0].value;
    state.selectedServiceCategory = els.serviceCategory.value;
    renderServiceOptions();
    updatePricingPreview();
  }

  function getServiceOptions() {
    return serviceCatalog[state.vehicleType] || serviceCatalog.motorbike;
  }

  function renderServiceControls() {
    const options = getServiceOptions();
    const categories = [...new Set(options.map(item => item.category))];
    if (!categories.includes(state.selectedServiceCategory)) state.selectedServiceCategory = categories[0];

    els.serviceCategory.innerHTML = categories.map(cat => {
      const title = pricingCatalog[cat] ? pricingCatalog[cat][state.language].title : cat;
      return `<option value="${cat}" ${cat === state.selectedServiceCategory ? 'selected' : ''}>${title}</option>`;
    }).join('');

    renderServiceOptions();
    updateSummary();
  }

  function renderServiceOptions() {
    const options = getServiceOptions().filter(item => item.category === state.selectedServiceCategory);
    if (!options.some(item => item.value === state.selectedServiceValue)) state.selectedServiceValue = options[0]?.value || null;
    els.serviceOption.innerHTML = options.map(item => {
      const label = state.language === 'vi' ? item.labelVi : item.labelEn;
      return `<option value="${item.value}" ${item.value === state.selectedServiceValue ? 'selected' : ''}>${label}</option>`;
    }).join('');
  }

  function updateFuelUI() {
    els.fuelDeliveryBox.classList.toggle('hidden', !state.fuelEnabled);
    const liters = Math.max(1, Number(els.fuelLiters.value || 1));
    els.fuelLiters.value = liters;
    const fuelType = els.fuelType.value;
    const fuelSub = liters * (fuelPrices[fuelType] || 0);
    const deliveryFee = state.fuelEnabled ? 25000 : 0;
    els.fuelSubtotal.textContent = formatCurrency(fuelSub);
    els.fuelDeliveryFee.textContent = formatCurrency(deliveryFee);
    updateSummary();
  }

  function initMap() {
    state.map = L.map('map', {
      zoomControl: true,
      center: [state.customer.lat, state.customer.lng],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(state.map);

    state.customerMarker = L.marker([state.customer.lat, state.customer.lng], {
      draggable: true,
      icon: L.divIcon({
        className: '',
        html: '<div class="customer-pin"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(state.map);

    state.customerMarker.bindTooltip('Customer', { direction: 'top', offset: [0, -12] });

    state.customerMarker.on('dragend', async (e) => {
      const latlng = e.target.getLatLng();
      setCustomerLocation(latlng.lat, latlng.lng);
      await reverseGeocode(latlng.lat, latlng.lng);
      toast(t('locationUpdated'), 'success');
    });

    state.map.on('click', async (e) => {
      if (state.currentStep !== 3) return;
      setCustomerLocation(e.latlng.lat, e.latlng.lng);
      await reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
  }

  function renderMechanicMarkers() {
    Object.values(state.markersById).forEach(marker => marker.remove());
    state.markersById = {};

    sortMechanics([...mechanics]).forEach(mechanic => {
      const selected = mechanic.id === state.selectedMechanicId;
      const marker = L.marker([mechanic.lat, mechanic.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div class="driver-pin ${selected ? 'selected' : ''}"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(state.map);

      marker.bindPopup(getPopupHtml(mechanic));
      state.markersById[mechanic.id] = marker;
    });
  }

  function getPopupHtml(mechanic) {
    const feedback = mechanic.feedback.slice(0, 2).join(' · ');
    return `
      <div class="popup-card">
        <h4>${mechanic.name}</h4>
        <p>⭐ ${mechanic.rating} · ${mechanic.jobs} jobs</p>
        <p>${mechanic.district} · ETA ${mechanic.eta}m</p>
        <p>${feedback}</p>
        <div class="popup-actions">
          <button class="popup-choose" data-action="choose-driver" data-id="${mechanic.id}">${t('driverPopupChoose')}</button>
          <button class="popup-preview" data-action="preview-route" data-id="${mechanic.id}">${t('driverPopupPreview')}</button>
        </div>
      </div>
    `;
  }

  function sortMechanics(list, randomize = false) {
    const base = list.map(item => ({
      ...item,
      distanceKm: getDistanceKm(item.lat, item.lng, state.customer.lat, state.customer.lng)
    })).sort((a, b) => (a.distanceKm + (5 - a.rating)) - (b.distanceKm + (5 - b.rating)));

    if (!randomize) return base;
    const head = base.slice(0, 8).sort(() => Math.random() - 0.5);
    return [...head, ...base.slice(8)];
  }

  function renderDriverList() {
    const category = state.selectedServiceCategory;
    const order = (state.selectedOrder.length ? state.selectedOrder : mechanics).map(item => ({
      ...item,
      distanceKm: getDistanceKm(item.lat, item.lng, state.customer.lat, state.customer.lng)
    }));
    els.driverList.innerHTML = order.map(driver => {
      const selected = driver.id === state.selectedMechanicId;
      const feedback = driver.feedback.map(tag => `<span>${tag}</span>`).join('');
      return `
        <article class="driver-card ${selected ? 'is-selected' : ''}">
          <div class="driver-top">
            <div>
              <h4>${driver.name}</h4>
              <p>${driver.district} · ⭐ ${driver.rating} · ${driver.jobs} jobs</p>
            </div>
            <div class="badge-soft">${driver.distanceKm.toFixed(1)} km</div>
          </div>
          <div class="driver-meta-row">
            <div><span class="mini-label">ETA</span><strong>${driver.eta}m</strong></div>
            <div><span class="mini-label">${state.language === 'vi' ? 'Kỹ năng' : 'Skills'}</span><strong>${humanizeSkills(driver.skills, category)}</strong></div>
            <div><span class="mini-label">${state.language === 'vi' ? 'Khu vực' : 'Area'}</span><strong>${driver.district}</strong></div>
          </div>
          <div class="feedback-tags">${feedback}</div>
          <div class="driver-actions">
            <button class="btn btn-secondary" data-action="preview-route" data-id="${driver.id}" type="button">${t('driverPopupPreview')}</button>
            <button class="btn btn-primary" data-action="choose-driver" data-id="${driver.id}" type="button">${t('driverPopupChoose')}</button>
          </div>
        </article>
      `;
    }).join('');
    updateSelectedDriverCard();
  }

  function humanizeSkills(skills, category) {
    const dict = {
      puncture: state.language === 'vi' ? 'Vá xe' : 'Puncture',
      rescue: state.language === 'vi' ? 'Cứu hộ' : 'Rescue',
      electric: state.language === 'vi' ? 'Xe điện' : 'Electric',
      basicRepair: state.language === 'vi' ? 'Sửa cơ bản' : 'Repair',
      tire: state.language === 'vi' ? 'Lốp' : 'Tire'
    };
    const first = skills.find(item => dict[item]) || category;
    return dict[first] || first;
  }

  function updateSelectedDriverCard() {
    const mechanic = getSelectedMechanic();
    if (!mechanic) {
      els.selectedDriverCard.classList.add('hidden');
      els.selectedDriverCard.innerHTML = '';
      return;
    }
    const dist = getDistanceKm(mechanic.lat, mechanic.lng, state.customer.lat, state.customer.lng);
    els.selectedDriverCard.classList.remove('hidden');
    els.selectedDriverCard.innerHTML = `
      <div class="driver-top">
        <div>
          <span class="mini-label">${t('stepSummaryDriver')}</span>
          <h4>${mechanic.name}</h4>
          <p>${mechanic.district} · ⭐ ${mechanic.rating} · ${mechanic.jobs} jobs</p>
        </div>
        <div class="badge-soft">${dist.toFixed(1)} km</div>
      </div>
      <div class="driver-meta-row">
        <div><span class="mini-label">ETA</span><strong>${mechanic.eta}m</strong></div>
        <div><span class="mini-label">${state.language === 'vi' ? 'SĐT' : 'Phone'}</span><strong>${mechanic.phone}</strong></div>
        <div><span class="mini-label">${state.language === 'vi' ? 'Phản hồi' : 'Feedback'}</span><strong>${mechanic.feedback[0]}</strong></div>
      </div>
    `;
  }

  function updateCustomerLocationUI() {
    els.latLngText.textContent = `${state.customer.lat.toFixed(5)}, ${state.customer.lng.toFixed(5)}`;
    els.resolvedAddressText.textContent = state.customer.address;
    els.addressInput.value = state.customer.address;
    updateSummary();
  }

  function setCustomerLocation(lat, lng) {
    state.customer.lat = lat;
    state.customer.lng = lng;
    state.customerMarker.setLatLng([lat, lng]);
    state.map.panTo([lat, lng]);
    updateCustomerLocationUI();
    state.selectedOrder = sortMechanics([...mechanics]);
    renderDriverList();
    renderMechanicMarkers();
    if (state.selectedMechanicId) previewRoute(state.selectedMechanicId, false);
  }

  async function searchAddress() {
    const q = els.addressInput.value.trim();
    if (!q) return;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q + ', Ho Chi Minh City, Vietnam')}`;
      const response = await fetch(url, { headers: { 'Accept-Language': state.language === 'vi' ? 'vi' : 'en' }});
      const data = await response.json();
      if (!data.length) {
        toast(t('geocodeError'), 'error');
        return;
      }
      const item = data[0];
      setCustomerLocation(Number(item.lat), Number(item.lon));
      state.customer.address = item.display_name;
      updateCustomerLocationUI();
      toast(t('locationUpdated'), 'success');
    } catch (error) {
      toast(t('geocodeError'), 'error');
    }
  }

  async function reverseGeocode(lat, lng) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
      const response = await fetch(url, { headers: { 'Accept-Language': state.language === 'vi' ? 'vi' : 'en' }});
      const data = await response.json();
      state.customer.address = data.display_name || state.customer.address;
      updateCustomerLocationUI();
    } catch (error) {
      // silent fallback
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      toast(t('locationError'), 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(async pos => {
      setCustomerLocation(pos.coords.latitude, pos.coords.longitude);
      await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      toast(t('locationUpdated'), 'success');
    }, () => toast(t('locationError'), 'error'), {
      enableHighAccuracy: true,
      timeout: 7000
    });
  }

  function handleVerifyContinue() {
    state.customer.name = els.customerName.value.trim();
    state.customer.phone = els.customerPhone.value.trim();
    state.customer.plate = els.licensePlate.value.trim();
    state.customer.brand = els.vehicleBrand.value.trim();

    if (!state.customer.name || !state.customer.phone || !state.customer.plate) {
      toast(t('verifyMissing'), 'error');
      return;
    }
    if (els.otpCode.value.trim() !== '123456') {
      toast(t('otpInvalid'), 'error');
      return;
    }
    goToStep(2);
  }

  function handleDelegatedClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const { action, id } = target.dataset;
    if (action === 'choose-driver') {
      selectMechanic(id, true);
    } else if (action === 'preview-route') {
      previewRoute(id, true);
    }
  }

  function selectMechanic(id, openStep = false) {
    state.selectedMechanicId = id;
    renderDriverList();
    renderMechanicMarkers();
    updateSelectedDriverCard();
    previewRoute(id, true);
    toast(t('driverSelected'), 'success');
    if (openStep && state.currentStep < 4) goToStep(4);
  }

  async function previewRoute(mechanicId, fit = true) {
    const mechanic = mechanics.find(item => item.id === mechanicId);
    if (!mechanic) return;

    try {
      const coords = await fetchRoute([mechanic.lng, mechanic.lat], [state.customer.lng, state.customer.lat]);
      state.routeCoords = coords.points;
      state.routeDistanceKm = coords.distanceKm;
      state.routeDurationMin = coords.durationMin;

      if (state.routeLine) state.routeLine.remove();
      state.routeLine = L.polyline(coords.points, {
        color: '#46f1be',
        weight: 6,
        opacity: 0.95,
        lineJoin: 'round'
      }).addTo(state.map);

      if (fit) {
        const bounds = L.latLngBounds(coords.points);
        state.map.fitBounds(bounds.pad(0.22));
      }
      updatePricingPreview();
      updateTripUI();
      toast(t('previewRouteReady'), 'success');
    } catch (error) {
      toast('Route unavailable right now.', 'error');
    }
  }

  async function fetchRoute(originLonLat, destLonLat) {
    const url = `https://router.project-osrm.org/route/v1/driving/${originLonLat[0]},${originLonLat[1]};${destLonLat[0]},${destLonLat[1]}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();
    const route = data.routes?.[0];
    if (!route) throw new Error('No route');
    return {
      points: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
      distanceKm: route.distance / 1000,
      durationMin: Math.max(1, Math.round(route.duration / 60))
    };
  }

  function fitAllDrivers() {
    const points = mechanics.map(item => [item.lat, item.lng]);
    points.push([state.customer.lat, state.customer.lng]);
    state.map.fitBounds(points, { padding: [40, 40] });
  }

  function getSelectedService() {
    return getServiceOptions().find(item => item.value === state.selectedServiceValue) || getServiceOptions()[0];
  }

  function getSelectedMechanic() {
    return mechanics.find(item => item.id === state.selectedMechanicId) || null;
  }

  function calculatePricing() {
    const service = getSelectedService();
    const mechanic = getSelectedMechanic();
    const base = service?.basePrice || 0;
    const conditionFee = { light: 0, medium: 25000, hard: 60000 }[els.conditionLevel.value] || 0;
    const priorityFee = { normal: 0, priority: 30000, sos: 70000 }[els.priorityMode.value] || 0;
    const hour = new Date().getHours();
    const nightFee = (hour >= 20 || hour < 6) ? 25000 : 0;
    const travelDistance = mechanic ? getDistanceKm(mechanic.lat, mechanic.lng, state.customer.lat, state.customer.lng) : 2;
    const travelFee = Math.max(15000, Math.round(travelDistance * 8000));
    const fuelType = els.fuelType.value;
    const liters = Number(els.fuelLiters.value || 0);
    const fuelSub = state.fuelEnabled ? liters * (fuelPrices[fuelType] || 0) : 0;
    const fuelDelivery = state.fuelEnabled ? 25000 : 0;
    const total = base + conditionFee + priorityFee + nightFee + travelFee + fuelSub + fuelDelivery;

    return {
      base,
      conditionFee,
      priorityFee,
      nightFee,
      travelFee,
      fuelSub,
      fuelDelivery,
      total
    };
  }

  function updatePricingPreview() {
    const price = calculatePricing();
    const rows = [
      [t('pricingBase'), price.base],
      [t('pricingCondition'), price.conditionFee],
      [t('pricingPriority'), price.priorityFee],
      [t('pricingNight'), price.nightFee],
      [t('pricingTravel'), price.travelFee]
    ];
    if (state.fuelEnabled) {
      rows.push([t('pricingFuel'), price.fuelSub]);
      rows.push([t('pricingFuelDelivery'), price.fuelDelivery]);
    }
    rows.push([t('pricingTotal'), price.total]);
    els.totalPriceText.textContent = formatCurrency(price.total);
    els.priceBreakdown.innerHTML = rows.map(([label, value], idx) => `
      <div class="breakdown-row ${idx === rows.length - 1 ? 'is-total' : ''}">
        <span>${label}</span>
        <strong>${formatCurrency(value)}</strong>
      </div>
    `).join('');
    updateSummary();
  }

  function updateBankInfo() {
    const transfer = state.paymentMethod === 'transfer';
    els.bankInfoCard.classList.toggle('hidden', !transfer);
    els.bankNameText.textContent = bankInfo.bankName;
    els.bankAccountText.textContent = bankInfo.accountNumber;
    els.bankOwnerText.textContent = bankInfo.accountOwner;
    els.bankContentText.textContent = `${bankInfo.transferPrefix}-${state.customer.phone || 'PHONE'}`;
  }

  function updateSummary() {
    const service = getSelectedService();
    const mechanic = getSelectedMechanic();
    const price = calculatePricing();
    const paymentText = state.paymentMethod === 'cash' ? t('payCash') : t('payTransfer');
    const serviceLabel = state.language === 'vi' ? service?.labelVi : service?.labelEn;

    const fuelPart = state.fuelEnabled
      ? `<div class="breakdown-row"><span>${state.language === 'vi' ? 'Nhiên liệu' : 'Fuel'}</span><strong>${els.fuelType.value.toUpperCase()} · ${els.fuelLiters.value}L</strong></div>`
      : '';

    els.bookingSummary.innerHTML = `
      <div class="breakdown-row"><span>${t('stepSummaryVerify')}</span><strong>${state.customer.name || '—'} · ${state.customer.phone || '—'}</strong></div>
      <div class="breakdown-row"><span>${t('stepSummaryService')}</span><strong>${serviceLabel || '—'}</strong></div>
      <div class="breakdown-row"><span>${t('stepSummaryLocation')}</span><strong>${state.customer.address || '—'}</strong></div>
      <div class="breakdown-row"><span>${t('stepSummaryDriver')}</span><strong>${mechanic?.name || '—'}</strong></div>
      <div class="breakdown-row"><span>${t('stepSummaryPayment')}</span><strong>${paymentText}</strong></div>
      ${fuelPart}
      <div class="breakdown-row"><span>${t('stepSummaryNote')}</span><strong>${els.issueDescription.value.trim() || (state.language === 'vi' ? 'Không có ghi chú thêm' : 'No extra note')}</strong></div>
      <div class="breakdown-row"><span>${t('pricingTotal')}</span><strong>${formatCurrency(price.total)}</strong></div>
    `;
  }

  function confirmBooking() {
    if (!state.selectedMechanicId) {
      toast(t('selectDriverFirst'), 'error');
      return;
    }
    state.bookingId = `RSQ-${Date.now()}`;
    saveBooking();
    goToStep(6);
    startTracking();
    toast(t('bookingConfirmed'), 'success');
  }

  function saveBooking() {
    const service = getSelectedService();
    const mechanic = getSelectedMechanic();
    const price = calculatePricing();
    const bookings = JSON.parse(localStorage.getItem('resqBookings') || '[]');
    bookings.unshift({
      id: state.bookingId,
      createdAt: new Date().toISOString(),
      customerName: state.customer.name,
      phone: state.customer.phone,
      plate: state.customer.plate,
      address: state.customer.address,
      vehicleType: state.vehicleType,
      service: state.language === 'vi' ? service.labelVi : service.labelEn,
      mechanic: mechanic?.name || '',
      payment: state.paymentMethod,
      total: price.total
    });
    localStorage.setItem('resqBookings', JSON.stringify(bookings.slice(0, 20)));
  }

  function startTracking() {
    stopTracking();
    state.trackIndex = 0;
    const mechanic = getSelectedMechanic();
    if (!mechanic) return;

    if (!state.routeCoords.length) {
      state.routeCoords = [[mechanic.lat, mechanic.lng], [state.customer.lat, state.customer.lng]];
      state.routeDistanceKm = getDistanceKm(mechanic.lat, mechanic.lng, state.customer.lat, state.customer.lng);
      state.routeDurationMin = Math.max(3, Math.round(state.routeDistanceKm * 4));
    }

    updateTripUI();
    const marker = state.markersById[mechanic.id];
    if (!marker) return;

    state.trackingTimer = setInterval(() => {
      const points = state.routeCoords;
      if (!points.length) return;

      state.trackIndex = Math.min(state.trackIndex + 1, points.length - 1);
      marker.setLatLng(points[state.trackIndex]);
      const progress = points.length <= 1 ? 1 : state.trackIndex / (points.length - 1);

      if (progress >= 1) {
        clearInterval(state.trackingTimer);
        state.trackingTimer = null;
      }
      updateTripUI(progress);
    }, 350);
  }

  function stopTracking() {
    if (state.trackingTimer) clearInterval(state.trackingTimer);
    state.trackingTimer = null;
    const mechanic = getSelectedMechanic();
    const marker = mechanic ? state.markersById[mechanic.id] : null;
    if (mechanic && marker) marker.setLatLng([mechanic.lat, mechanic.lng]);
  }

  function updateTripUI(progress = 0) {
    const mechanic = getSelectedMechanic();
    if (!mechanic) return;

    const totalPoints = Math.max(1, state.routeCoords.length - 1);
    const ratio = state.routeCoords.length ? state.trackIndex / totalPoints : 0;
    const effectiveProgress = Math.max(progress, ratio);

    let statusKey = 'statusAssigned';
    let stepKey = 'timelineAssigned';
    if (effectiveProgress > 0.08) { statusKey = 'statusOnWay'; stepKey = 'timelineOnWay'; }
    if (effectiveProgress > 0.82) { statusKey = 'statusArrived'; stepKey = 'timelineArrived'; }
    if (effectiveProgress > 0.92) { statusKey = 'statusWorking'; stepKey = 'timelineWorking'; }
    if (effectiveProgress >= 1) { statusKey = 'statusDone'; stepKey = 'timelineDone'; }

    const remainRatio = Math.max(0, 1 - effectiveProgress);
    const eta = effectiveProgress >= 1 ? 0 : Math.max(1, Math.round(state.routeDurationMin * remainRatio));
    const dist = effectiveProgress >= 1 ? 0 : Math.max(0, state.routeDistanceKm * remainRatio);

    els.trackingDriverName.textContent = mechanic.name;
    els.trackingStatusBadge.textContent = t(statusKey);
    els.etaText.textContent = eta === 0 ? (state.language === 'vi' ? 'Đã xong' : 'Done') : `${eta} min`;
    els.distanceText.textContent = `${dist.toFixed(1)} km`;
    els.tripStepText.textContent = t(stepKey);

    els.trackingDriverMeta.innerHTML = `
      <div class="meta"><span class="mini-label">⭐ Rating</span><strong>${mechanic.rating}</strong></div>
      <div class="meta"><span class="mini-label">${state.language === 'vi' ? 'SĐT' : 'Phone'}</span><strong>${mechanic.phone}</strong></div>
      <div class="meta"><span class="mini-label">${state.language === 'vi' ? 'Thanh toán' : 'Payment'}</span><strong>${state.paymentMethod === 'cash' ? t('payCash') : t('payTransfer')}</strong></div>
    `;

    const timelineKeys = ['timelineAssigned', 'timelineOnWay', 'timelineArrived', 'timelineWorking', 'timelineDone'];
    const activeIndex = ['statusAssigned', 'statusOnWay', 'statusArrived', 'statusWorking', 'statusDone'].indexOf(statusKey);
    els.tripTimeline.innerHTML = timelineKeys.map((key, index) => {
      const cls = index < activeIndex ? 'is-complete' : index === activeIndex ? 'is-active' : '';
      return `<li class="${cls}">${t(key)}</li>`;
    }).join('');
    updateSummary();
  }

  function updateStepUI() {
    els.stepScreens.forEach((screen, idx) => screen.classList.toggle('is-active', idx + 1 === state.currentStep));
    els.stepChips.forEach((chip, idx) => {
      chip.classList.toggle('is-active', idx + 1 === state.currentStep);
      chip.classList.toggle('is-complete', idx + 1 < state.currentStep);
    });
    document.body.classList.toggle('mode-tracking', state.currentStep === 6);
    els.appShell?.classList.toggle('is-tracking', state.currentStep === 6);
    els.currentStepBadge.textContent = `${state.currentStep} / 6`;
    const hints = {
      1: state.language === 'vi' ? 'Điền thông tin cơ bản để bắt đầu.' : 'Fill in the basics to get started.',
      2: state.language === 'vi' ? 'Chọn đúng loại dịch vụ để giá và gợi ý tài xế chính xác hơn.' : 'Choose the correct service for a better estimate and driver suggestion.',
      3: state.language === 'vi' ? 'Click trên map hoặc dùng GPS để xác nhận điểm đón.' : 'Click the map or use GPS to confirm the pickup point.',
      4: t('mapHintDrivers'),
      5: state.language === 'vi' ? 'Kiểm tra tạm tính và chọn phương thức thanh toán.' : 'Review the estimate and choose your payment method.',
      6: state.language === 'vi' ? 'Theo dõi hành trình và liên hệ tài xế khi cần.' : 'Track the trip and contact the driver when needed.'
    };
    els.mapHintText.textContent = hints[state.currentStep];
    setTimeout(() => state.map?.invalidateSize(), 120);
  }

  function goToStep(step) {
    state.currentStep = step;
    updateStepUI();
    if (step === 4) {
      renderDriverList();
      renderMechanicMarkers();
      fitAllDrivers();
    }
    if (step === 6) {
      updateTripUI();
    }
  }

  function renderPricingDrawer() {
    els.pricingContent.innerHTML = Object.values(pricingCatalog).map(group => `
      <section class="price-category">
        <h4>${group[state.language].title}</h4>
        ${group[state.language].items.map(([name, price]) => `
          <div class="price-item"><span>${name}</span><strong>${price}</strong></div>
        `).join('')}
      </section>
    `).join('');
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value || 0)) + 'đ';
  }

  function toast(message, type = 'success') {
    const node = document.createElement('div');
    node.className = `toast ${type}`;
    node.innerHTML = message;
    els.toastContainer.appendChild(node);
    setTimeout(() => node.remove(), 2600);
  }

  function getDistanceKm(lat1, lng1, lat2, lng2) {
    if (!state.map) {
      return haversine(lat1, lng1, lat2, lng2);
    }
    return state.map.distance([lat1, lng1], [lat2, lng2]) / 1000;
  }

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = v => v * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon/2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function resetApp() {
    stopTracking();
    localStorage.removeItem('resqChatMock');
    window.location.reload();
  }
})();
