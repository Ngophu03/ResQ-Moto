
window.APP_DATA = (() => {
  const bankInfo = {
    bankName: 'Vietcombank',
    accountNumber: '1020304056',
    accountOwner: 'RESQ MOTO DEMO',
    transferPrefix: 'RESQ'
  };

  const fuelPrices = {
    e5: 23000,
    ron95: 24500,
    diesel: 21200
  };

  const pricingCatalog = {
    puncture: {
      vi: {
        title: 'Vá xe – thủng lốp',
        items: [
          ['Xe máy (bánh ruột) · Vá thường', '10.000 – 20.000đ'],
          ['Xe máy (bánh ruột) · Vá keo / vá ép', '20.000 – 40.000đ'],
          ['Xe máy (bánh ruột) · Thay ruột', '80.000 – 150.000đ'],
          ['Xe tay ga (bánh không ruột) · Vá dùi', '20.000 – 50.000đ'],
          ['Xe tay ga (bánh không ruột) · Vá nấm', '40.000 – 80.000đ'],
          ['Ban đêm / gọi tận nơi', '+20.000 – 50.000đ']
        ]
      },
      en: {
        title: 'Puncture & tire repair',
        items: [
          ['Motorbike tube tire · Standard patch', '10,000 – 20,000 VND'],
          ['Motorbike tube tire · Glue / hot patch', '20,000 – 40,000 VND'],
          ['Motorbike tube tire · Replace inner tube', '80,000 – 150,000 VND'],
          ['Scooter tubeless · Plug repair', '20,000 – 50,000 VND'],
          ['Scooter tubeless · Mushroom patch', '40,000 – 80,000 VND'],
          ['Night / onsite surcharge', '+20,000 – 50,000 VND']
        ]
      }
    },
    basicRepair: {
      vi: {
        title: 'Sửa xe cơ bản',
        items: [
          ['Thay bugi', '40.000 – 120.000đ'],
          ['Thay nhớt xe số', '80.000 – 120.000đ'],
          ['Thay nhớt xe tay ga', '120.000 – 250.000đ'],
          ['Vệ sinh chế hòa khí / kim phun', '80.000 – 200.000đ'],
          ['Thay bố thắng trước / sau', '80.000 – 200.000đ'],
          ['Sửa điện, đèn', '50.000 – 150.000đ']
        ]
      },
      en: {
        title: 'Basic repairs',
        items: [
          ['Replace spark plug', '40,000 – 120,000 VND'],
          ['Engine oil replacement · Manual bike', '80,000 – 120,000 VND'],
          ['Engine oil replacement · Scooter', '120,000 – 250,000 VND'],
          ['Clean carburetor / injector', '80,000 – 200,000 VND'],
          ['Brake pad replacement', '80,000 – 200,000 VND'],
          ['Electrical / lighting repair', '50,000 – 150,000 VND']
        ]
      }
    },
    electric: {
      vi: {
        title: 'Xe điện',
        items: [
          ['Sạc điện tại tiệm', '5.000 – 20.000đ/lần'],
          ['Cứu hộ sạc pin tận nơi', '50.000 – 150.000đ'],
          ['Thay bình ắc quy loại thường', '300.000 – 900.000đ/bình'],
          ['Combo 4–5 bình', '1,2 – 3 triệu']
        ]
      },
      en: {
        title: 'Electric vehicles',
        items: [
          ['Charge at shop', '5,000 – 20,000 VND / session'],
          ['Onsite charging rescue', '50,000 – 150,000 VND'],
          ['Battery replacement · Standard', '300,000 – 900,000 VND / battery'],
          ['4–5 battery combo', '1.2 – 3 million VND']
        ]
      }
    },
    rescue: {
      vi: {
        title: 'Cứu hộ xe',
        items: [
          ['Vá xe tận nơi', '50.000 – 100.000đ'],
          ['Sửa nhẹ tại chỗ', '50.000 – 150.000đ'],
          ['Kéo xe về tiệm dưới 5km', '100.000 – 200.000đ'],
          ['Quãng đường xa hơn', '+10.000 – 20.000đ/km'],
          ['Ban đêm / mưa / giờ cao điểm', 'Giá cao hơn']
        ]
      },
      en: {
        title: 'Roadside rescue',
        items: [
          ['Onsite puncture repair', '50,000 – 100,000 VND'],
          ['Minor onsite repair', '50,000 – 150,000 VND'],
          ['Tow to garage under 5km', '100,000 – 200,000 VND'],
          ['Longer distance', '+10,000 – 20,000 VND / km'],
          ['Night / rain / peak hours', 'Higher price']
        ]
      }
    },
    tire: {
      vi: {
        title: 'Thay lốp xe',
        items: [
          ['Lốp xe số', '250.000 – 400.000đ'],
          ['Lốp xe tay ga', '350.000 – 700.000đ'],
          ['Lốp xịn Michelin / Pirelli', '700.000 – 1,5 triệu']
        ]
      },
      en: {
        title: 'Tire replacement',
        items: [
          ['Manual bike tire', '250,000 – 400,000 VND'],
          ['Scooter tire', '350,000 – 700,000 VND'],
          ['Premium tire Michelin / Pirelli', '700,000 – 1.5 million VND']
        ]
      }
    },
    other: {
      vi: {
        title: 'Dịch vụ khác',
        items: [
          ['Rửa xe', '20.000 – 50.000đ'],
          ['Sơn dàn áo', '500.000 – 2 triệu'],
          ['Độ xe nhẹ', '200.000 – vài triệu'],
          ['Thay bình ắc quy xe máy', '250.000 – 500.000đ']
        ]
      },
      en: {
        title: 'Other services',
        items: [
          ['Bike wash', '20,000 – 50,000 VND'],
          ['Body repaint', '500,000 – 2 million VND'],
          ['Light upgrade / accessories', '200,000 – several million VND'],
          ['Motorbike battery replacement', '250,000 – 500,000 VND']
        ]
      }
    }
  };

  const serviceCatalog = {
    motorbike: [
      { category: 'puncture', value: 'patch_basic', labelVi: 'Vá thường bánh ruột', labelEn: 'Tube patch - standard', basePrice: 18000 },
      { category: 'puncture', value: 'patch_glue', labelVi: 'Vá keo / vá ép', labelEn: 'Glue / hot patch', basePrice: 35000 },
      { category: 'puncture', value: 'replace_tube', labelVi: 'Thay ruột', labelEn: 'Replace inner tube', basePrice: 120000 },
      { category: 'basicRepair', value: 'spark_plug', labelVi: 'Thay bugi', labelEn: 'Replace spark plug', basePrice: 70000 },
      { category: 'basicRepair', value: 'engine_oil_bike', labelVi: 'Thay nhớt xe số', labelEn: 'Engine oil change - manual bike', basePrice: 100000 },
      { category: 'basicRepair', value: 'carb_clean', labelVi: 'Vệ sinh chế hòa khí / kim phun', labelEn: 'Clean carburetor / injector', basePrice: 140000 },
      { category: 'rescue', value: 'onsite_rescue', labelVi: 'Cứu hộ / sửa nhẹ tại chỗ', labelEn: 'Onsite rescue / quick repair', basePrice: 90000 },
      { category: 'tire', value: 'replace_tire_bike', labelVi: 'Thay lốp xe số', labelEn: 'Replace manual bike tire', basePrice: 330000 }
    ],
    scooter: [
      { category: 'puncture', value: 'plug_tubeless', labelVi: 'Vá dùi bánh không ruột', labelEn: 'Tubeless plug repair', basePrice: 45000 },
      { category: 'puncture', value: 'mushroom_patch', labelVi: 'Vá nấm bánh không ruột', labelEn: 'Tubeless mushroom patch', basePrice: 70000 },
      { category: 'basicRepair', value: 'engine_oil_scooter', labelVi: 'Thay nhớt xe tay ga', labelEn: 'Engine oil change - scooter', basePrice: 180000 },
      { category: 'basicRepair', value: 'brake_pad', labelVi: 'Thay bố thắng', labelEn: 'Replace brake pads', basePrice: 140000 },
      { category: 'rescue', value: 'onsite_rescue_scooter', labelVi: 'Cứu hộ xe tay ga', labelEn: 'Scooter rescue', basePrice: 110000 },
      { category: 'tire', value: 'replace_tire_scooter', labelVi: 'Thay lốp xe tay ga', labelEn: 'Replace scooter tire', basePrice: 520000 }
    ],
    electric: [
      { category: 'electric', value: 'shop_charge', labelVi: 'Sạc điện tại chỗ', labelEn: 'Charge on site', basePrice: 25000 },
      { category: 'electric', value: 'onsite_charge', labelVi: 'Cứu hộ sạc pin tận nơi', labelEn: 'Onsite charging rescue', basePrice: 120000 },
      { category: 'electric', value: 'battery_replace', labelVi: 'Thay bình ắc quy', labelEn: 'Battery replacement', basePrice: 650000 },
      { category: 'rescue', value: 'electric_rescue', labelVi: 'Cứu hộ xe điện', labelEn: 'Electric vehicle rescue', basePrice: 130000 }
    ],
    car: [
      { category: 'rescue', value: 'car_rescue', labelVi: 'Cứu hộ ô tô cơ bản', labelEn: 'Basic car rescue', basePrice: 180000 },
      { category: 'rescue', value: 'tow_near', labelVi: 'Kéo xe dưới 5km', labelEn: 'Tow under 5km', basePrice: 180000 },
      { category: 'basicRepair', value: 'electrical_fix', labelVi: 'Sửa điện / đèn', labelEn: 'Electrical / lighting repair', basePrice: 120000 }
    ]
  };

  const mechanics = [
    { id: 'm1', name: 'Nguyễn Minh Quân', lat: 10.7789, lng: 106.6998, rating: 4.9, jobs: 826, eta: 6, district: 'Quận 1', skills: ['motorbike','scooter','puncture','rescue'], feedback: ['Đến nhanh', 'Làm cẩn thận', 'Giá rõ ràng'], phone: '0901112233' },
    { id: 'm2', name: 'Trần Quốc Huy', lat: 10.7852, lng: 106.6972, rating: 4.8, jobs: 715, eta: 7, district: 'Quận 3', skills: ['motorbike','scooter','basicRepair','rescue'], feedback: ['Nhiệt tình', 'Gọn gàng', 'Dễ trao đổi'], phone: '0901112244' },
    { id: 'm3', name: 'Lê Hoàng Phúc', lat: 10.7991, lng: 106.6903, rating: 4.9, jobs: 910, eta: 10, district: 'Phú Nhuận', skills: ['motorbike','scooter','puncture','tire'], feedback: ['Tay nghề tốt', 'Đúng giờ', 'Rất chuyên nghiệp'], phone: '0901112255' },
    { id: 'm4', name: 'Phạm Đức Anh', lat: 10.8048, lng: 106.7141, rating: 4.7, jobs: 562, eta: 9, district: 'Bình Thạnh', skills: ['motorbike','electric','rescue'], feedback: ['Thân thiện', 'Có kinh nghiệm xe điện', 'Tư vấn kỹ'], phone: '0901112266' },
    { id: 'm5', name: 'Võ Gia Hưng', lat: 10.7712, lng: 106.6825, rating: 4.8, jobs: 648, eta: 8, district: 'Quận 5', skills: ['motorbike','scooter','basicRepair'], feedback: ['Sạch sẽ', 'Giá hợp lý', 'Nhẹ nhàng'], phone: '0901112277' },
    { id: 'm6', name: 'Đặng Khánh Nam', lat: 10.7614, lng: 106.6922, rating: 4.6, jobs: 501, eta: 11, district: 'Quận 4', skills: ['motorbike','rescue','tow'], feedback: ['Có mặt đúng hẹn', 'Hỗ trợ tốt', 'Phản hồi nhanh'], phone: '0901112288' },
    { id: 'm7', name: 'Bùi Nhật Long', lat: 10.7876, lng: 106.7207, rating: 4.9, jobs: 878, eta: 12, district: 'Bình Thạnh', skills: ['electric','rescue','basicRepair'], feedback: ['Giỏi xe điện', 'Tư vấn nhiệt tình', 'Có tâm'], phone: '0901112299' },
    { id: 'm8', name: 'Ngô Thành Đạt', lat: 10.8078, lng: 106.6588, rating: 4.7, jobs: 534, eta: 14, district: 'Tân Bình', skills: ['motorbike','scooter','puncture'], feedback: ['Làm nhanh', 'Dễ chịu', 'Phí rõ'], phone: '0901112300' },
    { id: 'm9', name: 'Huỳnh Gia Bảo', lat: 10.8411, lng: 106.6651, rating: 4.8, jobs: 690, eta: 17, district: 'Gò Vấp', skills: ['motorbike','scooter','basicRepair','rescue'], feedback: ['Tới đúng vị trí', 'Lịch sự', 'Chuẩn giờ'], phone: '0901112311' },
    { id: 'm10', name: 'Đỗ Thanh Bình', lat: 10.8283, lng: 106.6325, rating: 4.7, jobs: 489, eta: 18, district: 'Tân Phú', skills: ['motorbike','electric','tire'], feedback: ['Tay nghề khá', 'Giải thích rõ', 'Ổn áp'], phone: '0901112322' },
    { id: 'm11', name: 'Mai Hữu Tín', lat: 10.7727, lng: 106.6434, rating: 4.9, jobs: 740, eta: 15, district: 'Quận 11', skills: ['motorbike','scooter','rescue'], feedback: ['Tới nhanh', 'Cực kỳ thân thiện', 'Cứu hộ ổn'], phone: '0901112333' },
    { id: 'm12', name: 'Tạ Minh Khang', lat: 10.7461, lng: 106.6408, rating: 4.6, jobs: 420, eta: 19, district: 'Quận 8', skills: ['motorbike','tow','rescue'], feedback: ['Được việc', 'Nhanh nhẹn', 'Hỗ trợ tốt'], phone: '0901112344' },
    { id: 'm13', name: 'Phan Việt Dũng', lat: 10.7291, lng: 106.6954, rating: 4.8, jobs: 682, eta: 16, district: 'Quận 7', skills: ['motorbike','scooter','electric'], feedback: ['Xe điện tốt', 'Dễ trao đổi', 'Giữ lời'], phone: '0901112355' },
    { id: 'm14', name: 'Lý Quốc Vinh', lat: 10.7527, lng: 106.7172, rating: 4.9, jobs: 912, eta: 13, district: 'Quận 2', skills: ['motorbike','scooter','tire','puncture'], feedback: ['Tay nghề cao', 'Rất nhanh', 'Đáng tin'], phone: '0901112366' },
    { id: 'm15', name: 'Đinh Tuấn Kiệt', lat: 10.7448, lng: 106.7802, rating: 4.7, jobs: 470, eta: 22, district: 'Thủ Đức', skills: ['electric','rescue'], feedback: ['Am hiểu xe điện', 'Có mặt nhanh', 'Ổn định'], phone: '0901112377' },
    { id: 'm16', name: 'Châu Thiên Phú', lat: 10.8204, lng: 106.7347, rating: 4.8, jobs: 699, eta: 20, district: 'Thủ Đức', skills: ['motorbike','basicRepair','rescue'], feedback: ['Rất cẩn thận', 'Giao tiếp tốt', 'Dịch vụ tốt'], phone: '0901112388' }
  ];

  const translations = {
    vi: {
      togglePricing: 'Bảng giá',
      openAdmin: 'Admin',
      panelEyebrow: 'Đặt cứu hộ nhanh',
      panelTitle: 'Từng bước rõ ràng, dễ thao tác',
      step1: 'Xác thực',
      step2: 'Dịch vụ',
      step3: 'Vị trí',
      step4: 'Tài xế',
      step5: 'Thanh toán',
      step6: 'Theo dõi',
      verifyTitle: 'Xác thực khách hàng',
      verifyDesc: 'Nhập thông tin cơ bản để giảm bom hàng và chuẩn bị booking.',
      fullName: 'Họ và tên',
      phone: 'Số điện thoại',
      licensePlate: 'Biển số xe',
      vehicleBrand: 'Hãng xe / mẫu xe',
      otpCode: 'Mã OTP',
      sendOtp: 'Gửi OTP',
      otpHint: 'OTP demo để kiểm tra giao diện là <strong>123456</strong>.',
      verifyContinue: 'Xác thực và tiếp tục',
      serviceTitle: 'Chọn dịch vụ',
      serviceDesc: 'Chọn loại xe, loại sự cố và các nhu cầu phát sinh.',
      vehicleMotorbike: 'Xe máy',
      vehicleScooter: 'Xe tay ga',
      vehicleElectric: 'Xe điện',
      vehicleCar: 'Ô tô',
      serviceCategory: 'Nhóm dịch vụ',
      serviceOption: 'Dịch vụ cụ thể',
      extraRequest: 'Yêu cầu thêm',
      priorityNormal: 'Bình thường',
      priorityPriority: 'Ưu tiên nhanh',
      prioritySOS: 'SOS khẩn cấp',
      conditionLevel: 'Tình trạng xe',
      conditionLight: 'Nhẹ / xử lý nhanh',
      conditionMedium: 'Trung bình',
      conditionHard: 'Khó / có thể phát sinh',
      issueNote: 'Mô tả thêm',
      fuelDeliveryTitle: 'Mua xăng hộ / giao nhiên liệu',
      fuelDeliveryDesc: 'Bật tùy chọn này khi xe hết xăng hoặc cần mang nhiên liệu tới.',
      fuelType: 'Loại nhiên liệu',
      fuelLiters: 'Số lít',
      fuelSubtotal: 'Tiền nhiên liệu',
      deliveryFee: 'Phí giao',
      serviceNotice: 'Phí dịch vụ có thể tăng hoặc giảm sau khi tài xế kiểm tra điều kiện xe thực tế.',
      back: 'Quay lại',
      continue: 'Tiếp tục',
      locationTitle: 'Xác nhận vị trí',
      locationDesc: 'Lấy GPS hoặc tìm địa chỉ, sau đó kéo pin để chỉnh chính xác nếu cần.',
      address: 'Địa chỉ',
      searchAddress: 'Tìm',
      useCurrentLocation: 'Vị trí hiện tại',
      currentLatLng: 'Tọa độ hiện tại',
      resolvedAddress: 'Địa chỉ hiển thị',
      locationHint: 'Bạn có thể click trực tiếp lên map hoặc kéo marker khách hàng để chỉnh vị trí.',
      driverTitle: 'Chọn tài xế / thợ phù hợp',
      driverDesc: 'Bạn có thể bấm trực tiếp tài xế trên map hoặc chọn trong danh sách bên dưới.',
      shuffleDrivers: 'Đổi gợi ý tài xế',
      fitDrivers: 'Hiện toàn bộ tài xế',
      paymentTitle: 'Chọn phương thức thanh toán',
      paymentDesc: 'Xác nhận cách thanh toán trước khi gửi yêu cầu tới tài xế.',
      payCash: 'Tiền mặt',
      payCashDesc: 'Thanh toán khi hoàn thành',
      payTransfer: 'Chuyển khoản',
      payTransferDesc: 'Xem thông tin ngân hàng mẫu',
      bankInfoTitle: 'Thông tin chuyển khoản',
      bankName: 'Ngân hàng',
      bankAccount: 'Số tài khoản',
      bankOwner: 'Chủ tài khoản',
      bankContent: 'Nội dung',
      priceEstimate: 'Tạm tính chi phí',
      confirmBooking: 'Xác nhận booking',
      trackingTitle: 'Theo dõi chuyến đi',
      trackingDesc: 'Theo dõi tài xế, trạng thái hiện tại và các bước tiếp theo trên đường đến bạn.',
      driverAssigned: 'Tài xế được gán',
      callDriver: 'Gọi tài xế',
      chatDriver: 'Chat nhanh',
      recalculateRoute: 'Tính lại tuyến',
      eta: 'ETA',
      distanceLeft: 'Khoảng cách',
      currentStepTrip: 'Bước hiện tại',
      bookingSummary: 'Tóm tắt booking',
      backToPayment: 'Quay lại thanh toán',
      newBooking: 'Tạo booking mới',
      mapOverlayEyebrow: 'Bản đồ trực quan',
      mapOverlayTitle: 'Tất cả tài xế hiển thị trên map',
      mapHintDrivers: 'Chạm vào marker để xem nhanh thông tin, xem tuyến hoặc chọn ngay tài xế.',
      liveArea: 'Khu vực hoạt động',
      liveAreaValue: 'TP.HCM · 24/7',
      pricingEyebrow: 'Bản giá tham khảo',
      pricingTitle: 'Khung giá dịch vụ cơ bản',
      pricingOpenToast: 'Đã mở bảng giá tham khảo.',
      otpSent: 'Đã gửi OTP demo. Vui lòng nhập 123456.',
      otpInvalid: 'OTP chưa đúng. Vui lòng nhập 123456.',
      verifyMissing: 'Vui lòng nhập đầy đủ họ tên, số điện thoại và biển số xe.',
      locationUpdated: 'Đã cập nhật vị trí khách hàng.',
      locationError: 'Không lấy được vị trí hiện tại. Hãy thử lại hoặc nhập địa chỉ.',
      geocodeError: 'Không tìm thấy địa chỉ phù hợp.',
      selectDriverFirst: 'Hãy chọn tài xế trước khi tiếp tục.',
      paymentSaved: 'Đã lưu phương thức thanh toán.',
      bookingConfirmed: 'Booking đã được tạo. Đang theo dõi tài xế.',
      driverCalled: 'Giả lập cuộc gọi tới tài xế.',
      driverChatted: 'Mở khung chat nhanh với tài xế.',
      pricingBase: 'Phí dịch vụ cơ bản',
      pricingCondition: 'Điều chỉnh theo tình trạng xe',
      pricingPriority: 'Phụ phí ưu tiên',
      pricingNight: 'Phụ phí ban đêm',
      pricingTravel: 'Phí di chuyển',
      pricingFuel: 'Tiền nhiên liệu',
      pricingFuelDelivery: 'Phí giao nhiên liệu',
      pricingTotal: 'Tổng tạm tính',
      timelineAssigned: 'Đã nhận yêu cầu',
      timelineOnWay: 'Tài xế đang di chuyển',
      timelineArrived: 'Tài xế đã tới nơi',
      timelineWorking: 'Đang kiểm tra / xử lý',
      timelineDone: 'Hoàn thành',
      statusAssigned: 'Đã gán',
      statusOnWay: 'Đang tới',
      statusArrived: 'Đã đến',
      statusWorking: 'Đang xử lý',
      statusDone: 'Hoàn thành',
      stepSummaryVerify: 'Khách hàng',
      stepSummaryService: 'Dịch vụ',
      stepSummaryPayment: 'Thanh toán',
      stepSummaryLocation: 'Vị trí',
      stepSummaryDriver: 'Tài xế',
      stepSummaryNote: 'Lưu ý',
      driverPopupChoose: 'Chọn ngay',
      driverPopupPreview: 'Xem tuyến',
      driverSelected: 'Đã chọn tài xế trên map.',
      previewRouteReady: 'Đã vẽ tuyến đường tới khách.',
      adminTitle: 'Dashboard quản lý đơn',
      adminDesc: 'Thống kê demo từ các booking đã xác nhận trong localStorage.'
    },
    en: {
      togglePricing: 'Price list',
      openAdmin: 'Admin',
      panelEyebrow: 'Fast roadside booking',
      panelTitle: 'Clear step-by-step flow',
      step1: 'Verify',
      step2: 'Service',
      step3: 'Location',
      step4: 'Driver',
      step5: 'Payment',
      step6: 'Tracking',
      verifyTitle: 'Customer verification',
      verifyDesc: 'Enter basic information to reduce fake bookings and prepare your request.',
      fullName: 'Full name',
      phone: 'Phone number',
      licensePlate: 'License plate',
      vehicleBrand: 'Vehicle brand / model',
      otpCode: 'OTP code',
      sendOtp: 'Send OTP',
      otpHint: 'Demo OTP for this interface is <strong>123456</strong>.',
      verifyContinue: 'Verify and continue',
      serviceTitle: 'Choose service',
      serviceDesc: 'Pick vehicle type, problem type and any extra needs.',
      vehicleMotorbike: 'Motorbike',
      vehicleScooter: 'Scooter',
      vehicleElectric: 'Electric bike',
      vehicleCar: 'Car',
      serviceCategory: 'Service category',
      serviceOption: 'Specific service',
      extraRequest: 'Extra option',
      priorityNormal: 'Normal',
      priorityPriority: 'Priority',
      prioritySOS: 'SOS emergency',
      conditionLevel: 'Vehicle condition',
      conditionLight: 'Light / quick fix',
      conditionMedium: 'Medium',
      conditionHard: 'Hard / may vary',
      issueNote: 'Additional notes',
      fuelDeliveryTitle: 'Fuel delivery',
      fuelDeliveryDesc: 'Enable this if the vehicle is out of fuel or you need fuel delivered.',
      fuelType: 'Fuel type',
      fuelLiters: 'Liters',
      fuelSubtotal: 'Fuel subtotal',
      deliveryFee: 'Delivery fee',
      serviceNotice: 'Final cost may go up or down after the driver checks the real vehicle condition.',
      back: 'Back',
      continue: 'Continue',
      locationTitle: 'Confirm location',
      locationDesc: 'Use GPS or search an address, then drag the pin if you need a more precise spot.',
      address: 'Address',
      searchAddress: 'Search',
      useCurrentLocation: 'Current location',
      currentLatLng: 'Current coordinates',
      resolvedAddress: 'Displayed address',
      locationHint: 'You can tap the map or drag the customer marker to adjust the location.',
      driverTitle: 'Choose the best driver / mechanic',
      driverDesc: 'Tap a driver directly on the map or pick one from the list below.',
      shuffleDrivers: 'Shuffle driver suggestions',
      fitDrivers: 'Show all drivers',
      paymentTitle: 'Choose payment method',
      paymentDesc: 'Confirm your payment method before sending the request.',
      payCash: 'Cash',
      payCashDesc: 'Pay after completion',
      payTransfer: 'Bank transfer',
      payTransferDesc: 'View sample bank details',
      bankInfoTitle: 'Transfer information',
      bankName: 'Bank',
      bankAccount: 'Account number',
      bankOwner: 'Account holder',
      bankContent: 'Transfer note',
      priceEstimate: 'Estimated cost',
      confirmBooking: 'Confirm booking',
      trackingTitle: 'Track your trip',
      trackingDesc: 'Track the driver, current status and next steps while they come to you.',
      driverAssigned: 'Assigned driver',
      callDriver: 'Call driver',
      chatDriver: 'Quick chat',
      recalculateRoute: 'Recalculate route',
      eta: 'ETA',
      distanceLeft: 'Distance',
      currentStepTrip: 'Current stage',
      bookingSummary: 'Booking summary',
      backToPayment: 'Back to payment',
      newBooking: 'New booking',
      mapOverlayEyebrow: 'Live map',
      mapOverlayTitle: 'All drivers visible on the map',
      mapHintDrivers: 'Tap any marker to preview details, preview the route or select the driver instantly.',
      liveArea: 'Coverage',
      liveAreaValue: 'Ho Chi Minh City · 24/7',
      pricingEyebrow: 'Reference pricing',
      pricingTitle: 'Basic service pricing',
      pricingOpenToast: 'Reference price drawer opened.',
      otpSent: 'Demo OTP sent. Please enter 123456.',
      otpInvalid: 'Incorrect OTP. Please enter 123456.',
      verifyMissing: 'Please fill in full name, phone number and license plate.',
      locationUpdated: 'Customer location updated.',
      locationError: 'Unable to get current location. Try again or search an address.',
      geocodeError: 'No suitable address found.',
      selectDriverFirst: 'Please choose a driver before continuing.',
      paymentSaved: 'Payment method saved.',
      bookingConfirmed: 'Booking confirmed. Tracking driver now.',
      driverCalled: 'Simulated a phone call to the driver.',
      driverChatted: 'Opened a quick chat mock with the driver.',
      pricingBase: 'Base service fee',
      pricingCondition: 'Condition adjustment',
      pricingPriority: 'Priority surcharge',
      pricingNight: 'Night surcharge',
      pricingTravel: 'Travel fee',
      pricingFuel: 'Fuel cost',
      pricingFuelDelivery: 'Fuel delivery fee',
      pricingTotal: 'Estimated total',
      timelineAssigned: 'Request accepted',
      timelineOnWay: 'Driver is on the way',
      timelineArrived: 'Driver arrived',
      timelineWorking: 'Inspection / fixing',
      timelineDone: 'Completed',
      statusAssigned: 'Assigned',
      statusOnWay: 'On the way',
      statusArrived: 'Arrived',
      statusWorking: 'Working',
      statusDone: 'Completed',
      stepSummaryVerify: 'Customer',
      stepSummaryService: 'Service',
      stepSummaryPayment: 'Payment',
      stepSummaryLocation: 'Location',
      stepSummaryDriver: 'Driver',
      stepSummaryNote: 'Note',
      driverPopupChoose: 'Choose now',
      driverPopupPreview: 'Preview route',
      driverSelected: 'Driver selected from the map.',
      previewRouteReady: 'Route drawn to customer.',
      adminTitle: 'Operations dashboard',
      adminDesc: 'Demo stats based on confirmed bookings saved in localStorage.'
    }
  };

  return {
    bankInfo,
    fuelPrices,
    pricingCatalog,
    serviceCatalog,
    mechanics,
    translations
  };
})();
