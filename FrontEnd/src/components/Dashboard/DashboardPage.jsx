import React, { useState, useEffect } from "react";
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
} from "recharts";
import {
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";

const DashboardPage = (props) => {
  // التحقق من البيانات المستلمة وإعطاء قيم افتراضية
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
  // Fetch data from Firebase using Axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, salonsRes, paymentsRes, bookingsRes] =
          await Promise.all([
            axios.get("http://localhost:3000/api/users/all"),
            axios.get("http://localhost:3000/api/salons"),
            axios.get("http://localhost:3000/api/payments"),
            axios.get("http://localhost:3000/api/bookings"),
          ]);

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

    fetchData();
  }, []);

  useEffect(() => {
    if (!payments.length) return;

    // Process payments data by month
    const monthNames = {
      0: "كانون الثاني",
      1: "شباط",
      2: "آذار",
      3: "نيسان",
      4: "أيار",
      5: "حزيران",
      6: "تموز",
      7: "آب",
      8: "أيلول",
      9: "تشرين الأول",
      10: "تشرين الثاني",
      11: "كانون الأول",
    };

    // Group payments by month
    const paymentsByMonth = payments.reduce((acc, payment) => {
      const date = new Date(payment.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      if (!acc[key]) {
        acc[key] = {
          name: `${monthNames[month]} ${year}`,
          amount: 0,
          count: 0,
        };
      }

      if (payment.status === "completed") {
        acc[key].amount += payment.amount;
        acc[key].count += 1;
      }

      return acc;
    }, {});

    // Convert to array and sort by date
    const monthlyDataArray = Object.values(paymentsByMonth);
    monthlyDataArray.sort((a, b) => {
      const [aMonth, aYear] = a.name.split(" ");
      const [bMonth, bYear] = b.name.split(" ");
      return (
        new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`)
      );
    });

    // Calculate total payments
    const total = monthlyDataArray.reduce(
      (sum, month) => sum + month.amount,
      0
    );

    setMonthlyPaymentsData(monthlyDataArray);
    setTotalAmount(total);
  }, [payments]);

  const formatCurrency = (value) => {
    // التحقق من وجود القيمة قبل استخدام toFixed
    if (value === undefined || value === null) {
      return "0.00 دينار";
    }
    return `${value.toFixed(2)} دينار`;
  };
  // Arabic month names
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

    // Initialize counts for all months
    const monthlyCounts = Array(12).fill(0);

    // Count bookings per month
    bookings.forEach((booking) => {
      if (!booking.isDeleted && !booking.isCanceled) {
        const bookingDate = new Date(booking.date);
        const month = bookingDate.getMonth();
        monthlyCounts[month]++;
      }
    });

    // Create data for chart
    const data = monthlyCounts.map((count, index) => ({
      name: arabicMonths[index],
      bookings: count,
    }));

    setMonthlyData(data);
  }, [bookings]);
  // حساب إجمالي المدفوعات مع التحقق من وجود البيانات
  const totalPayments = Array.isArray(payments)
    ? payments.reduce((total, payment) => total + (payment?.amount || 0), 0)
    : 0;

  const totalUsers = users.length;

  const userTypes = [
    {
      name: "عملاء",
      value:
        (users.filter((user) => user.role === "user").length / totalUsers) *
        100,
    },
    {
      name: "أصحاب صالونات",
      value:
        (users.filter((user) => user.role === "salon").length / totalUsers) *
        100,
    },
    {
      name: "مديرين",
      value:
        (users.filter((user) => user.role === "admin").length / totalUsers) *
        100,
    },
  ];

  const COLORS = ["#8a5936", "#c49a7a", "#a87356", "#4f2c14", "#331b0d"];

  const toggleCard = (cardId) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };

  const processSalonData = (data) => {
    // 1. نرتب الصالونات حسب عدد الزيارات من الأعلى للأقل
    const sortedData = [...data].sort(
      (a, b) => (b.visitors || 0) - (a.visitors || 0)
    );

    // 2. نأخذ أعلى 4 صالونات
    const topSalons = sortedData.slice(0, 4).map((salon) => ({
      name: salon.name,
      value: salon.visitors || 0,
    }));

    // 3. باقي الصالونات نحسب مجموع زياراتهم ونخزنهم تحت "أخرى"
    const otherSalons = sortedData.slice(4);
    const otherValue = otherSalons.reduce(
      (sum, salon) => sum + (salon.visitors || 0),
      0
    );

    // 4. نجمع النتيجة النهائية
    const result = [...topSalons, { name: "أخرى", value: otherValue }];

    return result;
  };

  useEffect(() => {
    if (props.salonDistribution) {
      setSalonDistribution(props.salonDistribution);
      setSalonDataLoading(false);
    } else if (salons && salons.length > 0) {
      const processedSalons = processSalonData(salons);
      setSalonDistribution(processedSalons);
      setSalonDataLoading(false);
    } else {
      const defaultData = [
        { name: "صالون A", value: 30 },
        { name: "صالون B", value: 25 },
        { name: "صالون C", value: 20 },
        { name: "صالون D", value: 15 },
        { name: "أخرى", value: 10 },
      ];
      setSalonDistribution(defaultData);
      setSalonDataLoading(false);
    }
  }, [props.salonDistribution, salons]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        {/* البطاقات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">الصالونات</p>
                <h3 className="text-2xl font-bold">{salons.length}</h3>
              </div>
              <div className="p-3 bg-[#f6e9dc] rounded-full">
                <TrendingUp className="h-6 w-6 text-[#8a5936]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">المستخدمين</p>
                <h3 className="text-2xl font-bold">{users.length}</h3>
              </div>
              <div className="p-3 bg-[#f6e9dc] rounded-full">
                <Users className="h-6 w-6 text-[#8a5936]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">الحجوزات</p>
                <h3 className="text-2xl font-bold">{bookings.length}</h3>
              </div>
              <div className="p-3 bg-[#f6e9dc] rounded-full">
                <Calendar className="h-6 w-6 text-[#8a5936]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">المدفوعات</p>
                <h3 className="text-2xl font-bold">{totalPayments} د.أ</h3>
              </div>
              <div className="p-3 bg-[#f6e9dc] rounded-full">
                <CreditCard className="h-6 w-6 text-[#8a5936]" />
              </div>
            </div>
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* مخطط الحجوزات الشهرية */}
          <div className="w-full bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-right">
              عدد الحجوزات الشهرية
            </h2>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 40,
                  }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} حجز`, "عدد الحجوزات"]}
                    labelFormatter={(label) => `شهر ${label}`}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="#a0714f"
                    name="عدد الحجوزات"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* مخطط المدفوعات الشهرية */}
          <div className="w-full bg-white rounded-lg shadow p-6" dir="rtl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                المدفوعات الشهرية
              </h2>
              <div className="bg-[#f6e9dc] px-4 py-2 rounded-md">
                <span className="text-[#8a5936] font-medium">
                  إجمالي المدفوعات:{" "}
                </span>
                <span className="text-[#8a5936] font-bold">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {monthlyPaymentsData.length > 0 ? (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyPaymentsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" />
                    <YAxis
                      tickFormatter={(value) => `${value} دينار`}
                      label={{
                        value: "المبلغ (دينار)",
                        angle: -90,
                        position: "insideLeft",
                        dx: 20,
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${value.toFixed(2)} دينار`,
                        "المبلغ",
                      ]}
                      labelStyle={{
                        fontFamily: "Arial",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar
                      dataKey="amount"
                      name="إجمالي المدفوعات"
                      fill="#a0714f"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-72 bg-gray-50 rounded-lg">
                <svg
                  className="w-16 h-16 text-[#a0714f]"
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
                <p className="mt-4 text-gray-600">
                  لا توجد بيانات مدفوعات متاحة
                </p>
              </div>
            )}
          </div>
        </div>

        {/* صف ثالث للرسوم البيانية الدائرية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* توزيع الصالونات */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">توزيع الصالونات</h3>
              <button
                onClick={() => toggleCard("salons-dist")}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedCard === "salons-dist" ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>
            </div>
            <div
              className={`transition-all duration-300 ${
                expandedCard === "salons-dist" ? "h-96" : "h-64"
              }`}
            >
              {salonDataLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">جاري تحميل البيانات...</p>
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
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* توزيع المستخدمين */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">أنواع المستخدمين</h3>
              <button
                onClick={() => toggleCard("users-dist")}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedCard === "users-dist" ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>
            </div>
            <div
              className={`transition-all duration-300 ${
                expandedCard === "users-dist" ? "h-96" : "h-64"
              }`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userTypes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
