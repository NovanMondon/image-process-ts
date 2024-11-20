import { Bar } from "react-chartjs-2";
import { Chart, LinearScale, BarElement, Tooltip } from "chart.js";

Chart.register(LinearScale, BarElement, Tooltip);

export type HistogramProp = {
  values: number[]
}

const Histogram = (arg: { prop: HistogramProp }) => {
  const chartData = {
    datasets: [
      {
        label: "Frequency",
        data: arg.prop.values.map((value, index) => ({ x: index, y: value })),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
      },
    },
  } as const;

  return <Bar data={chartData} options={options} />;
};

export default Histogram;
