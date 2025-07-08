import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CalendarDays } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { moneyData, parseDate } from '../utils/utils';
import { useUser } from '../context/UserContext';

const EarningsChart = () => {
  const { user } = useUser();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState(moneyData);
  const [activeFilter, setActiveFilter] = useState("7days");

  // Check if user is admin or teacher
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const isTeacher = user?.role?.toLowerCase() === 'teacher';

  // If not admin or teacher, don't render the component
  if (!isAdmin && !isTeacher) {
    return null;
  }

  const handleLast7Days = () => {
    setActiveFilter("7days");
    setStartDate(null);
    setEndDate(null);
    setFilteredData(moneyData.slice(-7));
  };

  const handleLast30Days = () => {
    setActiveFilter("30days");
    setStartDate(null);
    setEndDate(null);
    setFilteredData(moneyData.slice(-30));
  };

  const handleDateRange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setActiveFilter("custom");
    if (start && end) {
      setFilteredData(
        moneyData.filter((item) => {
          const d = parseDate(item.date);
          return d >= start && d <= end;
        })
      );
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-700">{label}</p>
          <p className="text-teal-600">
            Earnings: <span className="font-bold">${payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl mx-auto px-6 py-8 w-[96%]">
      <div className="flex justify-between items-center mb-6">
        <p className="font-bold text-3xl text-gray-600">Earnings Overview</p>
        <div className="flex items-center space-x-2">
          <button
            className={`px-4 py-2 rounded-3xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-teal-50 transition ${activeFilter === "7days" ? "bg-teal-100 border-teal-400" : ""}`}
            onClick={handleLast7Days}
          >
            Last 7 Days
          </button>
          <button
            className={`px-4 py-2 rounded-3xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-teal-50 transition ${activeFilter === "30days" ? "bg-teal-100 border-teal-400" : ""}`}
            onClick={handleLast30Days}
          >
            Last 30 Days
          </button>
          <div className={`relative flex items-center border border-gray-300 rounded-3xl px-4 py-2 bg-white hover:bg-teal-50 transition ${activeFilter === "custom" ? "border-teal-400 bg-teal-100" : ""}`}>
            <CalendarDays className="text-teal-600 mr-2" />
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRange}
              isClearable
              placeholderText="Select Date Range"
              className="outline-none bg-transparent cursor-pointer text-teal-600 font-semibold"
            />
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMoney" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="money" stroke="#14b8a6" fillOpacity={1} fill="url(#colorMoney)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart; 