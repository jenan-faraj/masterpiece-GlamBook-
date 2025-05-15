import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  Activity,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Percent,
  PieChart as PieChartIcon,
  BarChart2,
} from "lucide-react";

const DashboardPage = () => {
  const [salons, setSalons] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [salonDistribution, setSalonDistribution] = useState([]);
  const [salonDataLoading, setSalonDataLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyPaymentsData, setMonthlyPaymentsData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchData = async () => {
    try {
      const [usersRes, salonsRes, paymentsRes, bookingsRes] = await Promise.all(
        [
          axios.get("http://localhost:3000/api/users/all"),
          axios.get("http://localhost:3000/api/salons"),
          axios.get("http://localhost:3000/api/payments"),
          axios.get("http://localhost:3000/api/bookings"),
        ]
      );

      const fetchedUsers = Object.keys(usersRes.data).map((key) => ({
        id: key,
        ...usersRes.data[key],
      }));

      const fetchedSalons = Object.keys(salonsRes.data).map((key) => ({
        id: key,
        ...salonsRes.data[key],
      }));

      const fetchedPayments = Object.keys(paymentsRes.data).map((key) => ({
        id: key,
        ...paymentsRes.data[key],
      }));

      const fetchedBookings = Object.keys(bookingsRes.data).map((key) => ({
        id: key,
        ...bookingsRes.data[key],
      }));
      const dataObject = bookingsRes.data.data;
      if (dataObject && typeof dataObject === "object") {
        const dataOnly = Object.keys(dataObject)
          .filter((key) => key !== "id")
          .map((key) => dataObject[key]);

        setBookings(dataOnly);
      } else {
        console.error("dataObject is missing or not valid:", dataObject);
      }

      setUsers(fetchedUsers);
      setSalons(fetchedSalons);
      setPayments(fetchedPayments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return "0.00 دينار";
    }
    return `${value.toFixed(2)} دينار`;
  };

  const arabicMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  useEffect(() => {
    if (!bookings || bookings.length === 0) return;

    const monthlyCounts = Array(12).fill(0);
    const monthlyCompletedCounts = Array(12).fill(0);

    bookings.forEach((booking) => {
      if (!booking.isDeleted) {
        const bookingDate = new Date(booking.date);
        const month = bookingDate.getMonth();
        monthlyCounts[month]++;

        if (booking.isCompleted && !booking.isCanceled) {
          monthlyCompletedCounts[month]++;
        }
      }
    });

    const data = monthlyCounts.map((count, index) => ({
      name: arabicMonths[index],
      الحجوزات: count,
      المكتملة: monthlyCompletedCounts[index],
    }));

    setMonthlyData(data);
  }, [bookings]);

  useEffect(() => {
    if (!payments.length) return;

    const paymentsByMonth = payments.reduce((acc, payment) => {
      const date = new Date(payment.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      if (!acc[key]) {
        acc[key] = {
          name: `${arabicMonths[month]} ${year}`,
          المبلغ: 0,
          العدد: 0,
          الربح: 0,
        };
      }

      if (payment.status === "completed") {
        acc[key].المبلغ += payment.amount;
        acc[key].الربح += payment.amount * 0.15;
        acc[key].العدد += 1;
      }

      return acc;
    }, {});

    const monthlyDataArray = Object.values(paymentsByMonth);

    const total = monthlyDataArray.reduce(
      (sum, month) => sum + month.المبلغ,
      0
    );

    setMonthlyPaymentsData(monthlyDataArray);
    setTotalAmount(total);
  }, [payments]);

  const totalPayments = Array.isArray(payments)
    ? payments.reduce((total, payment) => total + (payment?.amount || 0), 0)
    : 0;

  const totalProfit20 = totalPayments * 0.15;

  const userTypes = [
    {
      name: "عملاء",
      value: users.filter((user) => user.role === "user").length,
    },
    {
      name: "أصحاب صالونات",
      value: users.filter((user) => user.role === "salon").length,
    },
    {
      name: "مديرين",
      value: users.filter((user) => user.role === "admin").length,
    },
  ];

  const processSalonData = (data) => {
    const sortedData = [...data].sort(
      (a, b) => (b.visitors || 0) - (a.visitors || 0)
    );

    const topSalons = sortedData.slice(0, 4).map((salon) => ({
      name: salon.name,
      value: salon.visitors || 0,
    }));

    const otherSalons = sortedData.slice(4);
    const otherValue = otherSalons.reduce(
      (sum, salon) => sum + (salon.visitors || 0),
      0
    );

    return [...topSalons, { name: "أخرى", value: otherValue }];
  };

  useEffect(() => {
    if (salons && salons.length > 0) {
      const processedSalons = processSalonData(salons);
      setSalonDistribution(processedSalons);
      setSalonDataLoading(false);
    } else {
      const defaultData = [
        { name: "صالون أ", value: 30 },
        { name: "صالون ب", value: 25 },
        { name: "صالون ج", value: 20 },
        { name: "صالون د", value: 15 },
        { name: "أخرى", value: 10 },
      ];
      setSalonDistribution(defaultData);
      setSalonDataLoading(false);
    }
  }, [salons]);

  const COLORS = ["#8a5936", "#c49a7a", "#a87356", "#4f2c14", "#331b0d"];

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">
      <div className="p-2 sm:p-4 md:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#a0714f] mb-4 sm:mb-6 px-2">
          لوحة المعلومات
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-8 px-2">
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 transition-all hover:shadow-lg border-r-4 border-[#8a5936]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  الصالونات
                </p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                  {salons.length}
                </h3>
              </div>
              <div className="p-2 sm:p-3 bg-[#f6e9dc] rounded-full">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#8a5936]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 transition-all hover:shadow-lg border-r-4 border-[#a87356]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  المستخدمين
                </p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                  {users.length}
                </h3>
              </div>
              <div className="p-2 sm:p-3 bg-[#f6e9dc] rounded-full">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#a87356]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 transition-all hover:shadow-lg border-r-4 border-[#c49a7a]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  الحجوزات
                </p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                  {bookings.length}
                </h3>
              </div>
              <div className="p-2 sm:p-3 bg-[#f6e9dc] rounded-full">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#c49a7a]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 transition-all hover:shadow-lg border-r-4 border-[#4f2c14]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  المدفوعات
                </p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                  {formatCurrency(totalPayments)}
                </h3>
              </div>
              <div className="p-2 sm:p-3 bg-[#f6e9dc] rounded-full">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[#4f2c14]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 mb-4 sm:mb-8 border-r-4 border-green-600 mx-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse mb-3 sm:mb-0">
              <div className="p-2 sm:p-3 md:p-4 mx-2 sm:mx-3 bg-green-100 rounded-full">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-1">
                  إجمالي الأرباح (15% من المدفوعات)
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                  {formatCurrency(totalProfit20)}
                </h2>
              </div>
            </div>
            <div className="flex items-center bg-green-100 p-2 rounded mr-2 sm:mr-0">
              <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-1" />
              <span className="font-semibold text-green-600">15</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8 px-2">
          <div className="w-full bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-right flex items-center">
                <BarChart2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-[#8a5936]" />
                <span className="hidden xs:inline">عدد الحجوزات الشهرية</span>
                <span className="xs:hidden">الحجوزات</span>
              </h2>
              <div className="p-1 px-2 sm:px-3 bg-[#f6e9dc] rounded text-xs sm:text-sm text-[#8a5936] font-semibold">
                {bookings.length} حجز
              </div>
            </div>
            <div className="w-full h-48 sm:h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -40,
                    bottom: 1,
                  }}
                  barSize={16}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={11}
                    textAnchor="start"
                    height={60}
                    tick={{ fontSize: 10, fontWeight: "bold" }}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12, fontWeight: "bold" }} />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} حجز`,
                      name === "الحجوزات"
                        ? "إجمالي الحجوزات"
                        : "الحجوزات المكتملة",
                    ]}
                    labelFormatter={(label) => `شهر ${label}`}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: 5,
                      fontSize: 15,
                      paddingLeft: 50,
                    }}
                  />
                  <Bar
                    dataKey="الحجوزات"
                    fill="#8a5936"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="المكتملة"
                    fill="#c49a7a"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="w-full bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                <Activity className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-[#8a5936]" />
                <span className="hidden xs:inline">
                  المدفوعات والأرباح الشهرية
                </span>
                <span className="xs:hidden">المدفوعات</span>
              </h2>
              <div className="bg-[#f6e9dc] px-2 sm:px-4 py-1 rounded-md text-xs sm:text-sm">
                <span className="text-[#8a5936] font-medium">الإجمالي: </span>
                <span className="text-[#8a5936] font-bold">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {monthlyPaymentsData.length > 0 ? (
              <div className="w-full h-48 sm:h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyPaymentsData}
                    margin={{ top: 10, right: 10, left: -40, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={0}
                      textAnchor="end"
                      tick={{ fontSize: 10, fontWeight: "bold" }}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value} د.أ`}
                      tick={{ fontSize: 10, fontWeight: "bold" }}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${value.toFixed(2)} دينار`,
                        "المبلغ",
                      ]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: 35,
                        fontSize: 15,
                        paddingLeft: 50,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="المبلغ"
                      name="إجمالي المدفوعات"
                      fill="#a0714f"
                      stroke="#a0714f"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="الربح"
                      name="الأرباح (20%)"
                      fill="#4CAF50"
                      stroke="#4CAF50"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64 md:h-72 bg-gray-50 rounded-lg">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-[#a0714f]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <p className="mt-4 text-gray-600 text-sm">
                  لا توجد بيانات مدفوعات متاحة
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 px-2">
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-700 flex items-center">
                <PieChartIcon className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-[#8a5936]" />
                توزيع زيارات الصالونات
              </h3>
              <button
                onClick={() => toggleCard("salons-dist")}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedCard === "salons-dist" ? (
                  <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
            <div
              className={`transition-all duration-300 ${
                expandedCard === "salons-dist"
                  ? "h-64 sm:h-80 md:h-96"
                  : "h-48 sm:h-56 md:h-64"
              }`}
            >
              {salonDataLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-sm">
                    جاري تحميل البيانات...
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salonDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={20}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salonDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} زيارة`} />
                    <Legend
                      verticalAlign="bottom"
                      wrapperStyle={{ fontSize: 13, fontWeight: "bold" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-700 flex items-center">
                <Users className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-[#8a5936]" />
                أنواع المستخدمين
              </h3>
              <button
                onClick={() => toggleCard("users-dist")}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedCard === "users-dist" ? (
                  <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
            <div
              className={`transition-all duration-300 ${
                expandedCard === "users-dist"
                  ? "h-64 sm:h-80 md:h-96"
                  : "h-48 sm:h-56 md:h-64"
              }`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="80%"
                  barSize={15}
                  data={userTypes}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    angleAxisId={0}
                    fill="#8884d8"
                    label={{
                      position: "insideStart",
                      fill: "#fff",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {userTypes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </RadialBar>
                  <Legend
                    iconSize={10}
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: 13, fontWeight: "bold" }}
                    formatter={(value, entry) => {
                      const { payload } = entry;
                      return `${value}: ${payload.value}`;
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => [`${value} مستخدم`, name]}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 sm:mt-6 px-2 pb-6">
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-700 flex items-center mb-2 sm:mb-0">
                <DollarSign className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                تحليل الأرباح
              </h3>
              <div className="p-1 sm:p-2 bg-green-100 rounded text-xs sm:text-sm text-green-600 font-semibold">
                نسبة الربح: 15%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-6">
              <div className="p-2 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-xs sm:text-sm mb-1">
                  إجمالي المدفوعات
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div className="p-2 sm:p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-gray-500 text-xs sm:text-sm mb-1">
                  صافي الربح
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                  {formatCurrency(totalAmount * 0.15)}
                </p>
              </div>
            </div>

            <div className="w-full h-48 sm:h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyPaymentsData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fontWeight: "bold" }}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(value) => `${value} د.أ`}
                    tick={{ fontSize: 11, fontWeight: "bold" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `${value} د.أ`}
                    tick={{ fontSize: 11, fontWeight: "bold" }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value.toFixed(2)} دينار`,
                      name === "المبلغ" ? "إجمالي المدفوعات" : "صافي الربح",
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: 13, fontWeight: "bold" }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="المبلغ"
                    name="المدفوعات"
                    stroke="#8a5936"
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="الربح"
                    name="الأرباح"
                    stroke="#4CAF50"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
