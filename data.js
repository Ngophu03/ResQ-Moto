window.APP_DATA = (() => {
  const DISTRICT_CENTERS = {
    q1: { name: 'Quận 1', lat: 10.7769, lng: 106.7009 },
    q3: { name: 'Quận 3', lat: 10.7867, lng: 106.6917 },
    bt: { name: 'Bình Thạnh', lat: 10.8087, lng: 106.7091 },
    pn: { name: 'Phú Nhuận', lat: 10.8002, lng: 106.6803 },
    tb: { name: 'Tân Bình', lat: 10.8017, lng: 106.6521 },
    gv: { name: 'Gò Vấp', lat: 10.8387, lng: 106.6656 },
    q5: { name: 'Quận 5', lat: 10.7547, lng: 106.6635 },
    q7: { name: 'Quận 7', lat: 10.7297, lng: 106.7219 },
    tp: { name: 'Thủ Đức', lat: 10.8491, lng: 106.7530 },
    q10: { name: 'Quận 10', lat: 10.7721, lng: 106.6679 }
  };

  const DRIVERS = [
    { id: 'd01', name: 'Nguyễn Minh Quân', zone: 'q1', rating: 4.9, completed: 684, phone: '0901112233', vehicle: 'motorbike', skills: ['flat_tire', 'battery', 'fuel_delivery'], feedback: ['Đến nhanh', 'Làm gọn', 'Báo giá rõ ràng'] },
    { id: 'd02', name: 'Trần Quốc Huy', zone: 'q3', rating: 4.8, completed: 541, phone: '0901223344', vehicle: 'motorbike', skills: ['flat_tire', 'engine', 'oil_change'], feedback: ['Thân thiện', 'Nhiệt tình', 'Đúng hẹn'] },
    { id: 'd03', name: 'Lê Hoàng Phúc', zone: 'bt', rating: 4.9, completed: 801, phone: '0901334455', vehicle: 'motorbike', skills: ['fuel_delivery', 'battery', 'ev_charge'], feedback: ['Lịch sự', 'Giải thích kỹ', 'Phù hợp shipper'] },
    { id: 'd04', name: 'Phạm Gia Bảo', zone: 'pn', rating: 4.7, completed: 468, phone: '0901445566', vehicle: 'motorbike', skills: ['flat_tire', 'brake', 'lights'], feedback: ['Làm có tâm', 'Không chặt chém', 'Có đồ nghề đầy đủ'] },
    { id: 'd05', name: 'Đỗ Thanh Long', zone: 'tb', rating: 4.8, completed: 733, phone: '0901556677', vehicle: 'motorbike', skills: ['fuel_delivery', 'oil_change', 'engine'], feedback: ['Rất nhanh', 'Nói chuyện dễ chịu', 'Giá hợp lý'] },
    { id: 'd06', name: 'Bùi Khánh Nam', zone: 'gv', rating: 4.6, completed: 396, phone: '0901667788', vehicle: 'motorbike', skills: ['flat_tire', 'battery', 'repair_basic'], feedback: ['Ổn áp', 'Dễ liên hệ', 'Phù hợp cứu hộ nhanh'] },
    { id: 'd07', name: 'Vũ Thành Đạt', zone: 'q5', rating: 4.8, completed: 512, phone: '0901778899', vehicle: 'motorbike', skills: ['ev_charge', 'ev_battery', 'fuel_delivery'], feedback: ['Hiểu xe điện', 'Hỗ trợ tốt', 'Đến đúng chỗ'] },
    { id: 'd08', name: 'Huỳnh Tấn Tài', zone: 'q7', rating: 4.9, completed: 905, phone: '0901889900', vehicle: 'motorbike', skills: ['flat_tire', 'tow', 'fuel_delivery'], feedback: ['Chuyên nghiệp', 'Đi đêm tốt', 'Xử lý khéo'] },
    { id: 'd09', name: 'Ngô Đức Anh', zone: 'tp', rating: 4.7, completed: 423, phone: '0901990011', vehicle: 'motorbike', skills: ['ev_charge', 'ev_battery', 'lights'], feedback: ['Tận tình', 'Có kiến thức', 'Đúng giờ'] },
    { id: 'd10', name: 'Mai Nhật Khang', zone: 'q10', rating: 4.8, completed: 612, phone: '0902112233', vehicle: 'motorbike', skills: ['battery', 'engine', 'oil_change'], feedback: ['Bình tĩnh', 'Gọn gàng', 'Tư vấn tốt'] },
    { id: 'd11', name: 'Đặng Khánh Nam', zone: 'q1', rating: 4.7, completed: 387, phone: '0903223344', vehicle: 'motorbike', skills: ['flat_tire', 'fuel_delivery'], feedback: ['Đến nhanh', 'Báo trước khi tới', 'Gọi dễ'] },
    { id: 'd12', name: 'Trịnh Gia Hưng', zone: 'bt', rating: 4.8, completed: 492, phone: '0904334455', vehicle: 'motorbike', skills: ['battery', 'ev_charge', 'fuel_delivery'], feedback: ['Rõ ràng', 'Cẩn thận', 'Làm sạch sẽ'] }
  ];

  const SERVICE_CATALOG = {
    flat_tire_tube_patch: { vehicleTypes: ['motorbike'], labelVi: 'Vá thường bánh ruột', labelEn: 'Tube tire patch', price: 18000, tags: ['flat_tire'] },
    flat_tire_tube_change: { vehicleTypes: ['motorbike'], labelVi: 'Thay ruột', labelEn: 'Replace tube', price: 95000, tags: ['flat_tire'] },
    tubeless_plug: { vehicleTypes: ['scooter'], labelVi: 'Vá dùi không ruột', labelEn: 'Tubeless plug repair', price: 45000, tags: ['flat_tire'] },
    tubeless_mushroom: { vehicleTypes: ['scooter'], labelVi: 'Vá nấm không ruột', labelEn: 'Tubeless mushroom repair', price: 65000, tags: ['flat_tire'] },
    spark_plug: { vehicleTypes: ['motorbike', 'scooter'], labelVi: 'Thay bugi', labelEn: 'Spark plug replacement', price: 80000, tags: ['repair_basic'] },
    oil_change_bike: { vehicleTypes: ['motorbike'], labelVi: 'Thay nhớt xe số', labelEn: 'Oil change (manual bike)', price: 100000, tags: ['oil_change'] },
    oil_change_scooter: { vehicleTypes: ['scooter'], labelVi: 'Thay nhớt xe tay ga', labelEn: 'Oil change (scooter)', price: 160000, tags: ['oil_change'] },
    injector_clean: { vehicleTypes: ['motorbike', 'scooter'], labelVi: 'Vệ sinh kim phun / chế hòa khí', labelEn: 'Injector / carburetor cleaning', price: 120000, tags: ['engine'] },
    brake_pad: { vehicleTypes: ['motorbike', 'scooter'], labelVi: 'Thay bố thắng', labelEn: 'Brake pad replacement', price: 140000, tags: ['brake'] },
    electric_lights: { vehicleTypes: ['motorbike', 'scooter'], labelVi: 'Sửa điện / đèn', labelEn: 'Electrical / lights repair', price: 90000, tags: ['lights'] },
    ev_charge: { vehicleTypes: ['ev'], labelVi: 'Cứu hộ sạc pin tận nơi', labelEn: 'On-site EV charging', price: 110000, tags: ['ev_charge'] },
    ev_battery: { vehicleTypes: ['ev'], labelVi: 'Thay bình xe điện', labelEn: 'EV battery replacement', price: 650000, tags: ['ev_battery'] },
    rescue_basic: { vehicleTypes: ['motorbike', 'scooter', 'ev'], labelVi: 'Sửa nhẹ tại chỗ', labelEn: 'Basic roadside repair', price: 90000, tags: ['repair_basic'] },
    tow_under_5: { vehicleTypes: ['motorbike', 'scooter', 'ev'], labelVi: 'Kéo xe dưới 5km', labelEn: 'Towing under 5km', price: 150000, tags: ['tow'] },
    tire_replace_standard: { vehicleTypes: ['motorbike', 'scooter'], labelVi: 'Thay lốp tiêu chuẩn', labelEn: 'Standard tire replacement', price: 380000, tags: ['flat_tire'] },
    battery_replace: { vehicleTypes: ['motorbike', 'scooter'], labelVi: 'Thay bình ắc quy xe máy', labelEn: 'Motorbike battery replacement', price: 320000, tags: ['battery'] },
    fuel_delivery: { vehicleTypes: ['motorbike', 'scooter', 'ev'], labelVi: 'Mua xăng hộ / tiếp nhiên liệu', labelEn: 'Fuel delivery', price: 35000, tags: ['fuel_delivery'] }
  };

  const FUEL_PRICES = {
    e5: { vi: 'Xăng E5', en: 'E5 Petrol', price: 23000 },
    ron95: { vi: 'Xăng RON95', en: 'RON95 Petrol', price: 25000 },
    diesel: { vi: 'Dầu Diesel', en: 'Diesel', price: 21500 }
  };

  const BANK_INFO = {
    bank: 'Vietcombank',
    accountNumber: '1020304056',
    accountName: 'RESQ MOTO DEMO',
    notePrefix: 'RESQ'
  };

  const STRINGS = {
    vi: {
      brandSub: 'Roadside assistance & repair tại TP.HCM',
      priceBtn: 'Bảng giá',
      adminBtn: 'Admin',
      heroEyebrow: 'Đặt cứu hộ nhanh',
      heroTitle: 'Từng bước rõ ràng, dễ thao tác',
      heroDesc: 'Xác thực khách, chọn dịch vụ, chọn vị trí, chọn tài xế, thanh toán và theo dõi trên bản đồ theo từng bước.',
      stepCount: '6 / 6',
      mapTitle: 'Bản đồ trực quan',
      mapDesc: 'Hiển thị tất cả tài xế trên map. Bấm trực tiếp vào marker để chọn hoặc xem tuyến đường.',
      coverage: 'Khu vực hoạt động TP.HCM · 24/7',
      noticePrice: 'Phí dịch vụ có thể tăng hoặc giảm tùy tình trạng xe thực tế, vị trí đỗ xe, thời tiết và giao thông.',
      bookingSummary: 'Tóm tắt booking',
      newBooking: 'Tạo booking mới',
      backToPayment: 'Quay lại thanh toán'
     
    },
    en: {
      brandSub: 'Roadside assistance & repair in Ho Chi Minh City',
      priceBtn: 'Pricing',
      adminBtn: 'Admin',
      heroEyebrow: 'Quick roadside booking',
      heroTitle: 'Clear steps, easy to use',
      heroDesc: 'Verify customer, choose service, set location, pick a driver, pay, then track the trip step by step.',
      stepCount: '6 / 6',
      mapTitle: 'Live map view',
      mapDesc: 'All drivers are shown on the map. Click any marker to select a driver or preview the route.',
      coverage: 'HCMC service area · 24/7',
      noticePrice: 'Service price may increase or decrease depending on actual vehicle condition, parking accessibility, weather and traffic.',
      bookingSummary: 'Booking summary',
      newBooking: 'Create new booking',
      backToPayment: 'Back to payment'
    }
  };

  return {
    DISTRICT_CENTERS,
    DRIVERS,
    SERVICE_CATALOG,
    FUEL_PRICES,
    BANK_INFO,
    STRINGS
  };
})();
