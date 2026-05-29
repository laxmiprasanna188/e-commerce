import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: [],
  });

  // FETCH DATA
  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalProducts: res.data.totalProducts || 0,
          totalOrders: res.data.totalOrders || 0,
          totalSales: res.data.totalSales || 0,
          salesByDate: res.data.salesByDate || [],
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // SAFE NORMALIZER (VERY IMPORTANT)
  const normalizedData = stats.salesByDate.map((item, index) => {
    // CASE 1: backend sends string date
    if (typeof item === "string") {
      return {
        date: item,
        amount: 0,
      };
    }

    // CASE 2: backend sends number only
    if (typeof item === "number") {
      return {
        date: `Day ${index + 1}`,
        amount: item,
      };
    }

    // CASE 3: backend sends object
    return {
      date: item.date || item._id || `Day ${index + 1}`,
      amount: item.amount || item.totalSales || 0,
    };
  });

  // CHART DATA
  const chartData = {
    labels: normalizedData.map((item) =>
      item.date.includes("Day")
        ? item.date
        : new Date(item.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })
    ),

    datasets: [
      {
        label: "Sales",

        data: normalizedData.map((item) => item.amount),

        borderColor: "#ec4899",
        borderWidth: 3,
        tension: 0.4,
        fill: true,

        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );

          gradient.addColorStop(0, "rgba(236,72,153,0.4)");
          gradient.addColorStop(1, "rgba(236,72,153,0)");

          return gradient;
        },

        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ec4899",
      },
    ],
  };

  // OPTIONS
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        displayColors: false,
      },
    },

    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#9ca3af" },
      },
    },
  };

  return (
    <div className="pl-[320px] pr-10 pt-24 min-h-screen bg-gray-100">

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card className="bg-pink-500 text-white">
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent className="text-4xl font-bold">{stats.totalUsers}</CardContent>
        </Card>

        <Card className="bg-pink-500 text-white">
          <CardHeader><CardTitle>Total Products</CardTitle></CardHeader>
          <CardContent className="text-4xl font-bold">{stats.totalProducts}</CardContent>
        </Card>

        <Card className="bg-pink-500 text-white">
          <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
          <CardContent className="text-4xl font-bold">{stats.totalOrders}</CardContent>
        </Card>

        <Card className="bg-pink-500 text-white">
          <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
          <CardContent className="text-4xl font-bold">₹{stats.totalSales}</CardContent>
        </Card>
      </div>

      {/* CHART */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sales (Last 30 Days)</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-[400px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSales;