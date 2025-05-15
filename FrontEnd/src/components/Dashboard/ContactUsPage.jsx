import { useEffect, useState } from "react";
import {
  Mail,
  Inbox,
  Clock,
  Send,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import Swal from "sweetalert2";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [activeMessage, setActiveMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    replied: 0,
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter]);

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/contacts");
      const data = await res.json();
      setMessages(data.data || []);
      setFilteredMessages(data.data || []);

      const unreadCount = data.data.filter(
        (msg) => msg.status === "Unread"
      ).length;
      setStats({
        total: data.data.length,
        unread: unreadCount,
        replied: data.data.length - unreadCount,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages", error);
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = [...messages];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(term) ||
          msg.email.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((msg) => msg.status === statusFilter);
    }

    setFilteredMessages(filtered);
  };

  const updateMessageStatus = async (messageId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/contacts/${messageId}`,
        {
          method: "Put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Read",
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        console.error("Failed to update message status in database");
      }
    } catch (error) {
      console.error("Error updating message status", error);
    }
  };

  const handleReply = async (email) => {
    if (!replyMessage.trim()) {
      Swal.fire({
        title: "خطأ",
        text: "الرجاء كتابة رسالة للإرسال!",
        icon: "error",
        confirmButtonText: "حسنًا",
        confirmButtonColor: "#8a5936",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          to: email,
          subject: "رد على رسالتك",
          message: replyMessage,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const messageToUpdate = messages.find(
          (msg) => msg.email === email && msg.status === "Unread"
        );

        if (messageToUpdate) {
          await updateMessageStatus(messageToUpdate._id);

          const updatedMessages = messages.map((msg) => {
            if (msg._id === messageToUpdate._id) {
              return { ...msg, status: "Read" };
            }
            return msg;
          });

          setMessages(updatedMessages);

          setStats((prevStats) => ({
            ...prevStats,
            unread: Math.max(prevStats.unread - 1, 0),
            replied: prevStats.replied + 1,
          }));
        }

        Swal.fire({
          title: "تم",
          text: "تم إرسال البريد الإلكتروني بنجاح!",
          icon: "success",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#8a5936",
        }).then(() => {
          setReplyMessage("");
          setActiveMessage(null);
        });
      } else {
        Swal.fire({
          title: "خطأ",
          text: "فشل في إرسال البريد الإلكتروني.",
          icon: "error",
          confirmButtonText: "حسنًا",
          confirmButtonColor: "#8a5936",
        });
      }
    } catch (error) {
      console.error("Error sending email", error);
      Swal.fire({
        title: "خطأ",
        text: "حدث خطأ أثناء إرسال البريد الإلكتروني.",
        icon: "error",
        confirmButtonText: "حسنًا",
        confirmButtonColor: "#8a5936",
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f4e5d6]/10">
        <div className="text-[#8a5936] text-xl font-semibold flex items-center">
          <Clock className="animate-spin mr-2" />
          جاري تحميل الرسائل...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4e5d6]/10">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-r-4 border-[#8a5936]">
            <div className="flex items-center">
              <div className="bg-[#8a5936]/10 p-3 rounded-full">
                <MessageSquare className="text-[#8a5936]" />
              </div>
              <div className="mr-4">
                <p className="text-gray-500 text-sm">إجمالي الرسائل</p>
                <p className="text-2xl font-bold text-[#8a5936]">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-r-4 border-red-500">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="text-red-500" />
              </div>
              <div className="mr-4">
                <p className="text-gray-500 text-sm">رسائل غير مقروءة</p>
                <p className="text-2xl font-bold text-red-500">
                  {stats.unread}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-r-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="text-green-500" />
              </div>
              <div className="mr-4">
                <p className="text-gray-500 text-sm">رسائل تم الرد عليها</p>
                <p className="text-2xl font-bold text-green-500">
                  {stats.replied}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#8a5936] text-[#f4e5d6] px-6 py-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Mail className="ml-2" /> رسائل الاتصال
            </h2>
          </div>

          {activeMessage ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setActiveMessage(null)}
                  className="flex items-center hover:cursor-pointer text-[#8a5936] hover:underline"
                >
                  <Inbox className="mr-1 h-4 w-4 hover:cursor-pointer" />
                  العودة إلى قائمة الرسائل
                </button>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    activeMessage.status === "Unread"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {activeMessage.status === "Unread" ? "غير مقروءة" : "مقروءة"}
                </span>
              </div>

              <div className="bg-[#f4e5d6]/10 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="bg-[#8a5936] text-[#f4e5d6] rounded-full p-3">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg text-[#8a5936]">
                      {activeMessage.name}
                    </h3>
                    <p className="text-gray-600">{activeMessage.email}</p>
                  </div>
                </div>
                <div className="bg-white rounded p-4 shadow-sm border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {activeMessage.message}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-bold text-[#8a5936] mb-3">إرسال رد</h3>
                <textarea
                  className="w-full border rounded p-3 mb-4 focus:border-[#a0714f] focus:ring focus:ring-[#a0714f]/20 outline-none"
                  rows="6"
                  placeholder="أكتب الرد هنا ..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleReply(activeMessage.email)}
                    className="bg-[#a0714f] hover:cursor-pointer text-[#f4e5d6] px-6 py-2 rounded-md hover:bg-[#8a5936] transition-colors flex items-center"
                  >
                    <Send className="mr-2 h-4 w-4" /> إرسال رد
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="بحث بالاسم أو الايميل..."
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:border-[#a0714f] focus:ring focus:ring-[#a0714f]/20 outline-none"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className="flex items-center min-w-fit">
                    <Filter className="h-5 w-5 text-gray-400 mr-2" />
                    <select
                      className="border rounded-md px-3 py-2 bg-white focus:border-[#a0714f] focus:ring focus:ring-[#a0714f]/20 outline-none"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                    >
                      <option value="all">جميع الرسائل</option>
                      <option value="Unread">غير مقروءة</option>
                      <option value="Read">مقروءة</option>
                    </select>
                  </div>
                </div>
              </div>

              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="bg-[#f4e5d6]/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Inbox className="text-[#8a5936] h-8 w-8" />
                  </div>
                  <p className="text-gray-500">
                    {messages.length === 0
                      ? "لا توجد رسائل بعد."
                      : "لا توجد نتائج تطابق بحثك."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`p-4 hover:bg-[#f4e5d6]/10 cursor-pointer transition-colors ${
                        msg.status === "Unread" ? "bg-[#f4e5d6]/5" : ""
                      }`}
                      onClick={() => setActiveMessage(msg)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full mr-3 ${
                              msg.status === "Unread"
                                ? "bg-red-100"
                                : "bg-green-100"
                            }`}
                          >
                            <User
                              className={`h-5 w-5 ${
                                msg.status === "Unread"
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-[#8a5936]">
                              {msg.name}
                            </p>
                            <p className="text-sm text-gray-500">{msg.email}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            msg.status === "Unread"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {msg.status === "Unread" ? "غير مقروءة" : "مقروءة"}
                        </span>
                      </div>
                      <div className="pl-10">
                        <p className="text-gray-700 line-clamp-2">
                          {msg.message}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMessage(msg);
                          }}
                          className="text-[#a0714f] hover:cursor-pointer hover:text-[#8a5936] text-sm mt-2 flex items-center"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" /> رد
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
