"use client";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import dynamic from "next/dynamic";
import { color } from "framer-motion";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

const CustomizedLabelPie = ({ height = 300, data, label=null, pie_colors=null, formatter=true }) => {
  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const series = data.map((v) => v.value);
  const COLORS = [
    "#f2c744",
    "#6b21a8",
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].blue})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].success})`,
    `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].secondary})`,
  ];
  const options = {
    chart: {
      type: "pie",
    },
    labels: label ? label : ["Self Bonded", "Delegated"],
    colors: pie_colors ? pie_colors : [COLORS[0], COLORS[1],COLORS[0], COLORS[1],COLORS[0]],
    stroke: {
      show: true,
      colors: "white",
      width: 1,
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
      labels: {
        colors: ["rgb(148, 163, 184)", "rgb(148, 163, 184)","rgb(148, 163, 184)","rgb(148, 163, 184)","rgb(148, 163, 184)",],
        // useSeriesColors: true
      },
    },
    tooltip: {
      enabled: true,
      y: formatter ? {
        formatter: (v) => numberWithSpaces(parseFloat(v).toFixed(2)) + ' NTN',
      } : {
        formatter: (v) => v,
      },
    },
  };

  return (
    <div className="p-0 m-0">
      <ResponsiveContainer width="100%" height={height + 22}>
        <ApexChart
          type="pie"
          options={options}
          series={series}
          className="w-full p-0 m-0"
        />
      </ResponsiveContainer>
    </div>
  );
};

export default CustomizedLabelPie;
